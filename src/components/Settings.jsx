import React from 'react'

export default function Settings({userLanguage, setUserLanguage, timeLimit, setTimeLimit, handleStart}) {
        return (
        <div className="settings-container">
          <h2>Настройки</h2>

          <div className="settings-group">
            <label>Выбор языка:</label>
            <div className="buttons-group">
              <button
                onClick={() => setUserLanguage("ru")}
                className={userLanguage === "ru" ? "active" : ""}
                aria-pressed={userLanguage === "ru"}
              >
                Русский
              </button>
              <button
                onClick={() => setUserLanguage("en")}
                className={userLanguage === "en" ? "active" : ""}
                aria-pressed={userLanguage === "en"}
              >
                English
              </button>
            </div>
          </div>

          <div className="settings-group">
            <label>Выберите время (секунды):</label>
            <div className="buttons-group">
              <button
                onClick={() => setTimeLimit(30)}
                className={timeLimit === 30 ? "active" : ""}
                aria-pressed={timeLimit === 30}
              >
                30
              </button>
              <button
                onClick={() => setTimeLimit(60)}
                className={timeLimit === 60 ? "active" : ""}
                aria-pressed={timeLimit === 60}
              >
                60
              </button>
              <button
                onClick={() => setTimeLimit(120)}
                className={timeLimit === 120 ? "active" : ""}
                aria-pressed={timeLimit === 120}
              >
                120
              </button>
            </div>
          </div>

          <button className="start-button" onClick={handleStart}>
            Начать
          </button>
        </div>)}