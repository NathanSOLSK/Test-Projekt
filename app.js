const api = 'https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple';

const box = document.getElementById('questions-container');
const btn = document.getElementById('submit-btn');
const moneyBox = document.getElementById('score-box');
const restartBtn = document.getElementById('restart-btn');
const halfBtn = document.getElementById('half-btn');

let list = [];
let index = 0;
let cash = 0;
let locked = false;
let visible = false; 
let halfUsed = false;
let timer;
let timeLeft = 7;

// koľko sa pridá za správnu odpoveď
let reward = 50;

//document.getElementById('progress-box').innerText = `Otázka ${index+1}/${list.length}`;

fetch(api)
    .then(r => r.json())
    .then(data => {
        list = data.results;
        show();
    });

btn.addEventListener('click', () => {
    if (!locked) {
        checkAnswer();
    } else {
        nextQuestion();
    }
});

function restartButton() { 
    let elem = document.getElementById('restart-btn');
    if (!visible) {
        elem.style.display = "none";
    } else {
        elem.style.display = "block";
    }
    restartBtn.addEventListener('click', restart);
}


function useHalf() {
    
    if (halfUsed) return;
    halfUsed = true;
    const correct = list[index].correct_answer;
    const all = Array.from(document.querySelectorAll('.answer'));
    let wrongAnswers = [];
    all.forEach(el => {
        const val = el.querySelector('input').value;
        if (val !== correct) {
            wrongAnswers.push(el);
        }
    })
    wrongAnswers.sort(() => Math.random() - 0.5);
    let toHide = wrongAnswers.slice(0, 2);
    toHide.forEach(el => 
    {
        el.style.display = "none";
   
});
    halfBtn.style.display = "none";

}


function show() {
    const q = list[index];

    // odpovede v náhodnom poradí
    const opts = [q.correct_answer, ...q.incorrect_answers];
    opts.sort(() => Math.random() - 0.5);

    let html = `<h2>${q.question}</h2>`;
    opts.forEach(a => {
        html += `
            <label class="answer">
                <input type="radio" name="q" value="${a}">
                ${a}
            </label>
        `;
    });

    box.innerHTML = html;
    locked = false;
    btn.innerText = "Submit";

    // reset odpovedí, aby sa znova zobrazili
setTimeout(() => {
    document.querySelectorAll('.answer').forEach(a => {
        a.style.display = "block";
    });
}, 0);
    startTimer();
}

function checkAnswer() {
    clearInterval(timer);
    const pick = document.querySelector('input[name="q"]:checked');
    if (!pick) {
        alert("Vyber odpoveď!");
        return;
    }

    locked = true;

    const correct = list[index].correct_answer;
    const all = document.querySelectorAll('.answer');

    all.forEach(el => {
        const val = el.querySelector('input').value;

        if (val === correct) {
            el.classList.add('correct');
        }

        if (pick.value === val && val !== correct) {
            el.classList.add('wrong');
        }
    });

    if (pick.value === correct) {
        reward *= 3;
        cash += reward;
    } else {
        cash += 0;
    }

    moneyBox.innerText = `Počet peňazí: ${cash} €`;
    btn.innerText = "Next";
}

function nextQuestion() {
    index++;

    if (index < list.length) {
        show();
    } else {
        finish();
    }
}

function finish() {
    clearInterval(timer);
    box.innerHTML = `
        <h2>Koniec hry!</h2>
        <p>Vyhral si: <strong>${cash} €</strong></p>
    `;
    btn.style.display = "none";
    restartBtn.innerHTML = "ZNOVA";
    visible = true;
    halfBtn.style.display = "none";
    restartButton();
}

function restart() {
    
        list = [];
        index = 0;
        cash = 0;
        reward = 50;
        locked = false;
        visible = false;
        halfUsed = false;
    
        moneyBox.innerText = `Počet peňazí: ${cash} €`;
        btn.style.display = "inline-block";
        btn.innerText = "Submit";
        restartBtn.style.display = "none";
        halfBtn.style.display = "block";
        halfBtn.disabled = false;
    
        clearInterval(timer);
        timeLeft = 7;
        document.getElementById('timer-box').innerText = "";
    
        fetch(api)
            .then(r => r.json())
            .then(data => {
                list = data.results;
                show();
            });
    }
    



function startTimer () {
    clearInterval(timer);
    timeLeft = 7;
    document.getElementById('timer-box').innerText = `Čas: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-box').innerText = `Čas: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
    }  
   }, 1000);
}

restartButton();






