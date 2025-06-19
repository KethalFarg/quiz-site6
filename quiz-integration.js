(async function () {
    const ANSWERS_KEY = 'quizAnswers';
    const QUIZ_KEY = 'quizData';

    // Load JSON once and store in sessionStorage
    async function loadQuizData() {
        if (sessionStorage.getItem(QUIZ_KEY)) {
            return JSON.parse(sessionStorage.getItem(QUIZ_KEY));
        }
        const res = await fetch('quiz-data.json');
        const data = await res.json();
        sessionStorage.setItem(QUIZ_KEY, JSON.stringify(data));
        return data;
    }

    const quizData = await loadQuizData();
    let userAnswers = JSON.parse(localStorage.getItem(ANSWERS_KEY) || '{}');

    // Save answer
    function saveAnswer(name, value) {
        userAnswers[name] = value;
        localStorage.setItem(ANSWERS_KEY, JSON.stringify(userAnswers));
    }

    // Event listener for all data-buttons
    document.querySelectorAll('[data-name][data-value]').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const value = button.getAttribute('data-value');
            saveAnswer(name, value);

            // Optional: visual feedback
            button.classList.add('selected');
            setTimeout(() => goToNextSlide(), 400);
        });
    });

    // Navigate to next slide
    function goToNextSlide() {
        const currentFile = window.location.pathname.split('/').pop();
        const currentSlide = quizData.slides.find(s => s.id === currentFile);

        if (!currentSlide || !currentSlide.next) {
            console.warn('No next slide found. End of flow?');
            return;
        }

        window.location.href = currentSlide.next;
    }
})();
