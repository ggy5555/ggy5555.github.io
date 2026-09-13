"use strict";
(function () {
  var stage = document.querySelector("[data-brain-stage]");
  var tooltip = document.querySelector("[data-brain-tooltip]");
  var mobileTitle = document.querySelector("[data-mobile-brain-title]");
  var mobileText = document.querySelector("[data-mobile-brain-text]");
  var mobileLink = document.querySelector("[data-mobile-brain-link]");
  if (!stage || !tooltip) return;
  var lobes = Array.prototype.slice.call(stage.querySelectorAll("[data-brain-lobe]"));
  var active = null;

  function setTooltipContent(lobe) {
    tooltip.querySelector(".en").textContent = lobe.dataset.nameEn;
    tooltip.querySelector(".ko").textContent = lobe.dataset.nameKo;
    tooltip.querySelector("p").textContent = lobe.dataset.description;
    if (mobileTitle) mobileTitle.textContent = lobe.dataset.nameEn + " · " + lobe.dataset.nameKo;
    if (mobileText) mobileText.textContent = lobe.dataset.description;
    if (mobileLink) {
      mobileLink.href = lobe.href;
      mobileLink.textContent = lobe.dataset.nameKo + " 상세 페이지 →";
    }
  }
  function placeTooltip(lobe) {
    var rect = lobe.getBoundingClientRect();
    var width = Math.min(300, window.innerWidth - 16);
    var left = Math.max(8, Math.min(window.innerWidth - width - 8, rect.left + rect.width / 2 - width / 2));
    var provisionalTop = rect.top - tooltip.offsetHeight - 12;
    var top = provisionalTop < 8 ? Math.min(window.innerHeight - tooltip.offsetHeight - 8, rect.bottom + 12) : provisionalTop;
    tooltip.style.width = width + "px";
    tooltip.style.left = left + "px";
    tooltip.style.top = Math.max(8, top) + "px";
  }
  function show(lobe, sticky) {
    if (active && active !== lobe) active.dataset.active = "false";
    active = lobe;
    lobe.dataset.active = sticky ? "true" : lobe.dataset.active;
    setTooltipContent(lobe);
    tooltip.dataset.visible = "true";
    requestAnimationFrame(function () { placeTooltip(lobe); });
  }
  function hide(lobe) {
    if (lobe.dataset.active === "true") return;
    tooltip.dataset.visible = "false";
  }
  lobes.forEach(function (lobe) {
    lobe.addEventListener("mouseenter", function () { show(lobe, false); });
    lobe.addEventListener("mousemove", function () { placeTooltip(lobe); });
    lobe.addEventListener("mouseleave", function () { hide(lobe); });
    lobe.addEventListener("focus", function () { show(lobe, false); });
    lobe.addEventListener("blur", function () { hide(lobe); });
    lobe.addEventListener("click", function (event) {
      if (window.matchMedia("(hover: none)").matches && lobe.dataset.active !== "true") {
        event.preventDefault();
        lobes.forEach(function (item) { item.dataset.active = "false"; });
        lobe.dataset.active = "true";
        show(lobe, true);
      }
    });
    lobe.addEventListener("keydown", function (event) {
      if (event.key === " ") {
        event.preventDefault();
        location.href = lobe.href;
      }
    });
  });
  document.addEventListener("pointerdown", function (event) {
    if (!event.target.closest("[data-brain-lobe]") && active) {
      active.dataset.active = "false";
      tooltip.dataset.visible = "false";
    }
  });
  window.addEventListener("resize", function () { if (active) placeTooltip(active); });
})();