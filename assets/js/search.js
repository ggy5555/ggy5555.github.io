"use strict";
(function () {
  var containers = document.querySelectorAll("[data-search-results]");
  var forms = document.querySelectorAll("[data-site-search]");
  if (!forms.length) return;

  var indexPromise = fetch("data/search-index.json").then(function (response) {
    if (!response.ok) throw new Error("검색 색인을 불러오지 못했습니다.");
    return response.json();
  });

  function normalize(value) {
    return String(value || "").toLocaleLowerCase("ko-KR").replace(/\s+/g, " ").trim();
  }
  function score(item, terms) {
    var title = normalize(item.title);
    var haystack = normalize([
      item.title, item.category, item.summary,
      (item.keywords || []).join(" "),
      (item.aliases || []).join(" ")
    ].join(" "));
    return terms.reduce(function (sum, term) {
      if (!haystack.includes(term)) return -1000;
      return sum + (title.includes(term) ? 5 : 1);
    }, 0);
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function render(query, data) {
    var q = normalize(query);
    containers.forEach(function (container) {
      clear(container);
      if (!q) {
        var prompt = document.createElement("p");
        prompt.className = "empty-state";
        prompt.textContent = "검색어를 입력하면 페이지와 정확한 단원 링크를 보여 줍니다.";
        container.appendChild(prompt);
        return;
      }
      var terms = q.split(" ").filter(Boolean);
      var results = data.map(function (item) {
        return { item: item, score: score(item, terms) };
      }).filter(function (entry) { return entry.score >= 0; })
        .sort(function (a, b) { return b.score - a.score || a.item.title.localeCompare(b.item.title, "ko"); })
        .slice(0, 30);
      if (!results.length) {
        var empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "‘" + query + "’에 해당하는 결과가 없습니다. 다른 한글·영문 용어를 시도해 보세요.";
        container.appendChild(empty);
        return;
      }
      var count = document.createElement("p");
      count.className = "text-muted text-small";
      count.textContent = results.length + "개의 결과";
      container.appendChild(count);
      results.forEach(function (entry) {
        var item = entry.item;
        var link = document.createElement("a");
        link.className = "search-result";
        link.href = item.url;
        var badge = document.createElement("span");
        badge.className = "category-badge";
        badge.textContent = item.category;
        var title = document.createElement("h3");
        title.textContent = item.title;
        var summary = document.createElement("p");
        summary.textContent = item.summary;
        link.append(badge, title, summary);
        container.appendChild(link);
      });
    });
  }

  forms.forEach(function (form) {
    var input = form.querySelector("input[type='search']");
    if (!input) return;
    form.addEventListener("submit", function (event) {
      var onHome = !!document.querySelector("[data-search-results]");
      if (!onHome) return;
      event.preventDefault();
      var query = input.value.trim();
      var url = new URL(location.href);
      if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
      url.hash = "search";
      history.replaceState({}, "", url);
      indexPromise.then(function (data) {
        render(query, data);
        document.querySelector("#search").scrollIntoView({behavior:"smooth"});
      }).catch(function () {
        containers.forEach(function (node) { node.textContent = "검색 데이터를 불러오지 못했습니다."; });
      });
    });
  });

  var initial = new URLSearchParams(location.search).get("q") || "";
  if (initial && containers.length) {
    forms.forEach(function (form) {
      var input = form.querySelector("input[type='search']");
      if (input) input.value = initial;
    });
  }
  if (containers.length) {
    indexPromise.then(function (data) { render(initial, data); })
      .catch(function () { containers.forEach(function (node) { node.textContent = "검색 데이터를 불러오지 못했습니다."; }); });
  }
})();