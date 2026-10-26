// LBNCC — interactions
(function () {
  "use strict";

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
  }
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // Logo spin
  document.querySelectorAll(".logo img").forEach((img) => {
    img.addEventListener("mouseenter", () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      img.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 900, easing: "cubic-bezier(.65,0,.25,1)" });
    });
  });

  // ---------- Free Test Quiz ----------
  const quizData = [
    { q: "Which subject is most important for B.Sc Nursing entrance?", opts: ["Physics", "Chemistry", "Biology", "Mathematics"], ans: 2 },
    { q: "Normal body temperature (°C) is approximately:", opts: ["36.0", "37.0", "38.0", "39.0"], ans: 1 },
    { q: "The full form of AIIMS is:", opts: ["All India Institute of Medical Sciences", "All India Institute of Medical Services", "Advanced Institute of Medical Sciences", "All Indian Institute of Medical Sciences"], ans: 0 },
    { q: "Which vitamin is produced in skin on sunlight exposure?", opts: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], ans: 2 },
    { q: "Hemoglobin is found in:", opts: ["Plasma", "Red Blood Cells", "White Blood Cells", "Platelets"], ans: 1 },
    { q: "The largest organ of human body is:", opts: ["Liver", "Brain", "Skin", "Heart"], ans: 2 },
    { q: "UPCNET stands for:", opts: ["UP Common Nursing Entrance Test", "UP Central Nursing Entrance Test", "UP Combined Nursing Entrance Test", "UP College Nursing Entrance Test"], ans: 0 },
    { q: "Normal blood pH is:", opts: ["7.0", "7.35-7.45", "7.5-7.6", "6.8-7.0"], ans: 1 },
    { q: "Which is the functional unit of kidney?", opts: ["Neuron", "Nephron", "Alveolus", "Neuroglia"], ans: 1 },
    { q: "Insulin is secreted by:", opts: ["Liver", "Pancreas", "Thyroid", "Adrenal"], ans: 1 }
  ];

  const quizRoot = document.getElementById("quiz");
  if (quizRoot) {
    let current = 0;
    let answers = new Array(quizData.length).fill(null);
    let submitted = false;

    function renderQuestion() {
      const q = quizData[current];
      quizRoot.innerHTML = `
        <div class="quiz">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <span class="badge">Question ${current + 1} / ${quizData.length}</span>
            <span class="lead" style="margin:0;">Score: ${answers.filter((a, i) => a === quizData[i].ans).length}</span>
          </div>
          <div class="quiz-q">${q.q}</div>
          <div class="quiz-opts">
            ${q.opts.map((o, i) => `<div class="quiz-opt ${answers[current] === i ? "selected" : ""}" data-opt="${i}">${String.fromCharCode(65 + i)}. ${o}</div>`).join("")}
          </div>
          <div class="quiz-nav">
            <button class="btn btn--ghost" type="button" id="prevBtn" ${current === 0 ? "disabled" : ""}>← Prev</button>
            ${current === quizData.length - 1
              ? '<button class="btn btn--primary" type="button" id="submitBtn">Submit Test</button>'
              : '<button class="btn btn--primary" type="button" id="nextBtn">Next →</button>'}
          </div>
        </div>
      `;
      quizRoot.querySelectorAll(".quiz-opt").forEach((el) => {
        el.addEventListener("click", () => {
          if (submitted) return;
          answers[current] = parseInt(el.dataset.opt, 10);
          renderQuestion();
        });
      });
      const prev = quizRoot.querySelector("#prevBtn");
      if (prev) prev.addEventListener("click", () => { if (current > 0) { current--; renderQuestion(); } });
      const next = quizRoot.querySelector("#nextBtn");
      if (next) next.addEventListener("click", () => { if (current < quizData.length - 1) { current++; renderQuestion(); } });
      const submit = quizRoot.querySelector("#submitBtn");
      if (submit) submit.addEventListener("click", submitTest);
    }

    function submitTest() {
      submitted = true;
      const score = answers.filter((a, i) => a === quizData[i].ans).length;
      const pct = Math.round((score / quizData.length) * 100);
      quizRoot.innerHTML = `
        <div class="quiz">
          <div class="quiz-result">
            <div class="score">${score} / ${quizData.length}</div>
            <p class="lead">You scored ${pct}%</p>
            <p>${pct >= 70 ? "Excellent! Keep it up." : pct >= 40 ? "Good effort. Practice more to improve." : "Needs improvement. Keep practicing!"}</p>
            <div style="display:grid;gap:.6rem;margin-top:1.5rem;">
              ${quizData.map((q, i) => `
                <div style="text-align:left;padding:.6rem;border-radius:8px;background:${answers[i] === q.ans ? "#e6f2e8" : "#fdecea"};">
                  <strong>Q${i + 1}.</strong> ${q.q}<br>
                  <small>Your answer: ${answers[i] === null ? "Not answered" : q.opts[answers[i]]} ${answers[i] === q.ans ? "✓" : "✗ (Correct: " + q.opts[q.ans] + ")"}</small>
                </div>
              `).join("")}
            </div>
            <button class="btn btn--primary mt-2" type="button" id="retryBtn">Retry Test</button>
          </div>
        </div>
      `;
      const retry = quizRoot.querySelector("#retryBtn");
      if (retry) retry.addEventListener("click", () => {
        current = 0; answers = new Array(quizData.length).fill(null); submitted = false; renderQuestion();
      });
    }

    renderQuestion();
  }

  // Contact form demo
  const form = document.querySelector("form[data-demo]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const msg = form.querySelector(".form-success");
      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.textContent = "Send Message"; }
        if (msg) { msg.hidden = false; form.reset(); }
      }, 900);
    });
  }

  // Footer year
  document.querySelectorAll(".yr").forEach((e) => (e.textContent = new Date().getFullYear()));
})();
