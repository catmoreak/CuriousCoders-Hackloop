import { questions } from './questions.js';
import { renderQuestion } from './ui.js';

let currentQuestionIndex = 0;
const answers = [];


const musicRecommendations = {
    depressed: [
        { name: 'Canon in', path: 'musics/Depression/canon.mp3' },
        { name: 'Edvard', path: 'musics/Depression/edvard.mp3' },
        { name: 'Lagaan', path: 'musics/Depression/lagaan.mp3' },
        { name: 'Ludovicho', path: 'musics/Depression/ludo.mp3' }

        
    ],
    sad: [
        { name: 'Sky', path: 'musics/Sad/sky.mp3' },
        { name: 'Clock', path: 'musics/Sad/clocks.mp3' },
        { name: 'Hauser', path: 'musics/Sad/hauser.mp3' },
        { name: 'Tuj me rabh dikhta hey', path: 'musics/Sad/tujeme.mp3' }
    ],
    calm: [
        { name: 'Audio1', path: 'musics/Nuetral/audio1.mpeg' },
        { name: 'Audio2', path: 'musics/Nuetral/audio2.mpeg' },
        { name: 'Audio3', path: 'musics/Nuetral/audio3.mpeg' },
        { name: 'Audio4', path: 'musics/Nuetral/audio4.mpeg' },
        { name: 'Audio5', path: 'musics/Nuetral/audio5.mpeg' }

    ],
    stressed: [
        { name: 'Ek Ladki Ko Dekha Toh Ais', path: 'musics/Stress/ekladki.mp3' },
        { name: 'Enya', path: 'musics/Stress/enya.mp3' },
        { name: 'Jashn', path: 'musics/Stress/jashn.mp3' },
        { name: 'Marconi', path: 'musics/Stress/marconi.mp3' },
        { name: 'Yiruma', path: 'musics/Stress/yiruma.mp3' }
    ],
    happy: [
        { name: 'Balam', path: 'musics/Happy/balam.mp3' },
        { name: 'Elgar', path: 'musics/Happy/elgar.mp3' },
        { name: 'Queen', path: 'musics/Happy/queen.mp3' },
        { name: 'Scott', path: 'musics/Happy/scott.mp3' },
        { name: 'Coldplay', path: 'musics/Happy/coldplay.mp3' }
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
    const sadScore = answers[0];
    const anxiousScore = answers[1];
    const immediateMoodScore = answers[2];
    const calmnessScore = answers[3];
    const energyScore = answers[4];
    const sleepQualityScore = answers[5];
    const irritabilityScore = answers[6];
    const interestScore = answers[7];
    const stressScore = answers[8];
    const isolationScore = answers[9];

    if (sadScore >= 4 && energyScore <= 2 && interestScore <= 2) return 'depressed';
    if (anxiousScore >= 3 && calmnessScore <= 2 && stressScore >= 4) return 'stressed';
    if (sadScore >= 3 && irritabilityScore >= 3) return 'sad';
    if (immediateMoodScore >= 4 && calmnessScore >= 4) return 'happy';
    return 'calm';
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
                <br>   <br>
                <p>Here is a music track to boost your mood</p>
                <br>   <br>
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


initializeApp();
