import { useEffect, useState, useRef, use } from "react";
import "./App.css";
import wordsData from "./data/words.json";

function App() {
  const [userLanguage, setUserLanguage] = useState("en");

  const [displayText, setDisplayText] = useState(""); // строка с текстом для печати
  const [splitText, setSplitText] = useState([]); // массив символов для подсветки
  const typingRef = useRef(null); // useRef для автофокуса на поле ввода
  const [typedChars, setTypedChars] = useState([]); // ввод символов
  const [timeLimit, setTimeLimit] = useState(30); // лимит времени
  const [timeLeft, setTimeLeft] = useState(30); // остаток времени
  const [isRunning, setIsRunning] = useState(false); // Проверка начал ли пользователь печатать
  const [isAddingText, setIsAddingText] = useState(false);
  const correctChars = typedChars.filter((c) => c.status === "correct").length; // Количество правильно введеных символов
  const timeElapsed = timeLimit - timeLeft; // Время затраченное пользователем на ввод текста
  const userWPM = timeElapsed > 0 ? correctChars / 5 / (timeElapsed / 60) : 0; // Words per minute пользователя
  const accuracy =
    typedChars.length === 0 ? 100 : (correctChars / typedChars.length) * 100; // Процент правильно введеных слов
  const errors = typedChars.filter((c) => c.status === "incorrect").length; // Количество ошибок пользователя

  const [showResults, setShowResults] = useState(false); // для UX дизайна - показывать результат или нет

  function generateText(lang, wordCount = 50) {
    const source = wordsData[lang]
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
        return Math.max(prev - 1, 0);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]); // useEffect для запуска и работы таймера

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      setShowResults(true);
    }
  }, [timeLeft]); // useEffect для остановки таймера

  useEffect(() => {
    if (typingRef.current) {
      typingRef.current.focus();
    }
  }, [isRunning]); // useEffect для useRef для автоматического фокуса на поле ввода

  function handleStart(e) {
    const text = generateText(userLanguage, 20);
    setDisplayText(text);
    setSplitText(text.split(""));

    setTypedChars([]);
    setTimeLeft(timeLimit);
    setIsRunning(true);
    setShowResults(false);
    if (typingRef.current) {
      typingRef.current.focus();
    }
  }

  function handleKeyDown(e) {
    const currentIndex = typedChars.length;
    const expectedChar = splitText[currentIndex];
    e.preventDefault();
    if (timeLeft === 0) return;
    if (!isAddingText && splitText.length - typedChars.length <= 50) {
      // Добавление новых слов если они заканчиваются
      setIsAddingText(true);
      setTimeout(() => {
        const newText = generateText(userLanguage, 20);
        setDisplayText((prev) => prev + " " + newText);
        setSplitText((prev) => [...prev, " ", ...newText.split("")]);
        setIsAddingText(false);
      }, 250);
    }

    if (currentIndex >= splitText.length) return; // Когда пользователь напечатает весь текст остановить код сразу
    //time
    if (!isRunning) {
      setIsRunning(true);
    }

    // Backspace
    if (e.key === "Backspace") {
      setTypedChars((prev) => prev.slice(0, -1));
      return;
    }
    if (e.key.length > 1) return;

    const status = e.key === expectedChar ? "correct" : "incorrect";

    setTypedChars((prev) => [...prev, { char: e.key, status }]);
  }

  function handleRestart() {
    setTypedChars([]);
    setTimeLeft(timeLimit);
    setIsRunning(false);
    setShowResults(false);
  }

  return (
    <div className="app-container">
      <h1>Animaltype</h1>
      <p>Проверка скорости печати</p>
      {!isRunning && (
        <div className="settings-container">
          <h2>Настройки / Settings</h2>
          <div className="settings-group">
            <label>Выбор языка / Select language:</label>
            <div className="buttons-group">
              <button
                onClick={() => setUserLanguage("ru")}
                className={userLanguage === "ru" ? "active" : ""}
              >
                Russian
              </button>

              <button
                onClick={() => setUserLanguage("en")}
                className={userLanguage === "en" ? "active" : ""}
              >
                English
              </button>
            </div>
          </div>

          <div className="settings-group">
            <label>Выбор времени / Time select:</label>
            <div className="buttons-group">
              <button
                onClick={() => setTimeLimit(30)}
                className={timeLimit === 30 ? "active" : ""}
              >
                30
              </button>
              <button
                onClick={() => setTimeLimit(60)}
                className={timeLimit === 60 ? "active" : ""}
              >
                60
              </button>
              <button
                onClick={() => setTimeLimit(120)}
                className={timeLimit === 120 ? "active" : ""}
              >
                120
              </button>
            </div>
          </div>

          <button className="start-button" onClick={handleStart}>
            Start
          </button>
        </div>
      )}
      {(isRunning || displayText.length > 0) && (
        <p className="timer">
          Time left: <span>{timeLeft}</span>s
        </p>
      )}
      {(isRunning || displayText.length > 0) && (
        <div
          className="typing-container"
          ref={typingRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          onClick={() => typingRef.current.focus()}
        >
          {splitText.map((ch, index) => {
            let className = "";

            if (index < typedChars.length) {
              className = typedChars[index].status;
            } else if (index === typedChars.length) {
              className = "current";
            } else className = "pending";

            return (
              <span className={className} key={index}>
                {ch}
              </span>
            );
          })}
        </div>
      )}
      {showResults && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Results</h2>
            <p>WPM: {Math.round(userWPM)}</p>
            <p>Accuracy: {Math.round(accuracy)}%</p>
            <p>Errors: {errors}</p>

            <button onClick={handleRestart}>Перезапуск</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
