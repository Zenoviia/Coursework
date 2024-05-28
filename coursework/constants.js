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
const WINNING_COMB = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export {
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
};
