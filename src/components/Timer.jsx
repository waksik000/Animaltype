import React from "react"
export default function Timer ({timeLeft}) {
    return (<p className="timer">
          Time left: <span>{timeLeft}</span>
        </p>)
}