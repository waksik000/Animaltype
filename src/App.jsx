import { useEffect, useState, useRef } from "react";
import "./App.css";
import wordsData from "./data/words.json";
import Settings from "./components/Settings";
import Timer from "./components/Timer";
import TypingArea from "./components/TypingArea";
import ResultModal from "./components/ResultModal";
function App() {
  const [userLanguage, setUserLanguage] = useState("ru"); // выбор языка
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

      {showResults && (
        <ResultModal
        userWPM = {userWPM}
        accuracy = {accuracy}
        errors = {errors}
        handleRestart = {handleRestart}
        />
      )}
    </div>
  );
}

export default App;