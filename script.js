// ステージ情報
const stages = [
    { question: "鍵をさす→座席の調整→ルームミラーの調整→シートベルトを締める→パーキングか確認→ハンドブレーキを引く→ブレーキを踏む→エンジンをONにする→サイドミラーを調整する", answer: ["鍵をさす", "座席の調整", "ルームミラーの調整", "シートベルトを締める", "パーキングか確認", "ハンドブレーキを引く", "ブレーキを踏む", "エンジンをONにする", "サイドミラーを調整する"] },
    { question: "ルームミラーを確認する→右のミラーを確認する→合図を出す→ドライブに入れる→左側を目視確認→ハンドブレーキを下ろす→ルームミラーを確認する→右のミラーを確認する→右側を目視で確認する→ブレーキから足を離す", answer: ["ルームミラーを確認する", "右のミラーを確認する", "合図を出す", "ドライブに入れる", "左側を目視確認", "ハンドブレーキを下ろす", "ルームミラーを確認する", "右のミラーを確認する", "右側を目視で確認する", "ブレーキから足を離す"] },
    { question: "ハンドブレーキを引く→パーキングに入れる→エンジンを止める→ブレーキから足を離す", answer: ["ハンドブレーキを引く", "パーキングに入れる", "エンジンを止める", "ブレーキから足を離す"] }
];

let currentStage = 0;
let score = 0;
let userAnswers = [];

// DOM要素
const choicesElement = document.getElementById("choices");
const answerArea = document.getElementById("answer-area");
const result = document.getElementById("result");
const stageNumber = document.getElementById("stage-number");
const scoreDisplay = document.getElementById("score");
const resetButton = document.getElementById("reset");
const resultPage = document.getElementById("result-page");
const startPage = document.getElementById("start-page");
const gamePage = document.getElementById("game-page");
const stageSubtitle = document.getElementById("stage-subtitle");
const resetResultButton = document.getElementById("reset-result");
const startButton = document.getElementById("start-btn");
const feedbackImage = document.getElementById("feedback-image");

// 丸バツの表示処理
function showFeedbackImage(src) {
    feedbackImage.src = src;
    feedbackImage.style.display = "block";
    setTimeout(() => {
        feedbackImage.style.display = "none";
    }, 1200);
}


// シャッフル関数
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


// クリックで移動するための関数
function handleClick(event) {
    const clickedItem = event.target;

    if (clickedItem.tagName === 'LI') {
        const isInChoices = clickedItem.parentElement === choicesElement;
        const targetList = isInChoices ? answerArea : choicesElement;
        targetList.appendChild(clickedItem);
    }
}

choicesElement.addEventListener("click", handleClick);
answerArea.addEventListener("click", handleClick);

Sortable.create(choicesElement, {
    group: "shared",
    animation: 150,
    sort: false
});

Sortable.create(answerArea, {
    group: "shared",
    animation: 150
});



// ステージの読み込み
function loadStage() {
    result.textContent = "";
    stageNumber.textContent = currentStage + 1;

    if (currentStage === 0) {
        stageSubtitle.textContent = "「乗車手順」";
    } else if (currentStage === 1) {
        stageSubtitle.textContent = "「発進手順」";
    } else {
        stageSubtitle.textContent = "「停車手順」";
    }

    choicesElement.innerHTML = "";
    answerArea.innerHTML = "";

    const stage = stages[currentStage];
    const shuffledChoices = shuffle(stage.answer);

    shuffledChoices.forEach(choice => {
        const li = document.createElement("li");
        li.textContent = choice;
        choicesElement.appendChild(li);
    });



    // クリックイベントリスナーを追加
    choicesElement.addEventListener("click", handleClick);
    answerArea.addEventListener("click", handleClick);

    // ドラッグ＆ドロップのセットアップはそのまま
    Sortable.create(choicesElement, {
        group: "shared",
        animation: 150,
        sort: false
    });

    Sortable.create(answerArea, {
        group: "shared",
        animation: 150
    });

    updateScoreDisplay();
    resetButton.style.display = "none";
}

// スコア更新
function updateScoreDisplay() {
    scoreDisplay.textContent = `スコア: ${score}`;
}

// 回答確認
document.getElementById("submit").addEventListener("click", () => {
    const userAnswer = Array.from(answerArea.children).map(li => li.textContent);
    const correctAnswer = stages[currentStage].answer;

    if (choicesElement.children.length !== 0) {
        result.textContent = "すべての選択肢を解答欄に並べてください";
        result.style.color = "red";
        return;
    }

    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
    userAnswers.push(userAnswer);

    if (isCorrect) {
        result.textContent = "正解！";
        result.style.color = "red";
        score++;
        showFeedbackImage("images/correct.png");
    } else {
        result.textContent = "不正解！";
        result.style.color = "blue";
        showFeedbackImage("images/wrong.png");
    }


    updateScoreDisplay();

    setTimeout(() => {
        currentStage++;
        if (currentStage < stages.length) {
            loadStage();
        } else {
            showResultPage();
        }
    }, 1500);
});

// 結果画面表示
function showResultPage() {
    resultPage.style.display = "block";
    gamePage.style.display = "none";

    const resultContainer = document.getElementById("result-details");
    resultContainer.innerHTML = "";

    stages.forEach((stage, i) => {
        const user = userAnswers[i];
        const correct = stage.answer;

        const title = document.createElement("h3");
        title.textContent = stageSubtitleText(i);
        resultContainer.appendChild(title);

        const table = document.createElement("table");
        table.innerHTML = "<tr><th>あなたの回答</th><th></th><th>正しい手順</th></tr>";

        for (let j = 0; j < correct.length; j++) {
            const tr = document.createElement("tr");
            const userAnswer = user[j] || "";
            const correctAnswer = correct[j] || "";
            const mark = userAnswer === correctAnswer
                ? "🔴"
                : "<span style='color: blue;'>✖</span>";
            tr.innerHTML = `<td>${userAnswer}</td><td>${mark}</td><td>${correctAnswer}</td>`;
            table.appendChild(tr);
        }

        resultContainer.appendChild(table);
    });

    document.getElementById("final-score").textContent = `${score} / ${stages.length}`;
}

// ステージ名取得
function stageSubtitleText(index) {
    if (index === 0) return "「乗車手順」";
    if (index === 1) return "「発進手順」";
    return "「停車手順」";
}

// ゲームリセット
function resetGame() {
    currentStage = 0;
    score = 0;
    userAnswers = [];
    scoreDisplay.textContent = "スコア: 0";
    result.textContent = "";
    resultPage.style.display = "none";
    gamePage.style.display = "block";
    loadStage();
}

// スタートボタン（loadStage呼び出し追加）
startButton.addEventListener("click", () => {
    startPage.style.display = "none";
    gamePage.style.display = "block";
    loadStage(); // ← これで最初の問題が表示される
});

// 「もう一度遊ぶ」ボタン（start画面だけ表示に修正）
resetResultButton.addEventListener("click", () => {
    resultPage.style.display = "none";
    startPage.style.display = "block";
    gamePage.style.display = "none"; // ← gamePageを隠す

    // 状態の初期化（ゲーム開始はまだなのでloadStageしない）
    currentStage = 0;
    score = 0;
    userAnswers = [];
    scoreDisplay.textContent = "スコア: 0";
    result.textContent = "";
});

