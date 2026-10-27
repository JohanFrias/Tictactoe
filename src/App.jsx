import { useState } from 'react'


import { Square } from './components/Square.jsx'
import { TURNS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal.jsx'
import { saveGameToStorage, resetGameStorage } from './logic/storage/index.js'

function App () {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const winnerFromBoard = checkWinnerFrom(board)
    if (winnerFromBoard) return winnerFromBoard

    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.Colonos
  })

  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(() => {
    const winnerFromBoard = checkWinnerFrom(board)
    if (winnerFromBoard) return winnerFromBoard
    return checkEndGame(board) ? false : null
  })

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.Colonos)
    setWinner(null)

    resetGameStorage()
  }

  const updateBoard = (index) => {
    if (board[index] || winner !== null) return

    const newBoard = [...board]
    newBoard[index] = turn

    setBoard(newBoard)
    const newWinner = checkWinnerFrom(newBoard)
    const isDraw = !newWinner && checkEndGame(newBoard)
    const newTurn = newWinner || isDraw
      ? turn
      : turn === TURNS.Colonos ? TURNS.Nativos : TURNS.Colonos

    setTurn(newTurn)
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    if (newWinner) {
      setWinner(newWinner)
    } else if (isDraw) {
      setWinner(false)
    }
  }

  return (
    <main className='board'>
      <h1 translate="no">Tic tac toe</h1>
      <h3> Colonos vs Nativos </h3>
      <button onClick={resetGame}>Reset del juego</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <p className='turn-indicator' aria-live='polite'>
          Turno de {turn === TURNS.Colonos ? 'Colonos' : 'Nativos'}
        </p>
        <Square isSelected={turn === TURNS.Colonos}>
          {TURNS.Colonos}
        </Square>
        <Square isSelected={turn === TURNS.Nativos}>
          {TURNS.Nativos}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App