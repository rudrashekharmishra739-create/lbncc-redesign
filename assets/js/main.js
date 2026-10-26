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

  // ---------- Depth Carousel (Top Performers) ----------
  const carouselRoot = document.getElementById("performers-carousel");
  if (carouselRoot) {
    const stage = document.getElementById("performers-stage");
    const studentData = Array.from({ length: 20 }, (_, i) => ({
      image: "https://placehold.co/400x500/8b1a1a/ffffff?text=Placeholder+" + (i + 1),
      alt: "Placeholder " + (i + 1)
    }));
    const n = studentData.length;
    const cardW = 250, cardH = 330, depth = 180, spread = 70, tilt = 18, visibleCards = 4, falloff = 0.2, blurMax = 5;
    const dir = 1; // right

    const cards = studentData.map((item, i) => {
      const card = document.createElement("div");
      card.className = "depth-carousel__card";
      card.style.width = cardW + "px";
      card.style.height = cardH + "px";
      card.style.borderRadius = "18px";
      card.innerHTML = `<img class="depth-carousel__img" src="${item.image}" alt="${item.alt}" draggable="false"><span class="depth-carousel__tint"></span><div class="depth-carousel__label">${item.alt}</div>`;
      stage.appendChild(card);
      const tint = card.querySelector(".depth-carousel__tint");
      return { el: card, tint };
    });

    let pos = 0; // current float position
    let focus = 0;
    let animating = false;
    let targetPos = 0;

    function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

    function layout(p) {
      for (let i = 0; i < n; i++) {
        const card = cards[i];
        let d = i - p;
        // loop normalize
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
        const back = Math.max(0, d);
        const az = Math.abs(d);
        const shown = az <= visibleCards + 0.5;
        const tz = -depth * d;
        const tx = dir * spread * d;
        const ry = dir * tilt * clamp(d, 0, 1);
        let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
        if (!shown) opacity = 0;
        const brightness = Math.max(0.15, 1 - back * falloff);
        const blurPx = blurMax > 0 ? Math.min(blurMax, (back / Math.max(1, visibleCards)) * blurMax) : 0;
        const zi = Math.round(2000 - d * 20);
        const sc = 1;
        card.el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
        card.el.style.opacity = opacity.toFixed(3);
        card.el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
        card.el.style.zIndex = String(zi);
        card.el.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";
        if (card.tint) card.tint.style.opacity = clamp(back * falloff * 1.25, 0, 0.86).toFixed(3);
      }
    }

    function animateTo(target, dur) {
      const start = pos;
      const startTime = performance.now();
      const duration = dur || 700;
      function step(now) {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        pos = start + (target - start) * eased;
        layout(pos);
        if (t < 1) requestAnimationFrame(step);
        else {
          pos = target;
          // normalize
          pos = ((pos % n) + n) % n;
          layout(pos);
          animating = false;
        }
      }
      animating = true;
      requestAnimationFrame(step);
    }

    function setFocus(rawIndex) {
      let idx = ((rawIndex % n) + n) % n;
      let delta = idx - pos;
      delta = ((delta % n) + n) % n;
      if (delta > n / 2) delta -= n;
      animateTo(pos + delta, 700);
      if (idx !== focus) { focus = idx; }
    }

    function navigateBy(step) { setFocus(focus + step); }

    // Build controls
    const prevBtn = document.createElement("button");
    prevBtn.className = "depth-carousel__arrow depth-carousel__arrow--prev";
    prevBtn.setAttribute("aria-label", "Previous");
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const nextBtn = document.createElement("button");
    nextBtn.className = "depth-carousel__arrow depth-carousel__arrow--next";
    nextBtn.setAttribute("aria-label", "Next");
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    carouselRoot.appendChild(prevBtn);
    carouselRoot.appendChild(nextBtn);

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "depth-carousel__dots";
    const dots = studentData.map((_, i) => {
      const d = document.createElement("button");
      d.className = "depth-carousel__dot";
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", () => setFocus(i));
      dotsWrap.appendChild(d);
      return d;
    });
    carouselRoot.appendChild(dotsWrap);

    function updateDots() {
      dots.forEach((d, i) => d.classList.toggle("is-active", i === Math.round(((pos % n) + n) % n)));
    }

    // wrap setFocus to update dots
    const origSetFocus = setFocus;
    // override via closure: call updateDots after animation completes (in animateTo finally)
    // We'll patch animateTo's completion by adding updateDots in layout loop? Instead update dots in a rAF loop.
    function dotLoop() {
      updateDots();
      requestAnimationFrame(dotLoop);
    }
    dotLoop();

    prevBtn.addEventListener("click", () => navigateBy(-1));
    nextBtn.addEventListener("click", () => navigateBy(1));

    // drag
    let drag = null;
    carouselRoot.addEventListener("pointerdown", (e) => {
      drag = { x: e.clientX, startPos: pos, moved: false, id: e.pointerId };
    });
    window.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; carouselRoot.setPointerCapture(drag.id); }
      if (!drag.moved) return;
      const stepPx = Math.max(cardW * 0.55, 40);
      pos = drag.startPos - dx / stepPx;
      layout(pos);
    });
    window.addEventListener("pointerup", () => {
      if (!drag) return;
      if (drag.moved) setFocus(Math.round(pos));
      drag = null;
    });

    // autoplay
    let autoTimer = null;
    function startAuto() {
      autoTimer = setInterval(() => { if (!drag) navigateBy(1); }, 3200);
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    carouselRoot.addEventListener("mouseenter", stopAuto);
    carouselRoot.addEventListener("mouseleave", startAuto);
    startAuto();

    // init
    layout(0);
    updateDots();
  }
})();
