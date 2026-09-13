"use strict";
(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-primary-nav]");
  var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".nav-list a").forEach(function (link) {
    var target = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
    var aliases = {
      "brainmap.html": "neuroanatomy.html",
      "frontal.html": "neuroanatomy.html",
      "parietal.html": "neuroanatomy.html",
      "temporal.html": "neuroanatomy.html",
      "occipital.html": "neuroanatomy.html",
      "cerebellum.html": "neuroanatomy.html",
      "record-editor.html": "research-archive.html",
      "references.html": ""
    };
    var active = current === target || aliases[current] === target;
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    nav.dataset.open = "false";
    document.body.classList.remove("menu-open");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.dataset.open = String(open);
      document.body.classList.toggle("menu-open", open);
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

  if (header) {
    var observer = new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    });
    var sentinel = document.createElement("span");
    sentinel.setAttribute("aria-hidden", "true");
    document.body.prepend(sentinel);
    observer.observe(sentinel);
  }
})();