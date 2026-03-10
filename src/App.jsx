import { useEffect, useState, useRef } from "react";
import "./App.css";
import wordsData from "./data/words.json";

function App() {
  const [userLanguage, setUserLanguage] = useState("en"); // выбор языка
  const [lines, setLines] = useState([]); // массив строк для отображения
  const [typedChars, setTypedChars] = useState([]); // символы текущей строки
  const [totalTypedChars, setTotalTypedChars] = useState([]); // для статистики всех строк
  const typingRef = useRef(null);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Расчёт статистики
  const correctChars = totalTypedChars.filter((c) => c.status === "correct").length;
  const timeElapsed = timeLimit - timeLeft;
  const userWPM = timeElapsed > 0 ? correctChars / 5 / (timeElapsed / 60) : 0;
  const accuracy = totalTypedChars.length === 0 ? 100 : (correctChars / totalTypedChars.length) * 100;
  const errors = totalTypedChars.filter((c) => c.status === "incorrect").length;

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
    const timer = setInterval(() => setTimeLeft((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      setShowResults(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (typingRef.current) typingRef.current.focus();
  }, [isRunning]);

  function handleStart() {
    const initialLines = [
      generateText(userLanguage, 20),
      generateText(userLanguage, 20),
      generateText(userLanguage, 20),
    ];
    setLines(initialLines);
    setTypedChars([]);
    setTotalTypedChars([]);
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

    // Проверка завершения текущей строки
    if (currentIndex + 1 >= currentLine.length) {
      // Сохраняем все символы в общую статистику
      setTotalTypedChars((prev) => [...prev, ...[...typedChars, { char: e.key, status }]]);

      // Сдвиг строк: первая исчезает, вторая становится первой, третья второй, добавляется новая третья
      setLines((prev) => [...prev.slice(1), generateText(userLanguage, 20)]);
      setTypedChars([]); // очистка ввода
    }
  }

  function handleRestart() {
    setTypedChars([]);
    setTotalTypedChars([]);
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

      {(isRunning || lines.length > 0) && (
        <p className="timer">
          Time left: <span>{timeLeft}</span>s
        </p>
      )}

      {(isRunning || lines.length > 0) && (
        <div
          className="typing-container"
          ref={typingRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {lines.map((line, index) => (
            <div key={index} className={index === 0 ? "active-line" : "inactive-line"}>
              {line.split("").map((ch, cIndex) => {
                let status = "pending";
                if (index === 0) {
                  if (cIndex < typedChars.length) status = typedChars[cIndex].status;
                  else if (cIndex === typedChars.length) status = "current"; // подсветка текущей буквы
                }
                return (
                  <span key={cIndex} className={status}>
                    {ch}
                  </span>
                );
              })}
            </div>
          ))}
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