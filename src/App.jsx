import { useEffect, useState, useRef } from 'react'
import './App.css'

function App() {
  const printText = 'Однажды тёплым осенним вечером, когда последние лучи заходящего солнца золотили верхушки деревьев, Иван решил прогуляться по парку. Воздух был наполнен ароматом опавшей листвы и свежести после недавнего дождя. Он шёл медленно, наслаждаясь тишиной и спокойствием, изредка поглядывая на небо, где уже начинали появляться первые звёзды.'
  const splitText = printText.split('')
  const [typedChars, setTypedChars] = useState([])
  const [timeLimit, setTimeLimit] = useState(30)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isRunning, setIsRunning] = useState(false)
  const correctChars = typedChars.filter(c => c.status === 'correct').length
  const userWPM = (correctChars / 5) / (timeLimit / 60)
  const accuracy = typedChars.length === 0 ? 100 : (correctChars / typedChars.length) * 100
  const errors = typedChars.filter(c => c.status === 'incorrect').length
  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {if (prev <= -1) return 0
        return prev - 1
      })
    },1000)

    return () => clearInterval(timer)
  }, [isRunning])

  useEffect(() => {
    if (timeLeft === 0){
      setIsRunning(false)
    }
  }, [timeLeft])
  function handleKeyDown(e) {
    e.preventDefault()
    if (timeLeft === 0) return

    //time
    if (!isRunning) {
      setIsRunning(true)
    }

    // Backspace
    if (e.key === 'Backspace') {
      setTypedChars(prev => prev.slice(0, -1))
      return
    }
        if (e.key.length > 1) return
    
    const currentIndex = typedChars.length
    const expectedChar = splitText[currentIndex]

    const status = e.key === expectedChar ? 'correct' : 'incorrect'

    setTypedChars(prev => [...prev, {char: e.key, status}])
  }

  return (
    <>
    <h1>Animaltype</h1>
    <p>Проверка скорости печати</p>
    <p>Time left:{timeLeft}</p>
    <p>WPM: {Math.round(userWPM)}</p>
    <p>Accuracy: {Math.round(accuracy)}%</p>
    <p>Total Words: {typedChars.length}</p>
    <p>Errors: {errors}</p>
    <div onKeyDown = {handleKeyDown} tabIndex={0}>
      {splitText.map((ch,index) => {
        let className = ''

        if (index < typedChars.length) {
          className = typedChars[index].status
        } else if (index===typedChars.length) {className = 'current'}
          else className = 'pending'

        return (<span className = {className} key={index}>{ch}</span>)
      })}
    </div>
    </>
  )
}

export default App
