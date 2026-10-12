const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


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
    },

    {
        name: "Player 3",
        score: 0,
        symbol: "3"
    },

    {
        name: "Player 4",
        score: 0,
        symbol: "4"
    }

];


let playerCount = 2;

let currentPlayer = 0;

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

    if (!soundEnabled) return;

    const audio = getAudioContext();

    if (audio.state === "suspended") {
        audio.resume();
    }

    const oscillator =
        audio.createOscillator();

    const gain =
        audio.createGain();

    oscillator.type = type;

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
    gain.connect(audio.destination);

    oscillator.start();

    oscillator.stop(
        audio.currentTime + duration
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

    setTimeout(() => {

        playSound(
            850,
            0.15
        );

    }, 80);

}


function winSound() {

    playSound(520, 0.15);

    setTimeout(() => {
        playSound(660, 0.15);
    }, 130);

    setTimeout(() => {
        playSound(880, 0.25);
    }, 260);

}


/* =========================
   SCREENS
========================= */

const startScreen =
    document.getElementById("startScreen");

const gameScreen =
    document.getElementById("gameScreen");

const winnerScreen =
    document.getElementById("winnerScreen");

const leaderboardScreen =
    document.getElementById("leaderboardScreen");


/* =========================
   BOARD SIZE
========================= */

document
    .querySelectorAll(".sizeButton[data-size]")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".sizeButton[data-size]"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });

                this.classList.add("selected");

                rows =
                    Number(
                        this.dataset.size
                    );

                cols = rows;

            }
        );

    });


/* =========================
   PLAYER COUNT
========================= */

document
    .querySelectorAll(".sizeButton[data-players]")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".sizeButton[data-players]"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });

                this.classList.add("selected");

                playerCount =
                    Number(
                        this.dataset.players
                    );

                updatePlayerInputs();

            }
        );

    });


/* =========================
   GAME MODE
========================= */

document
    .querySelectorAll(".modeButton[data-mode]")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".modeButton[data-mode]"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "selected"
                        );

                    });

                this.classList.add("selected");

                gameMode =
                    this.dataset.mode;

                updatePlayerInputs();

            }
        );

    });


/* =========================
   UPDATE PLAYER INPUTS
========================= */

function updatePlayerInputs() {

    const player2Box =
        document.getElementById(
            "player2NameBox"
        );

    const player3Box =
        document.getElementById(
            "player3NameBox"
        );

    const player4Box =
        document.getElementById(
            "player4NameBox"
        );

    if (gameMode === "computer") {

        player2Box.style.display = "none";
        player3Box.style.display = "none";
        player4Box.style.display = "none";

    } else {

        player2Box.style.display =
            playerCount >= 2
                ? "block"
                : "none";

        player3Box.style.display =
            playerCount >= 3
                ? "block"
                : "none";

        player4Box.style.display =
            playerCount >= 4
                ? "block"
                : "none";

    }

}


/* =========================
   START GAME
========================= */

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        startGame
    );


function startGame() {

    const name1 =
        document
            .getElementById("player1Name")
            .value
            .trim();

    const name2 =
        document
            .getElementById("player2Name")
            .value
            .trim();

    const name3 =
        document
            .getElementById("player3Name")
            .value
            .trim();

    const name4 =
        document
            .getElementById("player4Name")
            .value
            .trim();


    players[0].name =
        name1 || "Player 1";


    if (gameMode === "computer") {

        players[1].name = "Computer";

        playerCount = 2;

    } else {

        players[1].name =
            name2 || "Player 2";

        players[2].name =
            name3 || "Player 3";

        players[3].name =
            name4 || "Player 4";

    }


    resetGame();


    startScreen.classList.add("hidden");

    winnerScreen.classList.add("hidden");

    leaderboardScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");


    updatePlayerCards();

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


    for (let i = 0; i < players.length; i++) {

        players[i].score = 0;

    }


    resizeBoard();

    updatePlayerCards();

    updateInfo();

}


/* =========================
   NEW GAME
========================= */

document
    .getElementById("newGameButton")
    .addEventListener(
        "click",
        resetGame
    );


/* =========================
   PLAY AGAIN
========================= */

document
    .getElementById("playAgainButton")
    .addEventListener(
        "click",
        function() {

            winnerScreen.classList.add("hidden");

            gameScreen.classList.remove("hidden");

            resetGame();

        }
    );


/* =========================
   SOUND BUTTON
========================= */

document
    .getElementById("soundButton")
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
   PLAYER CARDS
========================= */

function updatePlayerCards() {

    for (let i = 1; i <= 4; i++) {

        const card =
            document.getElementById(
                `player${i}Card`
            );

        if (!card) continue;

        if (i <= playerCount) {

            card.style.display = "flex";

        } else {

            card.style.display = "none";

        }

    }

}


/* =========================
   RESIZE BOARD
========================= */

function resizeBoard() {

    const size =
        Math.min(
            window.innerWidth - 40,
            600
        );


    canvas.width = size;

    canvas.height = size;


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


    ctx.fillStyle = "#f5f1df";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* BOXES */

    for (const box of boxes) {

        const x =
            startX +
            box.col * spacing;

        const y =
            startY +
            box.row * spacing;


        const colors = [
            "#ffd6d6",
            "#d6e5ff",
            "#d6ffd9",
            "#ead6ff"
        ];


        const textColors = [
            "#d94b4b",
            "#3478c9",
            "#29933d",
            "#8a4bc9"
        ];


        ctx.fillStyle =
            colors[box.player];


        ctx.fillRect(
            x + 5,
            y + 5,
            spacing - 10,
            spacing - 10
        );


        ctx.fillStyle =
            textColors[box.player];


        ctx.font =
            "bold 30px Arial";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";


        ctx.fillText(
            players[box.player].symbol,
            x + spacing / 2,
            y + spacing / 2
        );

    }


    /* LINES */

    ctx.lineWidth = 6;

    ctx.lineCap = "round";


    const lineColors = [
        "#e05252",
        "#3f8edb",
        "#29933d",
        "#8a4bc9"
    ];


    /* HORIZONTAL */

    for (const line of horizontalLines) {

        const x1 =
            startX +
            line.col * spacing;

        const y =
            startY +
            line.row * spacing;

        const x2 =
            x1 + spacing;


        ctx.strokeStyle =
            lineColors[line.player];


        ctx.beginPath();

        ctx.moveTo(x1, y);

        ctx.lineTo(x2, y);

        ctx.stroke();

    }


    /* VERTICAL */

    for (const line of verticalLines) {

        const x =
            startX +
            line.col * spacing;

        const y1 =
            startY +
            line.row * spacing;

        const y2 =
            y1 + spacing;


        ctx.strokeStyle =
            lineColors[line.player];


        ctx.beginPath();

        ctx.moveTo(x, y1);

        ctx.lineTo(x, y2);

        ctx.stroke();

    }


    /* DOTS */

    ctx.fillStyle = "#222";


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
                col * spacing;

            const y =
                startY +
                row * spacing;


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

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const label =
            document.getElementById(
                `player${i + 1}Label`
            );

        const score =
            document.getElementById(
                `player${i + 1}Score`
            );

        if (label) {

            label.textContent =
                players[i].name;

        }

        if (score) {

            score.textContent =
                players[i].score;

        }

    }


    document
        .getElementById("turnLabel")
        .textContent =
        players[currentPlayer].name;


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const card =
            document.getElementById(
                `player${i + 1}Card`
            );

        if (card) {

            card.classList.toggle(
                "active",
                currentPlayer === i
            );

        }

    }

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
                col * spacing;

            const x2 =
                x1 + spacing;

            const lineY =
                startY +
                row * spacing;


            const distance =
                distanceToHorizontalLine(
                    x,
                    y,
                    x1,
                    x2,
                    lineY
                );


            if (
                distance < bestDistance
            ) {

                const candidate = {

                    type: "horizontal",

                    row: row,

                    col: col

                };


                if (
                    !lineExists(candidate)
                ) {

                    bestDistance = distance;

                    bestLine = candidate;

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
                col * spacing;

            const y1 =
                startY +
                row * spacing;

            const y2 =
                y1 + spacing;


            const distance =
                distanceToVerticalLine(
                    x,
                    y,
                    lineX,
                    y1,
                    y2
                );


            if (
                distance < bestDistance
            ) {

                const candidate = {

                    type: "vertical",

                    row: row,

                    col: col

                };


                if (
                    !lineExists(candidate)
                ) {

                    bestDistance = distance;

                    bestLine = candidate;

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

        return Math.abs(py - y);

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

        return Math.abs(px - x);

    }

    return Infinity;

}


/* =========================
   LINE EXISTS
========================= */

function lineExists(line) {

    if (
        line.type === "horizontal"
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
        line.type === "horizontal"
    ) {

        horizontalLines.push(line);

    } else {

        verticalLines.push(line);

    }


    lineSound();


    const completed =
        checkCompletedBoxes(line);


    if (completed > 0) {

        players[currentPlayer].score +=
            completed;

        boxSound();

        animateScore(currentPlayer);

    } else {

        switchTurn();

    }


    draw();


    checkGameOver();


    if (
        !gameOver &&
        gameMode === "computer" &&
        playerCount === 2 &&
        currentPlayer === 1
    ) {

        setTimeout(
            computerMove,
            600
        );

    }

    if (gameMode === "online") {
        publishOnlineState();
    }

}


/* =========================
   SCORE ANIMATION
========================= */

function animateScore(player) {

    const element =
        document.getElementById(
            `player${player + 1}Score`
        );


    if (!element) return;


    element.animate(

        [
            {
                transform: "scale(1)"
            },

            {
                transform: "scale(1.45)"
            },

            {
                transform: "scale(1)"
            }

        ],

        {
            duration: 350
        }

    );

}


/* =========================
   CHECK BOXES
========================= */

function checkCompletedBoxes(line) {

    let completed = 0;


    if (
        line.type === "horizontal"
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

function isBoxComplete(row, col) {

    if (
        row < 0 ||
        col < 0 ||
        row >= rows - 1 ||
        col >= cols - 1
    ) {

        return false;

    }


    const top = {

        type: "horizontal",
        row: row,
        col: col

    };


    const bottom = {

        type: "horizontal",
        row: row + 1,
        col: col

    };


    const left = {

        type: "vertical",
        row: row,
        col: col

    };


    const right = {

        type: "vertical",
        row: row,
        col: col + 1

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

function claimBox(row, col) {

    boxes.push({

        row: row,

        col: col,

        player: currentPlayer

    });

}


/* =========================
   BOX ALREADY CLAIMED
========================= */

function boxAlreadyClaimed(row, col) {

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

    currentPlayer++;

    if (
        currentPlayer >= playerCount
    ) {

        currentPlayer = 0;

    }

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

    let winner = null;

    let highestScore = -1;

    let tie = false;


    for (
        let i = 0;
        i < playerCount;
        i++
    ) {

        if (
            players[i].score >
            highestScore
        ) {

            highestScore =
                players[i].score;

            winner = players[i];

            tie = false;

        } else if (
            players[i].score ===
            highestScore
        ) {

            tie = true;

        }

    }


    const title =
        document.getElementById(
            "winnerTitle"
        );


    const scores =
        document.getElementById(
            "winnerScores"
        );


    const message =
        document.getElementById(
            "winnerMessage"
        );


    if (tie) {

        title.textContent =
            "It's a Draw! 🤝";

        message.textContent =
            "What a close game!";

    } else {

        title.textContent =
            winner.name +
            " Wins! 🎉";

        message.textContent =
            "Excellent game!";

    }


    let scoreText = "";


    for (
        let i = 0;
        i < playerCount;
        i++
    ) {

        scoreText +=
            players[i].name +
            ": " +
            players[i].score;

        if (
            i < playerCount - 1
        ) {

            scoreText += "  •  ";

        }

    }


    scores.textContent =
        scoreText;


    saveLeaderboard();


    gameScreen.classList.add("hidden");

    winnerScreen.classList.remove("hidden");


    winSound();

}


/* =========================
   INPUT
========================= */

function handleInput(e) {

    if (gameOver) return;

    if (gameMode === "online" && currentPlayer !== onlinePlayerIndex) {
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
        findLine(x, y);


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
   COMPUTER
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


    if (!moves.length) return;


    /* Take a box if possible */

    for (const move of moves) {

        if (
            moveCompletesBox(move)
        ) {

            addLine(move);

            return;

        }

    }


    /* Otherwise random safe move */

    const safeMoves =
        moves.filter(
            move =>
                !moveCreatesBoxForOpponent(
                    move
                )
        );


    const list =
        safeMoves.length
            ? safeMoves
            : moves;


    const index =
        Math.floor(
            Math.random() *
            list.length
        );


    addLine(list[index]);

}


/* =========================
   AVAILABLE MOVES
========================= */

function getAvailableMoves() {

    const moves = [];


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

                type: "horizontal",
                row: row,
                col: col

            };


            if (!lineExists(move)) {

                moves.push(move);

            }

        }

    }


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

                type: "vertical",
                row: row,
                col: col

            };


            if (!lineExists(move)) {

                moves.push(move);

            }

        }

    }


    return moves;

}


/* =========================
   COMPUTER TEST MOVE
========================= */

function moveCompletesBox(move) {

    temporarilyAddMove(move);


    const result =
        countCompletedBoxes(move) > 0;


    temporarilyRemoveMove(move);


    return result;

}


function moveCreatesBoxForOpponent(move) {

    temporarilyAddMove(move);


    const result =
        countCompletedBoxes(move) > 0;


    temporarilyRemoveMove(move);


    return result;

}


function temporarilyAddMove(move) {

    const copy = {

        type: move.type,
        row: move.row,
        col: move.col,
        player: currentPlayer

    };


    if (
        move.type === "horizontal"
    ) {

        horizontalLines.push(copy);

    } else {

        verticalLines.push(copy);

    }

}


function temporarilyRemoveMove(move) {

    if (
        move.type === "horizontal"
    ) {

        horizontalLines.pop();

    } else {

        verticalLines.pop();

    }

}


function countCompletedBoxes(move) {

    let count = 0;


    if (
        move.type === "horizontal"
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
   LEADERBOARD
========================= */

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


function saveLeaderboard() {

    const leaderboard =
        getLeaderboard();


    for (
        let i = 0;
        i < playerCount;
        i++
    ) {

        const name =
            players[i].name;

        const score =
            players[i].score;


        if (!leaderboard[name]) {

            leaderboard[name] = {

                wins: 0,

                games: 0,

                boxes: 0,

                bestScore: 0

            };

        }


        leaderboard[name].games++;

        leaderboard[name].boxes += score;


        if (
            score >
            leaderboard[name].bestScore
        ) {

            leaderboard[name].bestScore =
                score;

        }

    }


    let highest = -1;


    for (
        let i = 0;
        i < playerCount;
        i++
    ) {

        highest =
            Math.max(
                highest,
                players[i].score
            );

    }


    for (
        let i = 0;
        i < playerCount;
        i++
    ) {

        if (
            players[i].score ===
            highest
        ) {

            leaderboard[
                players[i].name
            ].wins++;

        }

    }


    localStorage.setItem(
        "poojyamVettuLeaderboard",
        JSON.stringify(leaderboard)
    );

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


    if (!entries.length) {

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


    startScreen.classList.add("hidden");

    gameScreen.classList.add("hidden");

    winnerScreen.classList.add("hidden");

    leaderboardScreen.classList.remove("hidden");

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   LEADERBOARD BUTTONS
========================= */

document
    .getElementById("leaderboardButton")
    .addEventListener(
        "click",
        showLeaderboard
    );


document
    .getElementById("leaderboardGameButton")
    .addEventListener(
        "click",
        showLeaderboard
    );


document
    .getElementById("winnerLeaderboardButton")
    .addEventListener(
        "click",
        showLeaderboard
    );


document
    .getElementById("closeLeaderboardButton")
    .addEventListener(
        "click",
        function() {

            leaderboardScreen.classList.add(
                "hidden"
            );

            startScreen.classList.remove(
                "hidden"
            );

        }
    );


/* =========================
   CLEAR LEADERBOARD
========================= */

document
    .getElementById("clearLeaderboardButton")
    .addEventListener(
        "click",
        function() {

            if (
                confirm(
                    "Clear all leaderboard records?"
                )
            ) {

                localStorage.removeItem(
                    "poojyamVettuLeaderboard"
                );

                showLeaderboard();

            }

        }
    );




/* =========================
   ONLINE MULTIPLAYER (FIREBASE)
   Requires firebase-init.js to define `auth` and `database`.
========================= */

let onlineRoomCode = null;
let onlinePlayerIndex = -1;
let onlineRoomRef = null;
let onlineListener = null;
let applyingOnlineState = false;
let onlineWriteInProgress = false;

function onlineStatus(message) {
    const el = document.getElementById("onlineStatus");
    if (el) el.textContent = message;
}

function makeRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

async function ensureOnlineUser() {
    if (typeof auth === "undefined" || typeof database === "undefined") {
        throw new Error("Firebase is not initialized. Check firebase-init.js and script order.");
    }
    if (auth.currentUser) return auth.currentUser;
    const result = await auth.signInAnonymously();
    return result.user;
}

function getOnlineSnapshot() {
    return {
        rows,
        cols,
        playerCount: 2,
        currentPlayer,
        gameOver,
        players: players.slice(0, 2).map(p => ({ name: p.name, score: p.score, symbol: p.symbol })),
        horizontalLines: horizontalLines.map(l => ({ type: l.type, row: l.row, col: l.col, player: l.player })),
        verticalLines: verticalLines.map(l => ({ type: l.type, row: l.row, col: l.col, player: l.player })),
        boxes: boxes.map(b => ({ row: b.row, col: b.col, player: b.player })),
        updatedAt: Date.now()
    };
}

async function publishOnlineState() {
    if (gameMode !== "online" || !onlineRoomRef || applyingOnlineState || onlineWriteInProgress) return;
    onlineWriteInProgress = true;
    try {
        await onlineRoomRef.child("state").set(getOnlineSnapshot());
        onlineStatus(`Connected to room ${onlineRoomCode}. You are Player ${onlinePlayerIndex + 1}.`);
    } catch (error) {
        console.error("Could not sync game state:", error);
        onlineStatus("Sync failed. Check your Firebase Realtime Database rules and connection.");
    } finally {
        onlineWriteInProgress = false;
    }
}

function applyOnlineSnapshot(state) {
    if (!state || !Array.isArray(state.horizontalLines) || !Array.isArray(state.verticalLines)) return;
    applyingOnlineState = true;
    rows = Number(state.rows) || 4;
    cols = Number(state.cols) || rows;
    playerCount = 2;
    currentPlayer = Number(state.currentPlayer) === 1 ? 1 : 0;
    gameOver = Boolean(state.gameOver);
    horizontalLines = state.horizontalLines;
    verticalLines = state.verticalLines;
    boxes = Array.isArray(state.boxes) ? state.boxes : [];
    if (Array.isArray(state.players)) {
        for (let i = 0; i < 2; i++) {
            if (state.players[i]) {
                players[i].name = state.players[i].name || `Player ${i + 1}`;
                players[i].score = Number(state.players[i].score) || 0;
            }
        }
    }
    gameMode = "online";
    resizeBoard();
    updatePlayerCards();
    updateInfo();
    applyingOnlineState = false;

    if (gameOver && winnerScreen.classList.contains("hidden")) {
        setTimeout(() => {
            if (gameMode === "online" && gameOver && winnerScreen.classList.contains("hidden")) showWinner();
        }, 250);
    }
}

function listenToOnlineRoom() {
    if (onlineRoomRef && onlineListener) {
        onlineRoomRef.child("state").off("value", onlineListener);
    }
    onlineListener = snapshot => {
        const state = snapshot.val();
        if (state) applyOnlineSnapshot(state);
    };
    onlineRoomRef.child("state").on("value", onlineListener, error => {
        console.error("Room listener error:", error);
        onlineStatus("Could not read this room. Check Firebase rules.");
    });
    onlineRoomRef.child("guestUid").on("value", snapshot => {
        if (snapshot.val()) onlineStatus(`Room ${onlineRoomCode} is connected. You are Player ${onlinePlayerIndex + 1}.`);
    });
}

function beginOnlineSession(code, playerIndex, roomData) {
    onlineRoomCode = code;
    onlinePlayerIndex = playerIndex;
    onlineRoomRef = database.ref(`rooms/${code}`);
    gameMode = "online";
    playerCount = 2;
    rows = Number(roomData.state && roomData.state.rows) || rows;
    cols = Number(roomData.state && roomData.state.cols) || rows;
    players[0].name = roomData.hostName || "Host";
    players[1].name = roomData.guestName || "Guest";
    players[0].score = 0;
    players[1].score = 0;
    horizontalLines = [];
    verticalLines = [];
    boxes = [];
    currentPlayer = 0;
    gameOver = false;
    startScreen.classList.add("hidden");
    winnerScreen.classList.add("hidden");
    leaderboardScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    updatePlayerCards();
    resizeBoard();
    listenToOnlineRoom();
    onlineStatus(`Room ${code} ready. You are Player ${playerIndex + 1}.`);
}

async function createOnlineRoom() {
    try {
        onlineStatus("Signing in and creating room…");
        const user = await ensureOnlineUser();
        const nameInput = document.getElementById("player1Name");
        const hostName = (nameInput && nameInput.value.trim()) || "Host";
        let code, ref, created = false;
        for (let attempt = 0; attempt < 5 && !created; attempt++) {
            code = makeRoomCode();
            ref = database.ref(`rooms/${code}`);
            const result = await ref.transaction(current => {
                if (current !== null) return;
                return {
                    hostUid: user.uid,
                    guestUid: null,
                    hostName,
                    guestName: "Guest",
                    createdAt: Date.now(),
                    state: {
                        rows, cols, playerCount: 2, currentPlayer: 0, gameOver: false,
                        players: [{ name: hostName, score: 0, symbol: "1" }, { name: "Guest", score: 0, symbol: "2" }],
                        horizontalLines: [], verticalLines: [], boxes: [], updatedAt: Date.now()
                    }
                };
            });
            created = result.committed;
        }
        if (!created) throw new Error("Could not reserve a unique room code. Try again.");
        beginOnlineSession(code, 0, (await ref.once("value")).val());
        await publishOnlineState();
        onlineStatus(`Room created: ${code}. Share this code with your friend.`);
        alert(`Room code: ${code}\nShare this code with your friend.`);
    } catch (error) {
        console.error(error);
        onlineStatus(error.message || "Could not create room. Check Firebase setup and rules.");
    }
}

async function joinOnlineRoom() {
    try {
        const input = document.getElementById("roomCodeInput");
        const code = input ? input.value.trim().toUpperCase() : "";
        if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) {
            onlineStatus("Enter a valid 6-character room code.");
            return;
        }
        onlineStatus("Joining room…");
        const user = await ensureOnlineUser();
        const ref = database.ref(`rooms/${code}`);
        const result = await ref.transaction(room => {
            if (!room || !room.hostUid || room.hostUid === user.uid) return;
            if (room.guestUid && room.guestUid !== user.uid) return;
            room.guestUid = user.uid;
            const nameInput = document.getElementById("player1Name");
            room.guestName = (nameInput && nameInput.value.trim()) || "Guest";
            return room;
        });
        if (!result.committed) throw new Error("Room not found, already full, or you are the host. Check the code.");
        const roomData = result.snapshot.val();
        beginOnlineSession(code, 1, roomData);
        await ref.child("guestName").set(players[1].name);
        onlineStatus(`Joined room ${code}. Wait for your turn.`);
    } catch (error) {
        console.error(error);
        onlineStatus(error.message || "Could not join room. Check Firebase setup and rules.");
    }
}

const createRoomButton = document.getElementById("createRoomButton");
if (createRoomButton) createRoomButton.addEventListener("click", createOnlineRoom);
const joinRoomButton = document.getElementById("joinRoomButton");
if (joinRoomButton) joinRoomButton.addEventListener("click", joinOnlineRoom);


/* =========================
   INITIAL SETUP
========================= */

updatePlayerInputs();

resizeBoard();