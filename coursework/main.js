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

const undoTwoMoves = () => {
  const { moveHistory, board, gameOver } = gameStates;
  const hasHistory = moveHistory.length > 0;
  if (hasHistory && !gameOver) {
    board[moveHistory.pop()] = '';
    board[moveHistory.pop()] = '';
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
  const isEmpty = gameStates.board[index] === '';
  if (gameStates.gameOver || !isEmpty) return;

  gameStates.board[index] = gameStates.currentPlayer;
  gameStates.moveHistory.push(index);

  render();
  updateGameStatus();
};

const updateGameStatus = () => {
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

const displayTie = () => {
  resultDiv.textContent = 'It`s a tie!';
  gameStates.ties++;
  tiesSpan.textContent = gameStates.ties;
};

const displayWinner = (winner) => {
  resultDiv.textContent = `${winner} won!`;
  if (winner === 'X') {
    gameStates.xWins++;
    xWinsSpan.textContent = gameStates.xWins;
  } else {
    gameStates.oWins++;
    oWinsSpan.textContent = gameStates.oWins;
  }
};

const endGame = (winner) => {
  if (winner === 'tie') {
    displayTie();
  } else {
    displayWinner(winner);
  }
  gameStates.gameOver = true;
};

const findEmptyCell = () => {
  const emtyCells = gameStates.board.reduce((acc, cell, index) => {
    if (cell === '') acc.push(index);
    return acc;
  }, []);
  return emtyCells;
};

const updateComputerStatus = () => {
  const winner = checkWinner();
  if (winner) {
    endGame(winner);
  } else {
    switchPlayer();
  }
};

const makeComputerMove = () => {
  const emptyCells = findEmptyCell();
  const winningMove = checkWinningMove('O');
  const blockingMove = checkWinningMove('X');
  let moveIndex = null;

  if (winningMove) {
    moveIndex = winningMove;
  } else if (blockingMove) {
    moveIndex = blockingMove;
  } else {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    moveIndex = emptyCells[randomIndex];
  }

  gameStates.board[moveIndex] = 'O';
  gameStates.moveHistory.push(moveIndex);

  render();
  updateComputerStatus();
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

    const chars = {
      A: gameStates.board[cellA],
      B: gameStates.board[cellB],
      C: gameStates.board[cellC],
    };

    const isWinningCombination =
      chars['A'] && chars['A'] === chars['B'] && chars['A'] === chars['C'];

    if (isWinningCombination) {
      return chars['A'];
    }
  }

  const isBoardFull = gameStates.board.every((cell) => cell !== '');
  return isBoardFull ? 'tie' : null;
};

showRulesBtn.addEventListener('click', showRulesModal);
closeRulesBtn.addEventListener('click', hideRulesModal);
restartBtn.addEventListener('click', restartGame);
undoBtn.addEventListener('click', undoTwoMoves);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideRulesModal();
  }
});
