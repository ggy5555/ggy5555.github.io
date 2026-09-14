"use strict";
(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-primary-nav]");
  var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var root = document.documentElement;
  var themeKey = "neuro-archive-theme";
  var themeMedia = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function storedTheme() {
    try {
      var value = localStorage.getItem(themeKey);
      return value === "light" || value === "dark" ? value : "";
    } catch (error) {
      return "";
    }
  }

  function updateThemeControl(theme) {
    var control = document.querySelector("[data-theme-toggle]");
    if (!control) return;
    var dark = theme === "dark";
    control.setAttribute("aria-pressed", String(dark));
    control.setAttribute("aria-label", dark ? "밝은 모드로 전환" : "어두운 모드로 전환");
    control.title = dark ? "밝은 모드로 전환" : "어두운 모드로 전환";
    var icon = control.querySelector(".theme-toggle-icon");
    var label = control.querySelector(".theme-toggle-label");
    if (icon) icon.textContent = dark ? "☀" : "☾";
    if (label) label.textContent = dark ? "라이트" : "다크";
  }

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    updateThemeControl(theme);
    var themeColor = document.querySelector("meta[name='theme-color']");
    if (!themeColor) {
      themeColor = document.createElement("meta");
      themeColor.name = "theme-color";
      document.head.appendChild(themeColor);
    }
    themeColor.content = theme === "dark" ? "#111628" : "#fff9fc";
    if (persist) {
      try { localStorage.setItem(themeKey, theme); } catch (error) { /* localStorage가 막혀도 전환은 유지 */ }
    }
  }

  applyTheme(storedTheme() || (themeMedia && themeMedia.matches ? "dark" : "light"), false);

  if (header) {
    var themeToggle = document.createElement("button");
    themeToggle.type = "button";
    themeToggle.className = "theme-toggle";
    themeToggle.dataset.themeToggle = "";
    themeToggle.setAttribute("aria-pressed", "false");
    var themeIcon = document.createElement("span");
    themeIcon.className = "theme-toggle-icon";
    themeIcon.setAttribute("aria-hidden", "true");
    var themeLabel = document.createElement("span");
    themeLabel.className = "theme-toggle-label";
    themeToggle.append(themeIcon, themeLabel);
    if (nav && nav.parentNode) nav.parentNode.insertBefore(themeToggle, nav.nextSibling);
    else header.querySelector(".header-inner").appendChild(themeToggle);
    updateThemeControl(root.dataset.theme);
    themeToggle.addEventListener("click", function () {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
  }

  if (themeMedia) {
    var followSystemTheme = function (event) {
      if (!storedTheme()) applyTheme(event.matches ? "dark" : "light", false);
    };
    if (themeMedia.addEventListener) themeMedia.addEventListener("change", followSystemTheme);
    else if (themeMedia.addListener) themeMedia.addListener(followSystemTheme);
  }

  document.querySelectorAll(".nav-list a").forEach(function (link) {
    var target = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
    var aliases = {
      "frontal.html": "brainmap.html",
      "parietal.html": "brainmap.html",
      "temporal.html": "brainmap.html",
      "occipital.html": "brainmap.html",
      "cerebellum.html": "brainmap.html",
      "record-editor.html": "research-archive.html",
      "references.html": ""
    };
    var active = current === target || aliases[current] === target;
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.dataset.open = String(open);
    document.body.classList.toggle("menu-open", open);
    var label = toggle.querySelector(".sr-only");
    if (label) label.textContent = open ? "메뉴 닫기" : "메뉴 열기";
  }
  function closeMenu() { setMenu(false); }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setMenu(open);
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") { closeMenu(); toggle.focus(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  document.querySelectorAll("[data-current-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  document.querySelectorAll("[data-random-concept]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var targets = [
        "basic-neuroscience.html#signal",
        "neuroanatomy.html#ventricles",
        "sensory-cognition.html#vision",
        "movement-behavior.html#sleep",
        "brain-development.html#plasticity",
        "research-tech.html#eeg"
      ];
      location.href = targets[Math.floor(Math.random() * targets.length)];
    });
  });

  Promise.all([
    fetch("data/search-index.json").then(function (r) { if (!r.ok) throw new Error(); return r.json(); }),
    fetch("data/research-records.json").then(function (r) { if (!r.ok) throw new Error(); return r.json(); }),
    fetch("data/quiz-questions.json").then(function (r) { if (!r.ok) return []; return r.json(); }).catch(function () { return []; })
  ]).then(function (sets) {
    var pages = new Set(sets[0].map(function (item) { return item.url.split("#")[0]; }));
    var publicRecords = sets[1].filter(function (item) { return item.public === true; });
    var values = {
      pages: pages.size,
      records: publicRecords.length,
      questions: sets[2].length
    };
    Object.keys(values).forEach(function (key) {
      document.querySelectorAll("[data-count='" + key + "']").forEach(function (node) {
        node.textContent = String(values[key]);
      });
    });
  }).catch(function () {
    document.querySelectorAll("[data-count]").forEach(function (node) { node.textContent = "—"; });
  });

  if (header && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    });
    var sentinel = document.createElement("span");
    sentinel.setAttribute("aria-hidden", "true");
    document.body.prepend(sentinel);
    observer.observe(sentinel);
  }
})();
