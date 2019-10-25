const GameBoard = ((tilesPerSide) => {
  const observers = []

  const createBoard = () => {
    return new Array(3).fill(null)
      .map(() =>
        Array(3).fill(null).map(item => ({ player: null }))
      )
  }

  let board = createBoard()

  const notifyAll = () => {
    observers.forEach((observer) => {
      observer.update([...board])
    })
  }

  const playToSquare = ({ x, y, player }) => {
    if (board[y][x].player !== null) {
      return
    }

    board[y][x].player = player

    notifyAll([...board])
  }

  const reset = () => {
    board = createBoard()
    notifyAll([...board])
  }

  return {
    registerObserver: (observer) => {
      observers.push(observer)
    },
    notifyAll,
    playToSquare,
    reset
  }
})()

const GameController = ((gameBoard) => {
  let currentPlayer = 1

  const squarePressed = ({ x, y }) => {
    gameBoard.playToSquare({ x, y, player: currentPlayer })
    currentPlayer = currentPlayer === 1 ? 2 : 1
  }

  const newGameButtonPressed = () => {
    currentPlayer = 1
    gameBoard.reset()
  }

  return {
    registerModelObserver: (observer) => {
      gameBoard.registerObserver(observer)
      gameBoard.notifyAll()
    },
    squarePressed,
    newGameButtonPressed
  }
})(GameBoard)

const GameDisplay = ((controller) => {
  const createBoardDisplay = (board) => {
    const boardDisplay = document.createElement('div')
    boardDisplay.classList.add('board-container')

    const rowDivs = board.map((row, i) => {
      const cellDivs = row.map((cell, j) => {
        const cellDiv = document.createElement('div')
        cellDiv.classList.add('board-cell')

        if (cell.player === null) {
          cellDiv.textContent = ''
        } else {
          cellDiv.textContent = cell.player === 1
            ? 'x'
            : 'o'
        }

        cellDiv.addEventListener('click', () => {
          controller.squarePressed({ x: j, y: i })
        })

        return cellDiv
      })

      const rowDiv = document.createElement('div')
      rowDiv.classList.add('board-row')

      rowDiv.append(...cellDivs)

      return rowDiv
    })

    boardDisplay.append(...rowDivs)

    return boardDisplay
  }

  const createNewGameButton = () => {
    const button = document.createElement('button')
    button.id = 'new-game-button'
    button.textContent = 'New Game'.toUpperCase()

    button.addEventListener('click', () => {
      controller.newGameButtonPressed()
    })

    return button
  }

  const render = (board) => {
    const root = document.querySelector('#app')
    root.style.color = 'white'

    while (root.hasChildNodes()) {
      root.lastChild.remove()
    }

    const boardDisplay = createBoardDisplay(board)
    const newGameButton = createNewGameButton()

    root.append(boardDisplay)
    root.append(newGameButton)
  }

  const view = {
    update: (board) => {
      render(board)
    },
    render
  }

  controller.registerModelObserver(view)

  return view
})(GameController)

GameBoard.registerObserver(GameDisplay)
