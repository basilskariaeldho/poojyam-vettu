const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


/* =========================
   BOARD
========================= */

let rows = 4;
let cols = 4;

let spacing = 90;

const startX = 40;
const startY = 40;


/* =========================
   PLAYERS
========================= */

const players = [

    {
        name: "Player 1",
        score: 0,
        symbol: "1"
    },

    {
        name: "Player 2",
        score: 0,
        symbol: "2"
    }

];


let currentPlayer = 0;


/* =========================
   GAME MODE
========================= */

let gameMode = "2player";


/* =========================
   GAME DATA
========================= */

let horizontalLines = [];

let verticalLines = [];

let boxes = [];

let gameOver = false;


/* =========================
   SOUND
========================= */

let soundEnabled = true;

let audioContext = null;


function getAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    return audioContext;
}


function playSound(
    frequency,
    duration,
    type = "sine"
) {

    if (!soundEnabled) {
        return;
    }


    const audio =
        getAudioContext();


    if (
        audio.state ===
        "suspended"
    ) {

        audio.resume();

    }


    const oscillator =
        audio.createOscillator();

    const gain =
        audio.createGain();


    oscillator.type =
        type;


    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        0.0001,
        audio.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.12,
        audio.currentTime + 0.01
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + duration
    );


    oscillator.connect(gain);

    gain.connect(
        audio.destination
    );


    oscillator.start();

    oscillator.stop(
        audio.currentTime +
        duration
    );

}


function lineSound() {

    playSound(
        420,
        0.08,
        "square"
    );

}


function boxSound() {

    playSound(
        650,
        0.12
    );


    setTimeout(
        () => {

            playSound(
                850,
                0.15
            );

        },
        80
    );

}


function winSound() {

    playSound(
        520,
        0.15
    );


    setTimeout(
        () => {

            playSound(
                660,
                0.15
            );

        },
        130
    );


    setTimeout(
        () => {

            playSound(
                880,
                0.25
            );

        },
        260
    );

}


/* =========================
   SCREENS
========================= */

const startScreen =
    document.getElementById(
        "startScreen"
    );


const gameScreen =
    document.getElementById(
        "gameScreen"
    );


const winnerScreen =
    document.getElementById(
        "winnerScreen"
    );


const leaderboardScreen =
    document.getElementById(
        "leaderboardScreen"
    );


/* =========================
   BOARD SIZE BUTTONS
========================= */

document
    .querySelectorAll(".sizeButton")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".sizeButton"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });


                this.classList.add(
                    "selected"
                );


                const size =
                    Number(
                        this.dataset.size
                    );


                rows = size;

                cols = size;

            }
        );

    });


/* =========================
   MODE BUTTONS
========================= */

document
    .querySelectorAll(".modeButton")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".modeButton"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });


                this.classList.add(
                    "selected"
                );


                gameMode =
                    this.dataset.mode;


                const player2Box =
                    document.getElementById(
                        "player2NameBox"
                    );


                if (
                    gameMode ===
                    "computer"
                ) {

                    player2Box.style.display =
                        "none";

                } else {

                    player2Box.style.display =
                        "block";

                }

            }
        );

    });


/* =========================
   START GAME
========================= */

document
    .getElementById(
        "startButton"
    )
    .addEventListener(
        "click",
        startGame
    );


function startGame() {

    const name1 =
        document
            .getElementById(
                "player1Name"
            )
            .value
            .trim();


    const name2 =
        document
            .getElementById(
                "player2Name"
            )
            .value
            .trim();


    players[0].name =
        name1 ||
        "Player 1";


    if (
        gameMode ===
        "computer"
    ) {

        players[1].name =
            "Computer";

    } else {

        players[1].name =
            name2 ||
            "Player 2";

    }


    resetGame();


    startScreen
        .classList
        .add("hidden");


    winnerScreen
        .classList
        .add("hidden");


    leaderboardScreen
        .classList
        .add("hidden");


    gameScreen
        .classList
        .remove("hidden");


    updateInfo();

}


/* =========================
   RESET GAME
========================= */

function resetGame() {

    horizontalLines = [];

    verticalLines = [];

    boxes = [];

    currentPlayer = 0;

    gameOver = false;

    players[0].score = 0;

    players[1].score = 0;

    resizeBoard();

    updateInfo();

}


/* =========================
   NEW GAME
========================= */

document
    .getElementById(
        "newGameButton"
    )
    .addEventListener(
        "click",
        resetGame
    );


/* =========================
   PLAY AGAIN
========================= */

document
    .getElementById(
        "playAgainButton"
    )
    .addEventListener(
        "click",
        function() {

            winnerScreen
                .classList
                .add("hidden");


            gameScreen
                .classList
                .remove("hidden");


            resetGame();

        }
    );


/* =========================
   SOUND BUTTON
========================= */

document
    .getElementById(
        "soundButton"
    )
    .addEventListener(
        "click",
        function() {

            soundEnabled =
                !soundEnabled;


            this.textContent =
                soundEnabled
                    ? "🔊"
                    : "🔇";

        }
    );


/* =========================
   RESIZE
========================= */

function resizeBoard() {

    const size =
        Math.min(
            window.innerWidth - 40,
            600
        );


    canvas.width =
        size;


    canvas.height =
        size;


    spacing =
        (size - 80) /
        (cols - 1);


    draw();

}


window.addEventListener(
    "resize",
    resizeBoard
);


/* =========================
   DRAW BOARD
========================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle =
        "#f5f1df";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* BOXES */

    for (
        const box of boxes
    ) {

        const x =
            startX +
            box.col *
            spacing;


        const y =
            startY +
            box.row *
            spacing;


        ctx.fillStyle =
            box.player === 0
                ? "#ffd6d6"
                : "#d6e5ff";


        ctx.fillRect(
            x + 5,
            y + 5,
            spacing - 10,
            spacing - 10
        );


        ctx.fillStyle =
            box.player === 0
                ? "#d94b4b"
                : "#3478c9";


        ctx.font =
            "bold 30px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(
            players[
                box.player
            ].symbol,
            x + spacing / 2,
            y + spacing / 2
        );

    }


    /* HORIZONTAL LINES */

    ctx.lineWidth = 6;

    ctx.lineCap = "round";


    for (
        const line of horizontalLines
    ) {

        const x1 =
            startX +
            line.col *
            spacing;


        const y =
            startY +
            line.row *
            spacing;


        const x2 =
            x1 +
            spacing;


        ctx.strokeStyle =
            line.player === 0
                ? "#e05252"
                : "#3f8edb";


        ctx.beginPath();


        ctx.moveTo(
            x1,
            y
        );


        ctx.lineTo(
            x2,
            y
        );


        ctx.stroke();

    }


    /* VERTICAL LINES */

    for (
        const line of verticalLines
    ) {

        const x =
            startX +
            line.col *
            spacing;


        const y1 =
            startY +
            line.row *
            spacing;


        const y2 =
            y1 +
            spacing;


        ctx.strokeStyle =
            line.player === 0
                ? "#e05252"
                : "#3f8edb";


        ctx.beginPath();


        ctx.moveTo(
            x,
            y1
        );


        ctx.lineTo(
            x,
            y2
        );


        ctx.stroke();

    }


    /* DOTS */

    ctx.fillStyle =
        "#222";


    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            const x =
                startX +
                col *
                spacing;


            const y =
                startY +
                row *
                spacing;


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                7,
                0,
                Math.PI * 2
            );


            ctx.fill();

        }

    }


    updateInfo();

}


/* =========================
   UPDATE INFO
========================= */

function updateInfo() {

    document
        .getElementById(
            "player1Label"
        )
        .textContent =
        players[0].name;


    document
        .getElementById(
            "player2Label"
        )
        .textContent =
        players[1].name;


    document
        .getElementById(
            "player1Score"
        )
        .textContent =
        players[0].score;


    document
        .getElementById(
            "player2Score"
        )
        .textContent =
        players[1].score;


    document
        .getElementById(
            "turnLabel"
        )
        .textContent =
        players[currentPlayer].name;


    document
        .getElementById(
            "player1Card"
        )
        .classList
        .toggle(
            "active",
            currentPlayer === 0
        );


    document
        .getElementById(
            "player2Card"
        )
        .classList
        .toggle(
            "active",
            currentPlayer === 1
        );

}


/* =========================
   FIND LINE
========================= */

function findLine(x, y) {

    let bestLine = null;

    let bestDistance = 25;


    /* HORIZONTAL */

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < cols - 1;
            col++
        ) {

            const x1 =
                startX +
                col *
                spacing;


            const x2 =
                x1 +
                spacing;


            const lineY =
                startY +
                row *
                spacing;


            const distance =
                distanceToHorizontalLine(
                    x,
                    y,
                    x1,
                    x2,
                    lineY
                );


            if (
                distance <
                bestDistance
            ) {

                const candidate = {

                    type:
                        "horizontal",

                    row:
                        row,

                    col:
                        col

                };


                if (
                    !lineExists(
                        candidate
                    )
                ) {

                    bestDistance =
                        distance;

                    bestLine =
                        candidate;

                }

            }

        }

    }


    /* VERTICAL */

    for (
        let row = 0;
        row < rows - 1;
        row++
    ) {

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            const lineX =
                startX +
                col *
                spacing;


            const y1 =
                startY +
                row *
                spacing;


            const y2 =
                y1 +
                spacing;


            const distance =
                distanceToVerticalLine(
                    x,
                    y,
                    lineX,
                    y1,
                    y2
                );


            if (
                distance <
                bestDistance
            ) {

                const candidate = {

                    type:
                        "vertical",

                    row:
                        row,

                    col:
                        col

                };


                if (
                    !lineExists(
                        candidate
                    )
                ) {

                    bestDistance =
                        distance;

                    bestLine =
                        candidate;

                }

            }

        }

    }


    return bestLine;

}


/* =========================
   DISTANCE
========================= */

function distanceToHorizontalLine(
    px,
    py,
    x1,
    x2,
    y
) {

    if (
        px >= x1 &&
        px <= x2
    ) {

        return Math.abs(
            py - y
        );

    }


    return Infinity;

}


function distanceToVerticalLine(
    px,
    py,
    x,
    y1,
    y2
) {

    if (
        py >= y1 &&
        py <= y2
    ) {

        return Math.abs(
            px - x
        );

    }


    return Infinity;

}


/* =========================
   LINE EXISTS
========================= */

function lineExists(line) {

    if (
        line.type ===
        "horizontal"
    ) {

        return horizontalLines.some(
            l =>
                l.row === line.row &&
                l.col === line.col
        );

    }


    return verticalLines.some(
        l =>
            l.row === line.row &&
            l.col === line.col
    );

}


/* =========================
   ADD LINE
========================= */

function addLine(line) {

    if (
        gameOver ||
        lineExists(line)
    ) {

        return;

    }


    line.player =
        currentPlayer;


    if (
        line.type ===
        "horizontal"
    ) {

        horizontalLines.push(
            line
        );

    } else {

        verticalLines.push(
            line
        );

    }


    lineSound();


    const completed =
        checkCompletedBoxes(
            line
        );


    if (
        completed > 0
    ) {

        players[currentPlayer].score +=
            completed;


        boxSound();


        animateScore(
            currentPlayer
        );

    } else {

        switchTurn();

    }


    draw();


    checkGameOver();


    if (
        !gameOver &&
        gameMode === "computer" &&
        currentPlayer === 1
    ) {

        setTimeout(
            computerMove,
            600
        );

    }

}


/* =========================
   SCORE ANIMATION
========================= */

function animateScore(player) {

    const id =
        player === 0
            ? "player1Score"
            : "player2Score";


    const element =
        document.getElementById(
            id
        );


    element.animate(

        [
            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(1.45)"
            },

            {
                transform:
                    "scale(1)"
            }

        ],

        {
            duration: 350
        }

    );

}


/* =========================
   CHECK COMPLETED BOXES
========================= */

function checkCompletedBoxes(line) {

    let completed = 0;


    if (
        line.type ===
        "horizontal"
    ) {

        if (
            line.row > 0 &&
            isBoxComplete(
                line.row - 1,
                line.col
            )
        ) {

            claimBox(
                line.row - 1,
                line.col
            );

            completed++;

        }


        if (
            line.row < rows - 1 &&
            isBoxComplete(
                line.row,
                line.col
            )
        ) {

            claimBox(
                line.row,
                line.col
            );

            completed++;

        }

    } else {

        if (
            line.col > 0 &&
            isBoxComplete(
                line.row,
                line.col - 1
            )
        ) {

            claimBox(
                line.row,
                line.col - 1
            );

            completed++;

        }


        if (
            line.col < cols - 1 &&
            isBoxComplete(
                line.row,
                line.col
            )
        ) {

            claimBox(
                line.row,
                line.col
            );

            completed++;

        }

    }


    return completed;

}


/* =========================
   BOX COMPLETE
========================= */

function isBoxComplete(
    row,
    col
) {

    const top = {

        type:
            "horizontal",

        row:
            row,

        col:
            col

    };


    const bottom = {

        type:
            "horizontal",

        row:
            row + 1,

        col:
            col

    };


    const left = {

        type:
            "vertical",

        row:
            row,

        col:
            col

    };


    const right = {

        type:
            "vertical",

        row:
            row,

        col:
            col + 1

    };


    return (

        lineExists(top) &&

        lineExists(bottom) &&

        lineExists(left) &&

        lineExists(right) &&

        !boxAlreadyClaimed(
            row,
            col
        )

    );

}


/* =========================
   CLAIM BOX
========================= */

function claimBox(
    row,
    col
) {

    boxes.push({

        row:
            row,

        col:
            col,

        player:
            currentPlayer

    });

}


/* =========================
   BOX ALREADY CLAIMED
========================= */

function boxAlreadyClaimed(
    row,
    col
) {

    return boxes.some(
        box =>
            box.row === row &&
            box.col === col
    );

}


/* =========================
   SWITCH TURN
========================= */

function switchTurn() {

    currentPlayer =
        currentPlayer === 0
            ? 1
            : 0;

}


/* =========================
   GAME OVER
========================= */

function checkGameOver() {

    const totalLines =
        horizontalLines.length +
        verticalLines.length;


    const totalPossibleLines =
        rows * (cols - 1) +
        (rows - 1) * cols;


    if (
        totalLines ===
        totalPossibleLines
    ) {

        gameOver = true;


        setTimeout(
            showWinner,
            500
        );

    }

}


/* =========================
   WINNER
========================= */

function showWinner() {

    let title;

    let message;


    if (
        players[0].score >
        players[1].score
    ) {

        title =
            players[0].name +
            " Wins!";


        message =
            "Excellent game! 🎉";

    } else if (
        players[1].score >
        players[0].score
    ) {

        title =
            players[1].name +
            " Wins!";


        message =
            "Excellent game! 🎉";

    } else {

        title =
            "It's a Draw!";


        message =
            "What a close game! 🤝";

    }


    document
        .getElementById(
            "winnerTitle"
        )
        .textContent =
        title;


    document
        .getElementById(
            "winnerScores"
        )
        .textContent =
        players[0].name +
        " " +
        players[0].score +
        " - " +
        players[1].score +
        " " +
        players[1].name;


    document
        .getElementById(
            "winnerMessage"
        )
        .textContent =
        message;


    saveLeaderboard();


    gameScreen
        .classList
        .add("hidden");


    winnerScreen
        .classList
        .remove("hidden");


    winSound();

}


/* =========================
   INPUT
========================= */

function handleInput(e) {

    if (gameOver) {

        return;

    }


    if (
        gameMode === "computer" &&
        currentPlayer === 1
    ) {

        return;

    }


    e.preventDefault();


    const rect =
        canvas.getBoundingClientRect();


    const clientX =
        e.touches
            ? e.touches[0].clientX
            : e.clientX;


    const clientY =
        e.touches
            ? e.touches[0].clientY
            : e.clientY;


    const scaleX =
        canvas.width /
        rect.width;


    const scaleY =
        canvas.height /
        rect.height;


    const x =
        (clientX - rect.left) *
        scaleX;


    const y =
        (clientY - rect.top) *
        scaleY;


    const line =
        findLine(
            x,
            y
        );


    if (line) {

        addLine(line);

    }

}


/* =========================
   INPUT EVENTS
========================= */

canvas.addEventListener(
    "click",
    handleInput
);


canvas.addEventListener(
    "touchstart",
    handleInput,
    {
        passive: false
    }
);


/* =========================
   COMPUTER AI
========================= */

function computerMove() {

    if (
        gameOver ||
        gameMode !== "computer" ||
        currentPlayer !== 1
    ) {

        return;

    }


    const moves =
        getAvailableMoves();


    if (
        moves.length === 0
    ) {

        return;

    }


    /* Take a box */

    for (
        const move of moves
    ) {

        if (
            moveCompletesBox(move)
        ) {

            addLine(move);

            return;

        }

    }


    /* Safe move */

    const safeMoves =
        moves.filter(
            move =>
                !moveCreatesBoxForOpponent(
                    move
                )
        );


    if (
        safeMoves.length > 0
    ) {

        const index =
            Math.floor(
                Math.random() *
                safeMoves.length
            );


        addLine(
            safeMoves[index]
        );


        return;

    }


    /* Random move */

    const index =
        Math.floor(
            Math.random() *
            moves.length
        );


    addLine(
        moves[index]
    );

}


/* =========================
   AVAILABLE MOVES
========================= */

function getAvailableMoves() {

    const moves = [];


    /* Horizontal */

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        for (
            let col = 0;
            col < cols - 1;
            col++
        ) {

            const move = {

                type:
                    "horizontal",

                row:
                    row,

                col:
                    col

            };


            if (
                !lineExists(move)
            ) {

                moves.push(move);

            }

        }

    }


    /* Vertical */

    for (
        let row = 0;
        row < rows - 1;
        row++
    ) {

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            const move = {

                type:
                    "vertical",

                row:
                    row,

                col:
                    col

            };


            if (
                !lineExists(move)
            ) {

                moves.push(move);

            }

        }

    }


    return moves;

}


/* =========================
   MOVE COMPLETES BOX
========================= */

function moveCompletesBox(move) {

    if (
        move.type ===
        "horizontal"
    ) {

        horizontalLines.push({

            type:
                "horizontal",

            row:
                move.row,

            col:
                move.col,

            player:
                currentPlayer

        });

    } else {

        verticalLines.push({

            type:
                "vertical",

            row:
                move.row,

            col:
                move.col,

            player:
                currentPlayer

        });

    }


    const result =
        countCompletedBoxes(
            move
        );


    if (
        move.type ===
        "horizontal"
    ) {

        horizontalLines.pop();

    } else {

        verticalLines.pop();

    }


    return result > 0;

}


/* =========================
   COUNT BOXES
========================= */

function countCompletedBoxes(move) {

    let count = 0;


    if (
        move.type ===
        "horizontal"
    ) {

        if (
            move.row > 0 &&
            isBoxComplete(
                move.row - 1,
                move.col
            )
        ) {

            count++;

        }


        if (
            move.row < rows - 1 &&
            isBoxComplete(
                move.row,
                move.col
            )
        ) {

            count++;

        }

    } else {

        if (
            move.col > 0 &&
            isBoxComplete(
                move.row,
                move.col - 1
            )
        ) {

            count++;

        }


        if (
            move.col < cols - 1 &&
            isBoxComplete(
                move.row,
                move.col
            )
        ) {

            count++;

        }

    }


    return count;

}


/* =========================
   MOVE CREATES BOX
========================= */

function moveCreatesBoxForOpponent(
    move
) {

    if (
        move.type ===
        "horizontal"
    ) {

        horizontalLines.push({

            type:
                "horizontal",

            row:
                move.row,

            col:
                move.col,

            player:
                currentPlayer

        });

    } else {

        verticalLines.push({

            type:
                "vertical",

            row:
                move.row,

            col:
                move.col,

            player:
                currentPlayer

        });

    }


    const createsBox =
        countCompletedBoxes(
            move
        ) > 0;


    if (
        move.type ===
        "horizontal"
    ) {

        horizontalLines.pop();

    } else {

        verticalLines.pop();

    }


    return createsBox;

}


/* =====================================================
   LEADERBOARD
===================================================== */

function getLeaderboard() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "poojyamVettuLeaderboard"
            )
        ) || {};

    } catch {

        return {};

    }

}


/* =========================
   SAVE LEADERBOARD
========================= */

function saveLeaderboard() {

    const leaderboard =
        getLeaderboard();


    updateLeaderboardPlayer(
        leaderboard,
        players[0].name,
        players[0].score,
        players[0].score >
        players[1].score
    );


    updateLeaderboardPlayer(
        leaderboard,
        players[1].name,
        players[1].score,
        players[1].score >
        players[0].score
    );


    localStorage.setItem(
        "poojyamVettuLeaderboard",
        JSON.stringify(
            leaderboard
        )
    );

}


/* =========================
   UPDATE PLAYER
========================= */

function updateLeaderboardPlayer(
    leaderboard,
    name,
    score,
    won
) {

    if (
        !leaderboard[name]
    ) {

        leaderboard[name] = {

            wins: 0,

            games: 0,

            boxes: 0,

            bestScore: 0

        };

    }


    leaderboard[name].games++;


    leaderboard[name].boxes +=
        score;


    if (
        score >
        leaderboard[name].bestScore
    ) {

        leaderboard[name].bestScore =
            score;

    }


    if (won) {

        leaderboard[name].wins++;

    }

}


/* =========================
   SHOW LEADERBOARD
========================= */

function showLeaderboard() {

    const leaderboard =
        getLeaderboard();


    const entries =
        Object.entries(
            leaderboard
        );


    entries.sort(
        (a, b) => {

            if (
                b[1].wins !==
                a[1].wins
            ) {

                return (
                    b[1].wins -
                    a[1].wins
                );

            }


            return (
                b[1].boxes -
                a[1].boxes
            );

        }
    );


    const list =
        document.getElementById(
            "leaderboardList"
        );


    list.innerHTML = "";


    if (
        entries.length === 0
    ) {

        list.innerHTML = `

            <p class="subtitle">
                No games played yet.
            </p>

        `;

    } else {

        list.innerHTML = `

            <div class="leaderHeader">

                <span>#</span>

                <span>Player</span>

                <span>Wins</span>

                <span>Best</span>

            </div>

        `;


        entries
            .slice(0, 10)
            .forEach(
                ([name, data], index) => {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "leaderboardRow";


                    row.innerHTML = `

                        <span class="rank">
                            ${
                                index === 0
                                    ? "🥇"
                                    : index === 1
                                    ? "🥈"
                                    : index === 2
                                    ? "🥉"
                                    : index + 1
                            }
                        </span>

                        <span class="leaderName">
                            ${escapeHTML(name)}
                        </span>

                        <span class="stat">
                            ${data.wins}
                        </span>

                        <span class="stat">
                            ${data.bestScore}
                        </span>

                    `;


                    list.appendChild(row);

                }
            );

    }


    startScreen
        .classList
        .add("hidden");


    gameScreen
        .classList
        .add("hidden");


    winnerScreen
        .classList
        .add("hidden");


    leaderboardScreen
        .classList
        .remove("hidden");

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================
   LEADERBOARD BUTTONS
========================= */

document
    .getElementById(
        "leaderboardButton"
    )
    .addEventListener(
        "click",
        showLeaderboard
    );


document
    .getElementById(
        "leaderboardGameButton"
    )
    .addEventListener(
        "click",
        showLeaderboard
    );


document
    .getElementById(
        "winnerLeaderboardButton"
    )
    .addEventListener(
        "click",
        showLeaderboard
    );


document
    .getElementById(
        "closeLeaderboardButton"
    )
    .addEventListener(
        "click",
        function() {

            leaderboardScreen
                .classList
                .add("hidden");


            startScreen
                .classList
                .remove("hidden");

        }
    );


/* =========================
   CLEAR LEADERBOARD
========================= */

document
    .getElementById(
        "clearLeaderboardButton"
    )
    .addEventListener(
        "click",
        function() {

            const confirmed =
                confirm(
                    "Clear all leaderboard records?"
                );


            if (
                confirmed
            ) {

                localStorage.removeItem(
                    "poojyamVettuLeaderboard"
                );


                showLeaderboard();

            }

        }
    );


/* =========================
   INITIAL BOARD
========================= */

resizeBoard();