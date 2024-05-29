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
};

const resetGameState = () => {
  gameStates.currentPlayer = 'X';
  gameStates.board = Array(9).fill('');
  gameStates.gameOver = false;
  resultDiv.textContent = '';
  gameStates.moveHistory = [];
};

const undoMove = () => {
  const hasHistory = gameStates.moveHistory.length > 0;
  if (hasHistory && !gameStates.gameOver) {
    const lastMove = gameStates.moveHistory.pop();
    gameStates.board[lastMove] = '';
    const prevMove = gameStates.moveHistory.pop();
    if (prevMove !== undefined) {
      gameStates.board[prevMove] = '';
    }
    render();
  }
};

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
};
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
};

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
};

const makeComputerMove = () => {
  const emptyCells = gameStates.board.reduce((acc, cell, index) => {
    if (cell === '') acc.push(index);
    return acc;
  }, []);

  const winningMove = checkWinningMove('O');
  const blockingMove = checkWinningMove('X');

  let moveIndex = null;
  if (winningMove) {
    moveIndex = winningMove;
  }
  if (blockingMove) {
    moveIndex = blockingMove;
  } else {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    moveIndex = emptyCells[randomIndex];
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
};

const switchPlayer = () => {
  gameStates.currentPlayer = gameStates.currentPlayer === 'X' ? 'O' : 'X';
};

const checkPlayer = (position, player) => {
  return gameStates.board[position] === player;
};

const checkEmpty = (position) => {
  return gameStates.board[position] === '';
};

const checkWinningMove = (player) => {
  for (const combination of WINNING_COMB) {
    const [cellA, cellB, cellC] = combination;

    const selectPlayer = {
      A: checkPlayer(cellA, player),
      B: checkPlayer(cellB, player),
      C: checkPlayer(cellC, player),
    };

    const empty = {
      A: checkEmpty(cellA),
      B: checkEmpty(cellB),
      C: checkEmpty(cellC),
    };

    const winCondition = {
      1: selectPlayer['A'] && selectPlayer['B'] && empty['C'],
      2: selectPlayer['A'] && selectPlayer['C'] && empty['B'],
      3: selectPlayer['B'] && selectPlayer['C'] && empty['A'],
    };

    if (winCondition['1']) {
      return cellC;
    }
    if (winCondition['2']) {
      return cellB;
    }
    if (winCondition['3']) {
      return cellA;
    }
  }

  return null;
};

const checkWinner = () => {
  for (const combination of WINNING_COMB) {
    const [cellA, cellB, cellC] = combination;
    const charA = gameStates.board[cellA];
    const charB = gameStates.board[cellB];
    const charC = gameStates.board[cellC];

    const isWinningCombination = charA && charA === charB && charA === charC;

    if (isWinningCombination) {
      return charA;
    }
  }

  const isBoardFull = gameStates.board.every((cell) => cell !== '');
  return isBoardFull ? 'tie' : null;
};

showRulesBtn.addEventListener('click', showRulesModal);
closeRulesBtn.addEventListener('click', hideRulesModal);
restartBtn.addEventListener('click', restartGame);
undoBtn.addEventListener('click', undoMove);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideRulesModal();
  }
});
