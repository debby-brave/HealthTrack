const STORAGE_KEY = "healthtrack-data";

const defaults = {
    water: 0,
    exercise: 0,
    sleep: 0
};

let data = loadData();

const $ = (id) => document.getElementById(id);

function loadData() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return saved ? { ...defaults, ...saved } : { ...defaults };
    } catch {
        return { ...defaults };
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function updateHealth() {
    data.water = clamp(data.water, 0, 8);
    data.exercise = clamp(data.exercise, 0, 30);
    data.sleep = clamp(data.sleep, 0, 8);

    $("waterAmount").textContent = data.water;
    $("exerciseAmount").textContent = data.exercise;
    $("sleepAmount").textContent = data.sleep;

    const waterPercent = (data.water / 8) * 100;
    const exercisePercent = (data.exercise / 30) * 100;
    const sleepPercent = (data.sleep / 8) * 100;

    $("waterProgress").style.width = `${waterPercent}%`;
    $("exerciseProgress").style.width = `${exercisePercent}%`;
    $("sleepProgress").style.width = `${sleepPercent}%`;

    const score = Math.round(
        (waterPercent + exercisePercent + sleepPercent) / 3
    );

    $("healthScore").textContent = score;
    $("heroScore").textContent = `${score}%`;
    $("heroScoreLarge").textContent = score;

    document.querySelector(".hero-ring").style.background =
        `conic-gradient(var(--green) ${score}%, #dfeae5 ${score}%)`;

    let status = "Getting started";
    let title = "Build your healthy routine";
    let message = "Add water, exercise and sleep as you go through the day.";

    if (score >= 80) {
        status = "Great progress";
        title = "Your routine is on track";
        message = "You've made strong progress toward today's goals.";
    } else if (score >= 50) {
        status = "Making progress";
        title = "Keep building momentum";
        message = "You're halfway there. Keep working toward your daily goals.";
    } else if (score > 0) {
        status = "Good start";
        title = "Keep going";
        message = "Every small healthy action adds to your daily progress.";
    }

    $("statusPill").textContent = status;
    $("scoreTitle").textContent = title;
    $("scoreMessage").textContent = message;
    $("heroMessage").textContent = message;

    saveData();
}

$("waterBtn").addEventListener("click", () => {
    data.water += 1;
    updateHealth();
});

$("exerciseBtn").addEventListener("click", () => {
    data.exercise += 5;
    updateHealth();
});

$("sleepBtn").addEventListener("click", () => {
    data.sleep += 1;
    updateHealth();
});

$("resetBtn").addEventListener("click", () => {
    data = { ...defaults };
    updateHealth();
});

document.querySelector(".mobile-menu").addEventListener("click", () => {
    document.querySelector("nav").classList.toggle("open");
});

document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
        document.querySelector("nav").classList.remove("open");
    });
});

updateHealth();
