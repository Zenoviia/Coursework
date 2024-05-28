'use strict';

import {
  gameContainer,
  resultDiv,
  restartBtn,
  undoBtn,
  xWinsSpan,
  oWinsSpan,
  tiesSpan,
  showRulesBtn,
  rulesModal,
  closeRulesBtn,
  WINNING_COMB,
} from './constants.js';

const gameStates = {
  xWins: 0,
  oWins: 0,
  ties: 0,
  currentPlayer: 'X',
  board: Array(9).fill(''),
  gameOver: false,
  moveHistory: [],
};

const showRulesModal = () => {
  rulesModal.style.display = 'block';
};

const hideRulesModal = () => {
  rulesModal.style.display = 'none';
};

const restartGame = () => {
  resetGameState();
  render();
}

const resetGameState = () => {
  gameStates.currentPlayer = 'X';
  gameStates.board = Array(9).fill('');
  gameStates.gameOver = false;
  resultDiv.textContent = '';
  gameStates.moveHistory = [];
}

const undoMove = () => {
  const hasHistory = gameStates.moveHistory.length > 0;
  if (hasHistory && !gameStates.gameOver) {
    const lastMove = gameStates.moveHistory.pop();
    gameStates.board[lastMove] = '';
    const prevMove = gameStates.moveHistory.pop();
    if (prevMove !== undefined) {
      gameStates.board[prevMove] = '';
      gameStates.currentPlayer = gameStates.board[prevMove] === 'X' ? 'O' : 'X';
    }
    render();
  }
}

const render = () => {
  gameContainer.innerHTML = '';
  gameStates.board.forEach((value, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = value;
    if (value !== '') {
      cell.style.backgroundColor = '#DCDCDC';
    }
    cell.addEventListener('click', () => handleClick(index));
    gameContainer.appendChild(cell);
  });
}
render();

const handleClick = (index) => {
  if (gameStates.gameOver || gameStates.board[index] !== '') return;

  gameStates.board[index] = gameStates.currentPlayer;
  gameStates.moveHistory.push(index);
  render();

  const winner = checkWinner();
  if (winner) {
    endGame(winner);
  } else {
    switchPlayer();
    if (gameStates.currentPlayer === 'O') {
      makeComputerMove();
    }
  }
}

const endGame = (winner) => {
  if (winner === 'tie') {
    resultDiv.textContent = 'It`s a tie!';
    gameStates.ties++;
    tiesSpan.textContent = gameStates.ties;
  } else {
    resultDiv.textContent = `${winner} won!`;
    if (winner === 'X') {
      gameStates.xWins++;
      xWinsSpan.textContent = gameStates.xWins;
    } else {
      gameStates.oWins++;
      oWinsSpan.textContent = gameStates.oWins;
    }
  }
  gameStates.gameOver = true;
}

const makeComputerMove = () => {
  const emptyCells = gameStates.board.reduce((acc, cell, index) => {
    if (cell === '') acc.push(index);
    return acc;
  }, []);

  const winningMove = checkWinningMove('O');
  const blockingMove = checkWinningMove('X');

  let moveIndex;
  if (winningMove) {
    moveIndex = winningMove;
  } else if (blockingMove) {
    moveIndex = blockingMove;
  } else {
    moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  gameStates.board[moveIndex] = 'O';
  gameStates.moveHistory.push(moveIndex);
  render();

  const winner = checkWinner();
  if (winner) {
    endGame(winner);
  } else {
    switchPlayer();
  }
}

const switchPlayer = () => {
  gameStates.currentPlayer = gameStates.currentPlayer === 'X' ? 'O' : 'X';
}

const checkWinningMove = (player) => {
  for (const combination of WINNING_COMB) {
    const [a, b, c] = combination;
    const isPlayerA = gameStates.board[a] === player;
    const isPlayerB = gameStates.board[b] === player;
    const isPlayerC = gameStates.board[c] === player;

    const isEmptyA = gameStates.board[a] === '';
    const isEmptyB = gameStates.board[b] === '';
    const isEmptyC = gameStates.board[c] === '';

    if (isPlayerA && isPlayerB && isEmptyC) {
      return c;
    }
    if (isPlayerA && isPlayerC && isEmptyB) {
      return b;
    }
    if (isPlayerB && isPlayerC && isEmptyA) {
      return a;
    }
  }

  return null;
}

const checkWinner = () => {
  for (const combination of WINNING_COMB) {
    const [a, b, c] = combination;
    const cellA = gameStates.board[a];
    const cellB = gameStates.board[b];
    const cellC = gameStates.board[c];

    const isWinningCombination = cellA && cellA === cellB && cellA === cellC;

    if (isWinningCombination) {
      return cellA;
    }
  }

  const isBoardFull = gameStates.board.every((cell) => cell !== '');
  return isBoardFull ? 'tie' : null;
}

showRulesBtn.addEventListener('click', showRulesModal);
closeRulesBtn.addEventListener('click', hideRulesModal);
restartBtn.addEventListener('click', restartGame);
undoBtn.addEventListener('click', undoMove);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideRulesModal();
  }
});