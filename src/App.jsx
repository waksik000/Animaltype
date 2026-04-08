import { useEffect, useState, useRef } from "react";
import "./App.css";
import wordsData from "./data/words.json";
import Settings from "./components/Settings";
import Timer from "./components/Timer";
import TypingArea from "./components/TypingArea";
import AuthModal from "./components/AuthModal";
import Leaderboard from "./components/Leaderboard";
import ResultModal from "./components/ResultModal";
import HistoryModal from "./components/HistoryModal";
import SupportChat from "./components/SupportChat";
function App() {
  const [userLanguage, setUserLanguage] = useState("ru"); // выбор языка
  const [lines, setLines] = useState([]); // массив строк для отображения
  const [typedChars, setTypedChars] = useState([]); // символы текущей строки
  const [allTypedChars, setAllTypedChars] = useState([]); // Массив всех введённых символов для точного расчёта WPM/ошибок
  const typingRef = useRef(null);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Проверяем токен при загрузке
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  // Функция для получения роли из токена
  const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return 'user';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'user';
    } catch {
      return 'user';
    }
  };

  const isAdmin = getUserRole() === 'admin';

  // Расчёт статистики из всех введённых символов
  const correctChars = allTypedChars.filter((c) => c.status === "correct").length;
  const timeElapsed = timeLimit - timeLeft;
  const userWPM = timeElapsed > 0 ? correctChars / 5 / (timeElapsed / 60) : 0;
  const accuracy = allTypedChars.length === 0 ? 100 : (correctChars / allTypedChars.length) * 100;
  const errors = allTypedChars.filter((c) => c.status === "incorrect").length;

  function generateText(lang, wordCount = 20) {
    const source = wordsData[lang];
    let text = [];
    for (let i = 0; i < wordCount; i++) {
      const word = source[Math.floor(Math.random() * source.length)];
      text.push(word);
    }
    return text.join(" ");
  }
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        console.log('Timer tick:', prev - 1);
        return Math.max(prev - 1, 0);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0) {
      //запумк окна с результатмо
      setIsRunning(false);
      setShowResults(true);


      // сохранение на сервер через API
      const newAttempt = {
        date: new Date().toISOString(),
        wpm: Math.round(userWPM),
        accuracy: Math.round(accuracy),
        errors,
      };
      // Отправляем POST-запрос на сервер для сохранения результата
      const token = localStorage.getItem('token');
      fetch('http://localhost:5000/api/results', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAttempt)
      })
        .then(res => {
          if (!res.ok) {
            console.error('Ошибка при сохранении результата:', res.status);
          }
        })
        .catch(err => console.error('Ошибка сохранения:', err));
    }
  }, [timeLeft, accuracy, errors, userWPM]);

  useEffect(() => {
    if (typingRef.current) typingRef.current.focus();
  }, [isRunning]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowAuth(false);
        setShowLeaderboard(false);
        setShowHistory(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  function handleStart() {
    const initialLines = [
      generateText(userLanguage, 20),
      generateText(userLanguage, 20),
      generateText(userLanguage, 20),
      generateText(userLanguage, 20),
      generateText(userLanguage, 20),
    ];
    setLines(initialLines);
    setTypedChars([]);
    setAllTypedChars([]); // Очищаем все введённые символы
    setTimeLeft(timeLimit);
    setIsRunning(true);
    setShowResults(false);
    if (typingRef.current) typingRef.current.focus();
  }

  function handleKeyDown(e) {
    if (timeLeft === 0) return;
    e.preventDefault();

    // Backspace
    if (e.key === "Backspace") {
      setTypedChars((prev) => prev.slice(0, -1));
      return;
    }
    if (e.key.length > 1) return;

    const currentIndex = typedChars.length;
    const currentLine = lines[0];
    const expectedChar = currentLine[currentIndex] || "";
    const status = e.key === expectedChar ? "correct" : "incorrect";

    setTypedChars((prev) => [...prev, { char: e.key, status }]);
    setAllTypedChars((prev) => [...prev, { char: e.key, status }]); // Добавляем символ в общий массив

    // Проверка завершения текущей строки
    if (typedChars.length + 1 >= currentLine.length) {
      // Сдвиг строк: первая исчезает, вторая становится первой, третья второй, добавляется новая третья
      setLines((prev) => [...prev.slice(1), generateText(userLanguage, 20)]);
      setTypedChars([]); // очистка ввода
    }
  }

  function handleRestart() {
    setTypedChars([]);
    setAllTypedChars([]); // Очищаем
    setTimeLeft(timeLimit);
    setIsRunning(false);
    setShowResults(false);
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Animaltype</h1>
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <button onClick={() => setShowAuth(true)}>Войти / Зарегистрироваться</button>
          ) : (
            <>
              <button onClick={() => setShowLeaderboard(true)}>Лидеры</button>
              <button onClick={() => setShowSupport(true)}>Поддержка</button>
              <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }}>Выйти</button>
            </>
          )}
        </div>
      </header>

      <p className="subtitle">Проверка скорости печати</p>

      {!isLoggedIn ? (
        <div className="not-logged-in">
          <h2>Пожалуйста, зарегистрируйтесь или войдите в аккаунт</h2>
          <p>Нажмите кнопку "Войти / Зарегистрироваться" в верхнем правом углу, чтобы начать печать!</p>
        </div>
      ) : (
        <>
      {!isRunning && (
        <Settings
          userLanguage={userLanguage}
          setUserLanguage={setUserLanguage}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
          handleStart={handleStart}
        />
)}

      {(isRunning || lines.length > 0) && (
        <Timer
        timeLeft={timeLeft}/>
      )}

      {(isRunning || lines.length > 0) && (
        <TypingArea
          lines={lines}
          typedChars={typedChars}
          handleKeyDown={handleKeyDown}
          typingRef={typingRef}
        />
      )}

      </>
      )}

      {showResults && (
        <ResultModal
        userWPM = {userWPM}
        accuracy = {accuracy}
        errors = {errors}
        handleRestart = {handleRestart}
        setShowHistory={setShowHistory}
        isLoggedIn={isLoggedIn}
        />
      )}

      {showHistory && (
        <HistoryModal
          onClose={() => setShowHistory(false)}
        >

        </HistoryModal>
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={() => setIsLoggedIn(true)}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {showSupport && (
        <SupportChat
          onClose={() => setShowSupport(false)}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}

export default App;