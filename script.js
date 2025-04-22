// Quiz soruları
const questions = [
    {
        question: "Proje İşini İzleme ve Kontrol (Monitor and Control Project Work) sürecinin temel çıktısı nedir?",
        options: {
            A: "Proje tüzüğü (Project Charter)",
            B: "İş performans raporları (Work Performance Reports)",
            C: "Kapsam bildirimi (Scope Statement)",
            D: "Sorun kaydı (Issue Log)"
        },
        correctAnswer: "B",
        explanation: "İş performans raporları, paydaşların kullanımı için proje performans verilerini özetler."
    },
    {
        question: "Proje tüzüğünün temel amacı nedir?",
        options: {
            A: "Proje programını detaylandırmak",
            B: "Projeyi resmi olarak onaylamak ve proje yöneticisine yetki vermek",
            C: "Proje bütçesini ana hatlarıyla belirtmek",
            D: "Proje risklerini tanımlamak"
        },
        correctAnswer: "B",
        explanation: "Proje tüzüğü, bir projenin varlığını resmi olarak onaylar ve proje yöneticisine organizasyon kaynaklarını proje aktivitelerine tahsis etme yetkisi verir."
    },
    {
        question: "Aşağıdakilerden hangisi Proje Tüzüğü Oluşturma sürecinin girdisidir?",
        options: {
            A: "İş Kırılım Yapısı (WBS)",
            B: "Paydaş kaydı",
            C: "İş gerekçesi (Business case)",
            D: "Değişiklik kaydı"
        },
        correctAnswer: "C",
        explanation: "İş gerekçesi, projenin gerekli yatırıma değer olup olmadığını belirlemek için iş perspektifinden gerekli bilgileri sağlar."
    }
];

// Oyun durumu
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let hasAnswered = false;

// DOM elementleri
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const resultElement = document.getElementById('result');
const explanationElement = document.getElementById('explanation');
const nextButton = document.getElementById('next-btn');
const scoreElement = document.getElementById('score');
const progressElement = document.getElementById('progress');

// Quiz'i başlat
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    showQuestion();
}

// Soruyu göster
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    
    questionElement.innerHTML = currentQuestion.question;
    
    // Seçenekleri oluştur
    for (const [key, value] of Object.entries(currentQuestion.options)) {
        const button = document.createElement('div');
        button.classList.add('option');
        button.innerHTML = `<strong>${key})</strong> ${value}`;
        button.dataset.option = key;
        button.addEventListener('click', () => selectAnswer(key));
        optionsElement.appendChild(button);
    }
    
    // İlerleme durumunu göster
    progressElement.textContent = `Soru ${questionNo}/${questions.length}`;
}

// Durumu sıfırla
function resetState() {
    hasAnswered = false;
    selectedAnswer = null;
    nextButton.style.display = 'none';
    explanationElement.style.display = 'none';
    explanationElement.textContent = '';
    resultElement.textContent = '';
    
    while (optionsElement.firstChild) {
        optionsElement.removeChild(optionsElement.firstChild);
    }
}

// Cevap seçildiğinde
function selectAnswer(selectedKey) {
    if (hasAnswered) return;
    
    hasAnswered = true;
    selectedAnswer = selectedKey;
    const currentQuestion = questions[currentQuestionIndex];
    
    // Tüm seçenekleri devre dışı bırak
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.style.cursor = 'default';
        option.removeEventListener('click', selectAnswer);
    });
    
    // Seçilen cevabı işaretle
    const selectedOption = document.querySelector(`.option[data-option="${selectedKey}"]`);
    selectedOption.classList.add('selected');
    
    // Doğru cevabı işaretle
    const correctOption = document.querySelector(`.option[data-option="${currentQuestion.correctAnswer}"]`);
    correctOption.classList.add('correct');
    
    // Sonucu değerlendir
    if (selectedKey === currentQuestion.correctAnswer) {
        score += 5;
        resultElement.textContent = "DOĞRU! +5 Puan";
        resultElement.style.color = "#155724";
    } else {
        score -= 3;
        resultElement.textContent = "YANLIŞ! -3 Puan";
        resultElement.style.color = "#721c24";
        selectedOption.classList.add('incorrect');
        
        // İkinci deneme için event listener ekle
        allOptions.forEach(option => {
            if (!option.classList.contains('selected')) {
                option.style.cursor = 'pointer';
                option.addEventListener('click', () => retryAnswer(option.dataset.option));
            }
        });
    }
    
    // Açıklamayı göster
    explanationElement.textContent = currentQuestion.explanation;
    explanationElement.style.display = 'block';
    
    // Puanı güncelle
    updateScore();
    
    // Sonraki soru butonunu göster (eğer son soru değilse)
    if (currentQuestionIndex < questions.length - 1) {
        nextButton.style.display = 'inline-block';
    } else {
        nextButton.textContent = 'Quiz Tamamlandı';
        nextButton.style.display = 'inline-block';
        nextButton.addEventListener('click', showFinalResults);
    }
}

// İkinci deneme için
function retryAnswer(selectedKey) {
    if (hasAnswered) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = document.querySelector(`.option[data-option="${selectedKey}"]`);
    
    if (selectedKey === currentQuestion.correctAnswer) {
        score += 3;
        resultElement.textContent = "DOĞRU! +3 Puan (2. Deneme)";
        resultElement.style.color = "#155724";
        selectedOption.classList.add('correct');
    } else {
        score -= 10;
        resultElement.textContent = "Yine YANLIŞ! -10 Puan";
        resultElement.style.color = "#721c24";
        selectedOption.classList.add('incorrect');
    }
    
    hasAnswered = true;
    updateScore();
    
    // Tüm seçenekleri devre dışı bırak
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.style.cursor = 'default';
        option.removeEventListener('click', retryAnswer);
    });
    
    // Sonraki soru butonunu göster
    if (currentQuestionIndex < questions.length - 1) {
        nextButton.style.display = 'inline-block';
    } else {
        nextButton.textContent = 'Quiz Tamamlandı';
        nextButton.style.display = 'inline-block';
        nextButton.addEventListener('click', showFinalResults);
    }
}

// Sonraki soruya geç
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    }
}

// Puanı güncelle
function updateScore() {
    scoreElement.textContent = `Puan: ${score}`;
}

// Final sonuçlarını göster
function showFinalResults() {
    resetState();
    questionElement.textContent = "Quiz Tamamlandı!";
    resultElement.textContent = `Toplam Puan: ${score}`;
    resultElement.style.fontSize = "1.5em";
    resultElement.style.color = "#2c3e50";
    
    // Yeniden başlat butonu ekle
    nextButton.textContent = 'Yeniden Başlat';
    nextButton.style.display = 'inline-block';
    nextButton.removeEventListener('click', showFinalResults);
    nextButton.addEventListener('click', startQuiz);
}

// Event listeners
nextButton.addEventListener('click', nextQuestion);

// Quiz'i