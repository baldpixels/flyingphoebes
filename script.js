document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const meowSound = document.getElementById('meowSound');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const squeakSound = document.getElementById('squeakSound');
    const eatingSound = document.getElementById('eatingSound');
    const guineaPigImg = document.getElementById('guineaPig');
    const lettuceImg = document.getElementById('lettuce');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');

    const catImages = ['cat1.png', 'cat2.png', 'cat3.png', 'cat4.png'];
    const speeds = [2000, 1500, 1000, 3000]; // Speed for each cat
    const colors = ['#FFB6C1', '#FFD700', '#87CEFA', '#9370DB', '#FF6347', '#98FB98']; // Pastel colors

    let score = 0;
    let time = 60;
    let gameInterval;
    let colorInterval;

    // Function to start the game
    function startGame() {
        score = 0;
        time = 60;
        updateScore();
        updateTimer();
        guineaPigImg.classList.add('hidden');
        lettuceImg.classList.add('hidden');
        document.body.style.backgroundColor = '';

        gameInterval = setInterval(createCat, 1000); // Create a new cat every second
        colorInterval = setInterval(changeBackgroundColor, 2000); // Change background color every 2 seconds
        const timerCountdown = setInterval(() => {
            time--;
            updateTimer();

            if (time <= 0) {
                clearInterval(timerCountdown);
                endGame();
            }
        }, 1000);
    }

    // Function to create a flying cat
    function createCat() {
        const catImg = document.createElement('img');
        const randomIndex = Math.floor(Math.random() * catImages.length);
        catImg.src = catImages[randomIndex];
        catImg.classList.add('cat');

        // Randomize initial position
        const x = Math.random() * (window.innerWidth - 200); // Width of the cat image
        const y = Math.random() * (window.innerHeight - 200); // Height of the cat image
        catImg.style.left = `${x}px`;
        catImg.style.top = `${y}px`;

        // Add click event to play sound and adjust score
        catImg.addEventListener('click', () => {
            meowSound.currentTime = 0; // Reset sound to play from the beginning
            meowSound.play();

            if (randomIndex === 0) {
                score++; // cat1 gives 1 point
            } else if (randomIndex === 1) {
                score += 2; // cat2 gives 2 points
            } else if (randomIndex === 2) {
                score += 3; // cat3 gives 3 points
            } else {
                score -= 5; // cat4 deducts 5 points
            }

            updateScore();
            gameArea.removeChild(catImg); // Remove cat after click

            if (score < 0) {
                endGame('lose');
            } else if (score >= 25) {
                endGame('win');
            }
        });

        // Append to game area
        gameArea.appendChild(catImg);

        // Animate the cat flying faster over time
        flyCat(catImg, speeds[randomIndex]);
    }

    // Function to animate the cat's flight
    function flyCat(catImg, speed) {
        const duration = Math.random() * speed + speed; // Random duration based on speed
        const startX = parseFloat(catImg.style.left);
        const startY = parseFloat(catImg.style.top);
        const endX = Math.random() * (window.innerWidth - 200);
        const endY = Math.random() * (window.innerHeight - 200);

        catImg.animate([
            { transform: `translate(${startX}px, ${startY}px)` },
            { transform: `translate(${endX}px, ${endY}px)` }
        ], {
            duration: duration,
            easing: 'ease-in-out',
            fill: 'forwards'
        }).onfinish = () => {
            gameArea.removeChild(catImg); // Remove cat after flying
        };
    }

    // Function to change background color
    function changeBackgroundColor() {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.style.backgroundColor = randomColor;
    }

    // Function to update the score display
    function updateScore() {
        scoreDisplay.innerText = `Score: ${score}/25`;
    }

    // Function to update the timer display
    function updateTimer() {
        timerDisplay.innerText = `Time: ${time}`;
    }

    // Function to end the game
    function endGame(result) {
        clearInterval(gameInterval);
        clearInterval(colorInterval);
        backgroundMusic.pause();
        document.body.style.backgroundColor = 'black';

        // Remove all cats
        const cats = document.querySelectorAll('.cat');
        cats.forEach(cat => gameArea.removeChild(cat));

        if (result === 'lose') {
            const gameOverText = document.createElement('div');
            gameOverText.className = 'game-over';
            gameOverText.innerText = 'Game Over';
            document.body.appendChild(gameOverText);
        } else if (result === 'win') {
            guineaPigImg.classList.remove('hidden');
            startGuineaPigGame();
        }

        // Restart game after a timeout
        setTimeout(() => {
            if (result === 'lose') {
                startGame(); // Restart the game
            }
        }, 2000);
    }

    // Function to start the guinea pig game
    function startGuineaPigGame() {
        document.body.style.cursor = 'url(lettuce.png), auto'; // Update cursor to lettuce
        squeakSound.play();

        guineaPigImg.addEventListener('click', () => {
            squeakSound.pause();
            setTimeout(() => {
                eatingSound.play();
                score += 1000000; // Add 1 million points for clicking the guinea pig
                updateScore();
                displayWinMessage();
            }, 500);
        });
    }

    // Function to display win message
    function displayWinMessage() {
        const winMessage = document.createElement('div');
        winMessage.className = 'game-over';
        winMessage.innerText = 'You Win';
        document.body.appendChild(winMessage);
        squeakSound.loop = true; // Loop squeaking sound
        squeakSound.play();
    }

    // Start the game
    startGame();
});