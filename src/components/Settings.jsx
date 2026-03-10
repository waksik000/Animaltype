import React from 'react'

export default function Settings({userLanguage, setUserLanguage, timeLimit, setTimeLimit, handleStart}) {
        return (
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
        </div>)}