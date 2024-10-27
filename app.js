import { questions } from './questions.js';
import { renderQuestion } from './ui.js';

let currentQuestionIndex = 0;
const answers = [];

// Offline music recommendations
const musicRecommendations = {
    depressed: [
        { name: 'Sad Song', path: 'music1.mp3' },
        { name: 'Melancholy Tune', path: 'pmusic1.mp3' },
        { name: 'Heavy Heart', path: 'music1.mp3' }
    ],
    sad: [
        { name: 'Slow Ballad', path: 'music1.mp3' },
        { name: 'Contemplative Piece', path: 'music1.mp3' },
        { name: 'Gentle Melody', path: 'music1.mp3' }
    ],
    neutral: [
        { name: 'Ambient Sounds', path: 'music1.mp3' },
        { name: 'Chill Instrumental', path: 'music1.mp3' },
        { name: 'Smooth Jazz', path: 'music1.mp3' }
    ],
    stressed: [
        { name: 'Relaxing Nature', path: 'music1.mp3' },
        { name: 'Calm Ocean Waves', path: 'music1.mp3' },
        { name: 'Meditation Track', path: 'music1.mp3' }
    ],
    happy: [
        { name: 'Uplifting Anthem', path: 'music1.mp3' },
        { name: 'Joyful Tune', path: 'music1.mp3' },
        { name: 'Happy Vibes', path: 'music1.mp3' }
    ]
};

let audio = null;
let currentTrackIndex = 0;

function initializeApp() {
    const startButton = document.getElementById('startButton');
    const heroSection = document.getElementById('hero');
    const assessmentSection = document.getElementById('assessment');

    startButton.addEventListener('click', () => {
        heroSection.classList.remove('visible');
        heroSection.classList.add('hidden');
        assessmentSection.classList.remove('hidden');
        assessmentSection.classList.add('visible');
        showQuestion(currentQuestionIndex);
    });
}

function showQuestion(index) {
    const questionContainer = document.querySelector('.question-container');
    if (index < questions.length) {
        const questionHTML = renderQuestion(questions[index], index);
        questionContainer.innerHTML = questionHTML;
        updateProgress((index / questions.length) * 100);

        const options = questionContainer.querySelectorAll('input[type="radio"]');
        options.forEach(option => {
            option.addEventListener('change', () => {
                answers[index] = parseInt(option.value);
                setTimeout(() => {
                    currentQuestionIndex++;
                    showQuestion(currentQuestionIndex);
                }, 500);
            });
        });
    } else {
        const mood = calculateMood(answers);
        showResults(mood);
    }
}

function updateProgress(percentage) {
    const progressBar = document.querySelector('.progress');
    progressBar.style.width = `${percentage}%`;
}

function calculateMood(answers) {
    // Calculate scores for each scale
    const phq9Score = answers.slice(0, 3).reduce((acc, val) => acc + (val || 0), 0);
    const gad7Score = answers.slice(3, 5).reduce((acc, val) => acc + (val || 0), 0);
    const pssScore = answers.slice(5, 8).reduce((acc, val) => acc + (val || 0), 0);

    // Determine mood based on scores
    if (phq9Score >= 10) return 'depressed';
    if (gad7Score >= 8) return 'stressed';
    if (phq9Score >= 5 && gad7Score >= 5) return 'sad';
    if (pssScore <= 4) return 'happy';
    return 'neutral';
}

function showResults(mood) {
    const assessmentSection = document.getElementById('assessment');
    const recommendedMusic = getMusicRecommendations(mood);

    assessmentSection.innerHTML = `
        <div class="container">
            <div class="text-center">
                <h2>Assessment Complete</h2>
                <br>
                <p>Your mood: ${mood.charAt(0).toUpperCase() + mood.slice(1)}</p>
                <br>
                <p>Here the music track to boost your mood</p>
                <br>
                <button class="primary-button" id="playButton">Play Music</button>
                <button class="primary-button" id="pauseButton">Pause Music</button>
                <button class="primary-button" id="nextButton">Next Track</button>
                <button class="primary-button" onclick="location.reload()">Start Over</button>
            </div>
        </div>
    `;

    currentTrackIndex = 0;
    playRecommendedMusic(recommendedMusic);
}

function getMusicRecommendations(mood) {
    return musicRecommendations[mood] || [];
}

function playRecommendedMusic(recommendedMusic) {
    if (recommendedMusic.length > 0) {
        audio = new Audio(recommendedMusic[currentTrackIndex].path);
        audio.play();

        audio.onended = () => {
            currentTrackIndex++;
            if (currentTrackIndex < recommendedMusic.length) {
                audio.src = recommendedMusic[currentTrackIndex].path;
                audio.play();
            } else {
                currentTrackIndex = 0;
            }
        };

        document.getElementById('playButton').onclick = () => audio.play();
        document.getElementById('pauseButton').onclick = () => audio.pause();
        document.getElementById('nextButton').onclick = () => {
            currentTrackIndex++;
            if (currentTrackIndex < recommendedMusic.length) {
                audio.src = recommendedMusic[currentTrackIndex].path;
                audio.play();
            } else {
                currentTrackIndex = 0;
            }
        };
    }
}

// Start the application
initializeApp();
