"use strict";
(function () {
  var targets = document.querySelectorAll("[data-research-records]");
  if (!targets.length) return;
  var detailTarget = document.querySelector("[data-record-detail]");
  var filter = document.querySelector("[data-record-filter]");

  function makeCard(record) {
    var article = document.createElement("article");
    article.className = "research-card";
    var meta = document.createElement("div");
    meta.className = "button-row";
    var stage = document.createElement("span");
    stage.className = "category-badge";
    stage.textContent = record.stage;
    var status = document.createElement("span");
    var statusClass = record.status === "확정" ? "status-done" : record.status === "검토" ? "status-review" : "status-plan";
    status.className = "status-badge " + statusClass;
    status.textContent = record.status;
    meta.append(stage, status);
    var date = document.createElement("time");
    date.dateTime = record.date;
    date.className = "text-muted text-small";
    date.textContent = record.date;
    var title = document.createElement("h3");
    title.textContent = record.title;
    var summary = document.createElement("p");
    summary.textContent = record.actualWork;
    var link = document.createElement("a");
    link.href = "research-archive.html#record-" + record.id;
    link.textContent = "자세히 보기 →";
    link.dataset.recordId = record.id;
    article.append(meta, date, title, summary, link);
    return article;
  }

  function render(records) {
    targets.forEach(function (target) {
      while (target.firstChild) target.removeChild(target.firstChild);
      var limit = Number(target.dataset.limit || records.length);
      var type = target.dataset.type || "all";
      var selected = records.filter(function (record) {
        return record.public === true && (type === "all" || record.type === type);
      }).sort(function (a,b) { return b.date.localeCompare(a.date); }).slice(0,limit);
      if (!selected.length) {
        var empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "공개 기록이 아직 없습니다.";
        target.appendChild(empty);
      } else selected.forEach(function (record) { target.appendChild(makeCard(record)); });
    });
  }

  fetch("data/research-records.json").then(function (response) {
    if (!response.ok) throw new Error();
    return response.json();
  }).then(function (records) {
    render(records);
    if (filter) {
      filter.addEventListener("change", function () {
        targets.forEach(function (target) { target.dataset.type = filter.value; });
        render(records);
      });
    }
    var id = location.hash.replace("#record-", "");
    var record = records.find(function (item) { return item.id === id && item.public === true; });
    if (detailTarget && record) {
      detailTarget.id = "record-" + record.id;
      detailTarget.hidden = false;
      detailTarget.querySelector("[data-detail-title]").textContent = record.title;
      detailTarget.querySelector("[data-detail-body]").textContent = record.actualWork;
      detailTarget.querySelector("[data-detail-next]").textContent = record.nextGoal || "다음 목표 미정";
      requestAnimationFrame(function () { detailTarget.scrollIntoView({block:"start"}); });
    }
  }).catch(function () {
    targets.forEach(function (target) {
      target.innerHTML = '<p class="empty-state">기록 데이터를 불러오지 못했습니다.</p>';
    });
  });
})();