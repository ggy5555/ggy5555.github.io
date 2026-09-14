"use strict";
(function () {
  var learningKey = "neuroArchive.learningProgress.v1";
  var quizProgressKey = "neuroArchive.quizProgress.v1";
  var quizSessionKey = "neuroArchive.quizSession.v1";
  var courses = [
    { path: "basic-neuroscience.html", title: "기초 신경과학" },
    { path: "neuroanatomy.html", title: "신경해부학" },
    { path: "sensory-cognition.html", title: "감각·인지" },
    { path: "movement-behavior.html", title: "운동·행동" },
    { path: "brain-development.html", title: "뇌 발달" },
    { path: "brain-disorders.html", title: "뇌질환" },
    { path: "research-tech.html", title: "연구·기술" },
    { path: "frontal.html", title: "전두엽" },
    { path: "parietal.html", title: "두정엽" },
    { path: "temporal.html", title: "측두엽" },
    { path: "occipital.html", title: "후두엽" },
    { path: "cerebellum.html", title: "소뇌" }
  ];
  var courseByPath = {};
  courses.forEach(function (course) { courseByPath[course.path] = course; });

  var currentPath = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var pageButton = null;
  var pageStatus = null;
  var liveRegion = null;

  function emptyLearningProgress() {
    return { version: 1, completed: {}, updatedAt: null };
  }

  function loadLearningProgress() {
    try {
      var parsed = JSON.parse(localStorage.getItem(learningKey) || "null");
      if (!parsed || typeof parsed !== "object" || !parsed.completed || typeof parsed.completed !== "object") {
        return emptyLearningProgress();
      }
      return parsed;
    } catch (error) {
      return emptyLearningProgress();
    }
  }

  function saveLearningProgress(progress) {
    progress.version = 1;
    progress.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(learningKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      announce("브라우저 저장소를 사용할 수 없어 완료 표시를 저장하지 못했습니다.");
      return false;
    }
  }

  function loadQuizProgress() {
    var fallback = { attempts: 0, correct: 0, answered: 0, wrongIds: [] };
    try {
      var parsed = JSON.parse(localStorage.getItem(quizProgressKey) || "null");
      if (!parsed || typeof parsed !== "object") return fallback;
      return {
        attempts: Number.isFinite(Number(parsed.attempts)) ? Math.max(0, Number(parsed.attempts)) : 0,
        correct: Number.isFinite(Number(parsed.correct)) ? Math.max(0, Number(parsed.correct)) : 0,
        answered: Number.isFinite(Number(parsed.answered)) ? Math.max(0, Number(parsed.answered)) : 0,
        wrongIds: Array.isArray(parsed.wrongIds) ? parsed.wrongIds : []
      };
    } catch (error) {
      return fallback;
    }
  }

  function completedCount(progress) {
    return courses.filter(function (course) { return Boolean(progress.completed[course.path]); }).length;
  }

  function levelFor(count) {
    if (count === courses.length) return { name: "아카이브 완주", copy: "모든 학습 페이지를 연결했습니다. 퀴즈로 기억을 다시 꺼내 보세요." };
    if (count >= 8) return { name: "네트워크 확장", copy: "여러 영역의 개념이 하나의 지식 네트워크로 연결되고 있어요." };
    if (count >= 4) return { name: "회로 연결 중", copy: "기초 개념과 기능별 단원이 차근차근 연결되고 있어요." };
    if (count >= 1) return { name: "신호 포착", copy: "첫 학습 신호를 기록했습니다. 다음 페이지로 이어가 보세요." };
    return { name: "시냅스 준비", copy: "첫 페이지를 완료하면 학습 회로가 연결되기 시작합니다." };
  }

  function announce(message) {
    if (!liveRegion) {
      liveRegion = document.createElement("p");
      liveRegion.className = "sr-only";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = "";
    window.setTimeout(function () { liveRegion.textContent = message; }, 20);
  }

  function renderDashboard(progress) {
    var dashboard = document.querySelector("[data-learning-dashboard]");
    if (!dashboard) return;
    var count = completedCount(progress);
    var percent = Math.round((count / courses.length) * 100);
    var level = levelFor(count);
    var completedNode = dashboard.querySelector("[data-learning-completed]");
    var totalNode = dashboard.querySelector("[data-learning-total]");
    var levelNode = dashboard.querySelector("[data-learning-level]");
    var encouragementNode = dashboard.querySelector("[data-learning-encouragement]");
    var bar = dashboard.querySelector("[data-learning-progress-bar]");
    if (completedNode) completedNode.textContent = String(count);
    if (totalNode) totalNode.textContent = String(courses.length);
    if (levelNode) levelNode.textContent = level.name;
    if (encouragementNode) encouragementNode.textContent = level.copy;
    if (bar) {
      bar.style.width = percent + "%";
      if (bar.parentElement) bar.parentElement.setAttribute("aria-valuenow", String(percent));
    }

    dashboard.querySelectorAll("[data-progress-item]").forEach(function (item) {
      var path = item.getAttribute("data-progress-item");
      var done = Boolean(progress.completed[path]);
      var mark = item.querySelector(".progress-check");
      item.classList.toggle("is-complete", done);
      if (mark) mark.textContent = done ? "✓" : "○";
      if (courseByPath[path]) item.setAttribute("aria-label", courseByPath[path].title + (done ? " 학습 완료" : " 미완료"));
    });

    var quiz = loadQuizProgress();
    var attempts = dashboard.querySelector("[data-quiz-attempts]");
    var answered = dashboard.querySelector("[data-quiz-answered]");
    var accuracy = dashboard.querySelector("[data-quiz-accuracy]");
    if (attempts) attempts.textContent = String(quiz.attempts);
    if (answered) answered.textContent = String(quiz.answered);
    if (accuracy) accuracy.textContent = quiz.answered ? Math.round((quiz.correct / quiz.answered) * 100) + "%" : "—";
  }

  function renderRouteCards(progress) {
    document.querySelectorAll(".path-card").forEach(function (card) {
      var link = card.querySelector("a[href]");
      if (!link) return;
      var path = (link.getAttribute("href") || "").split("#")[0].split("?")[0];
      if (!courseByPath[path]) return;
      var done = Boolean(progress.completed[path]);
      var badge = card.querySelector(".route-complete-badge");
      card.classList.toggle("is-complete", done);
      if (done && !badge) {
        badge = document.createElement("span");
        badge.className = "route-complete-badge";
        badge.textContent = "✓ 완료";
        card.insertBefore(badge, card.firstChild);
      } else if (!done && badge) {
        badge.remove();
      }
    });
  }

  function renderPageControl(progress) {
    if (!pageButton || !courseByPath[currentPath]) return;
    var done = Boolean(progress.completed[currentPath]);
    var count = completedCount(progress);
    pageButton.setAttribute("aria-pressed", String(done));
    pageButton.textContent = done ? "✓ 학습 완료됨" : "학습 완료로 표시";
    if (pageStatus) {
      pageStatus.textContent = done
        ? "완료 기록됨 · 전체 " + count + "/" + courses.length
        : "읽기를 마쳤다면 완료 표시해 주세요 · 전체 " + count + "/" + courses.length;
    }
  }

  function renderAll() {
    var progress = loadLearningProgress();
    renderDashboard(progress);
    renderRouteCards(progress);
    renderPageControl(progress);
  }

  function mountPageControl() {
    var course = courseByPath[currentPath];
    if (!course) return;
    var insertionPoint = document.querySelector(".toc, .quick-nav");
    if (!insertionPoint || !insertionPoint.parentNode) return;

    var strip = document.createElement("section");
    strip.className = "page-progress-strip";
    strip.setAttribute("aria-label", "이 페이지 학습 진도");
    var inner = document.createElement("div");
    inner.className = "page-shell page-progress-inner";
    var copy = document.createElement("div");
    copy.className = "page-progress-copy";
    var eyebrow = document.createElement("span");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "MY PROGRESS";
    pageStatus = document.createElement("p");
    pageStatus.className = "text-small";
    pageStatus.setAttribute("aria-live", "polite");
    copy.append(eyebrow, pageStatus);
    pageButton = document.createElement("button");
    pageButton.type = "button";
    pageButton.className = "btn progress-toggle";
    pageButton.setAttribute("aria-pressed", "false");
    pageButton.addEventListener("click", function () {
      var progress = loadLearningProgress();
      var wasComplete = Boolean(progress.completed[currentPath]);
      if (wasComplete) delete progress.completed[currentPath];
      else progress.completed[currentPath] = { completedAt: new Date().toISOString() };
      if (!saveLearningProgress(progress)) return;
      renderAll();
      window.dispatchEvent(new CustomEvent("neuro-progress-change", { detail: { path: currentPath, completed: !wasComplete } }));
      announce(course.title + (wasComplete ? " 완료 표시를 해제했습니다." : " 학습을 완료로 표시했습니다."));
    });
    inner.append(copy, pageButton);
    strip.appendChild(inner);
    insertionPoint.parentNode.insertBefore(strip, insertionPoint);
  }

  function makeResetDialog() {
    var triggers = document.querySelectorAll("[data-progress-reset]");
    if (!triggers.length) return;
    var dialog = document.createElement("dialog");
    dialog.className = "progress-reset-dialog";
    dialog.innerHTML =
      '<div class="reset-dialog-card">' +
        '<span class="reset-dialog-icon" aria-hidden="true">↺</span>' +
        '<section data-reset-stage="first" aria-labelledby="reset-first-title" aria-describedby="reset-first-copy">' +
          '<span class="eyebrow">RESET · 1/2</span><h2 id="reset-first-title">학습 진도를 초기화할까요?</h2>' +
          '<p id="reset-first-copy">완료 표시와 퀴즈 누적 기록, 진행 중인 퀴즈 세션을 지웁니다. 탐구 기록과 화면 테마는 유지됩니다.</p>' +
          '<div class="button-row"><button class="btn secondary" type="button" data-reset-cancel>아니요, 유지</button><button class="btn danger-soft" type="button" data-reset-next>예, 계속</button></div>' +
        '</section>' +
        '<section data-reset-stage="final" aria-labelledby="reset-final-title" aria-describedby="reset-final-copy" hidden>' +
          '<span class="eyebrow">RESET · 2/2</span><h2 id="reset-final-title">정말 초기화할까요?</h2>' +
          '<p id="reset-final-copy"><strong>이 브라우저의 학습 진도는 복구할 수 없습니다.</strong> 그래도 초기화하려면 아래 버튼을 한 번 더 눌러 주세요.</p>' +
          '<p class="field-error" data-reset-error aria-live="assertive"></p>' +
          '<div class="button-row"><button class="btn secondary" type="button" data-reset-back>돌아가기</button><button class="btn danger" type="button" data-reset-confirm>네, 진짜 초기화</button></div>' +
        '</section>' +
      '</div>';
    document.body.appendChild(dialog);

    var first = dialog.querySelector('[data-reset-stage="first"]');
    var final = dialog.querySelector('[data-reset-stage="final"]');
    var cancel = dialog.querySelector("[data-reset-cancel]");
    var next = dialog.querySelector("[data-reset-next]");
    var back = dialog.querySelector("[data-reset-back]");
    var confirm = dialog.querySelector("[data-reset-confirm]");
    var errorNode = dialog.querySelector("[data-reset-error]");
    var opener = null;

    function showFirstStage() {
      first.hidden = false;
      final.hidden = true;
      errorNode.textContent = "";
      dialog.setAttribute("aria-labelledby", "reset-first-title");
      dialog.setAttribute("aria-describedby", "reset-first-copy");
    }

    function closeDialog() {
      if (typeof dialog.close === "function" && dialog.open) dialog.close();
      else dialog.removeAttribute("open");
      showFirstStage();
      if (opener && opener.isConnected) window.setTimeout(function () { opener.focus(); }, 0);
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        opener = trigger;
        showFirstStage();
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
        window.setTimeout(function () { cancel.focus(); }, 0);
      });
    });

    cancel.addEventListener("click", closeDialog);
    next.addEventListener("click", function () {
      first.hidden = true;
      final.hidden = false;
      dialog.setAttribute("aria-labelledby", "reset-final-title");
      dialog.setAttribute("aria-describedby", "reset-final-copy");
      back.focus();
    });
    back.addEventListener("click", function () {
      showFirstStage();
      next.focus();
    });
    confirm.addEventListener("click", function () {
      try {
        localStorage.removeItem(learningKey);
        localStorage.removeItem(quizProgressKey);
        localStorage.removeItem(quizSessionKey);
      } catch (error) {
        errorNode.textContent = "브라우저 저장소를 사용할 수 없어 초기화하지 못했습니다.";
        return;
      }
      renderAll();
      window.dispatchEvent(new CustomEvent("neuro-progress-reset"));
      announce("학습 완료 표시와 퀴즈 진도를 초기화했습니다.");
      closeDialog();
    });
    dialog.addEventListener("cancel", function () { showFirstStage(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeDialog();
    });
  }

  mountPageControl();
  makeResetDialog();
  renderAll();
  window.addEventListener("storage", function (event) {
    if (event.key === learningKey || event.key === quizProgressKey || event.key === quizSessionKey) renderAll();
  });
})();
