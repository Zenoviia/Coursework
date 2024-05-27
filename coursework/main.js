'use strict';

const gameContainer = document.getElementById('game');
const resultDiv = document.getElementById('result');
const restartBtn = document.getElementById('restart');
const undoBtn = document.getElementById('undo');
const xWinsSpan = document.getElementById('xWins');
const oWinsSpan = document.getElementById('oWins');
const tiesSpan = document.getElementById('ties');
const showRulesBtn = document.getElementById('showRulesBtn');
const rulesModal = document.getElementById('rulesModal');
const closeRulesBtn = document.getElementById('closeRulesBtn');
const overlay = document.getElementById('overlay');

let xWins = 0;
let oWins = 0;
let ties = 0;
let currentPlayer = 'X';
let board = Array(9).fill('');
let gameOver = false;
let moveHistory = [];

showRulesBtn.addEventListener('click', () => {
    rulesModal.style.display = 'block';
});

closeRulesBtn.addEventListener('click', () => {
    rulesModal.style.display = 'none';
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        rulesModal.style.display = 'none';
    }
});

restartBtn.addEventListener('click', () => {
    currentPlayer = 'X';
    board = Array(9).fill('');
    gameOver = false;
    resultDiv.textContent = '';
    moveHistory = [];
    render();
});

undoBtn.addEventListener('click', () => {
    if (moveHistory.length > 0 && !gameOver) {
        const lastMove = moveHistory.pop();
        board[lastMove] = '';

        if (moveHistory.length > 0) {
            const prevMove = moveHistory.pop();
            board[prevMove] = '';
            currentPlayer = board[prevMove] === 'X' ? 'O' : 'X';
        }

        render();
    }
});

const checkWinner = () => {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.every(cell => cell !== '') ? 'tie' : null;
}

const handleClick = (index) => {
    if (gameOver || board[index] !== '') return;

    board[index] = currentPlayer;
    moveHistory.push(index);
    render();
    const winner = checkWinner();

    winner ? displayWinner(winner) : (currentPlayer = currentPlayer === 'X' ? 'O' : 'X', !gameOver && currentPlayer === 'O' && makeComputerMove());

}

const displayWinner = (winner) => {
    resultDiv.textContent = winner === 'tie' ? 'It`s a tie!' : `${winner} won!`;
    winner === 'tie' ? (ties++, tiesSpan.textContent = ties) :
    winner === 'X' ? (xWins++, xWinsSpan.textContent = xWins) :
    (oWins++, oWinsSpan.textContent = oWins);
    gameOver = true;
}

const checkWinningMove = (player) => {
    const possibleWins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of possibleWins) {
        if (board[a] === player && board[b] === player && board[c] === '') {
            return c;
        }
        if (board[a] === player && board[c] === player && board[b] === '') {
            return b;
        }
        if (board[b] === player && board[c] === player && board[a] === '') {
            return a;
        }
    }

    return -1;
}

const makeComputerMove = () => {
    let emptyCells = board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    let winningMove = checkWinningMove('O');
    let blockingMove = checkWinningMove('X');
    
    let moveIndex = winningMove !== -1 ? winningMove :
                    blockingMove !== -1 ? blockingMove :
                    emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    board[moveIndex] = 'O';
    moveHistory.push(moveIndex);
    render();

    const winner = checkWinner();
    winner ? displayWinner(winner) : currentPlayer = 'X';
}

const render = () => {
    gameContainer.innerHTML = '';
    board.forEach((value, index) => {
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