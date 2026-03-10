import { useState } from 'react'
import './App.css'

function App() {
  const printText = 'Однажды тёплым осенним вечером, когда последние лучи заходящего солнца золотили верхушки деревьев, Иван решил прогуляться по парку. Воздух был наполнен ароматом опавшей листвы и свежести после недавнего дождя. Он шёл медленно, наслаждаясь тишиной и спокойствием, изредка поглядывая на небо, где уже начинали появляться первые звёзды.'
  const splitText = printText.split('')
  const [typedChars, setTypedChars] = useState([])
  function handleKeyDown(e) {
    e.preventDefault()
    // Backspace
    if (e.key === 'Backspace') {
      setTypedChars(prev => prev.slice(0, -1))
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
