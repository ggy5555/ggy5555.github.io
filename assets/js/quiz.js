"use strict";
(function(){
  var root=document.querySelector("[data-quiz-app]");if(!root)return;
  var category=document.querySelector("[data-quiz-category]");
  var difficulty=document.querySelector("[data-quiz-difficulty]");
  var countSelect=document.querySelector("[data-quiz-count]");
  var startButton=document.querySelector("[data-quiz-start]");
  var questionBox=document.querySelector("[data-question-box]");
  var setup=document.querySelector("[data-quiz-setup]");
  var promptNode=document.querySelector("[data-question-prompt]");
  var typeNode=document.querySelector("[data-question-type]");
  var optionsNode=document.querySelector("[data-question-options]");
  var feedback=document.querySelector("[data-question-feedback]");
  var nextButton=document.querySelector("[data-quiz-next]");
  var progressText=document.querySelector("[data-progress-text]");
  var progressBar=document.querySelector("[data-progress-bar]");
  var resultBox=document.querySelector("[data-quiz-result]");
  var resultText=document.querySelector("[data-result-text]");
  var retryButton=document.querySelector("[data-retry-wrong]");
  var lifetime=document.querySelector("[data-lifetime-progress]");
  var sessionKey="neuroArchive.quizSession.v1";
  var progressKey="neuroArchive.quizProgress.v1";
  var questions=[];var state=null;

  function shuffle(array){
    var out=array.slice();
    for(var i=out.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=out[i];out[i]=out[j];out[j]=t;}
    return out;
  }
  function loadProgress(){
    try{return JSON.parse(localStorage.getItem(progressKey)||'{"attempts":0,"correct":0,"answered":0,"wrongIds":[]}');}
    catch(e){return{attempts:0,correct:0,answered:0,wrongIds:[]};}
  }
  function saveProgress(value){try{localStorage.setItem(progressKey,JSON.stringify(value));}catch(e){}renderLifetime();}
  function renderLifetime(){
    var p=loadProgress();
    lifetime.textContent="누적 "+p.attempts+"회 · "+p.answered+"문항 응답 · "+p.correct+"문항 정답";
  }
  function saveSession(){
    if(!state)return;
    try{localStorage.setItem(sessionKey,JSON.stringify({
      ids:state.pool.map(function(q){return q.id;}),index:state.index,score:state.score,wrong:state.wrong,
      answered:state.answered,selected:state.selected
    }));}catch(e){}
  }
  function clearSession(){localStorage.removeItem(sessionKey);}
  function showQuestion(){
    setup.hidden=true;resultBox.hidden=true;questionBox.hidden=false;
    var current=state.pool[state.index];
    progressText.textContent=(state.index+1)+" / "+state.pool.length;
    var progressValue=Math.round((state.index/state.pool.length)*100);
    progressBar.style.width=progressValue+"%";
    progressBar.parentElement.setAttribute("aria-valuenow",String(progressValue));
    typeNode.textContent=current.type==="truefalse"?"참·거짓":current.type==="sequence"?"경로 순서":"객관식";
    promptNode.textContent=current.prompt;
    while(optionsNode.firstChild)optionsNode.removeChild(optionsNode.firstChild);
    current.options.forEach(function(option,index){
      var button=document.createElement("button");button.type="button";button.className="quiz-option";
      button.textContent=String.fromCharCode(65+index)+". "+option;
      button.addEventListener("click",function(){answer(index);});
      optionsNode.appendChild(button);
    });
    feedback.hidden=true;feedback.textContent="";nextButton.hidden=true;
    if(state.answered)applyAnswerState(current,state.selected,false);
    saveSession();
  }
  function answer(index){
    if(state.answered)return;
    state.answered=true;state.selected=index;
    var current=state.pool[state.index];
    var correct=index===current.answer;
    if(correct)state.score++;else if(!state.wrong.includes(current.id))state.wrong.push(current.id);
    var p=loadProgress();p.answered++;if(correct)p.correct++;p.wrongIds=Array.from(new Set((p.wrongIds||[]).concat(correct?[]:[current.id])));
    if(correct)p.wrongIds=p.wrongIds.filter(function(id){return id!==current.id;});
    saveProgress(p);applyAnswerState(current,index,true);saveSession();
  }
  function applyAnswerState(current,selected,focus){
    var buttons=optionsNode.querySelectorAll("button");
    buttons.forEach(function(button,index){button.disabled=true;if(index===current.answer)button.classList.add("correct");if(index===selected&&index!==current.answer)button.classList.add("incorrect");});
    feedback.hidden=false;
    while(feedback.firstChild)feedback.removeChild(feedback.firstChild);
    var heading=document.createElement("strong");heading.textContent=selected===current.answer?"정답입니다.":"오답입니다.";
    var explanation=document.createElement("p");explanation.textContent=current.explanation;
    feedback.append(heading,explanation);
    if(selected!==current.answer){var wrong=document.createElement("p");wrong.textContent="오답 이유: "+current.wrong;feedback.appendChild(wrong);}
    var link=document.createElement("a");link.href=current.conceptUrl;link.textContent="관련 개념 다시 보기 →";feedback.appendChild(link);
    nextButton.hidden=false;nextButton.textContent=state.index===state.pool.length-1?"결과 보기":"다음 문제";
    if(focus)feedback.focus();
  }
  function start(pool){
    state={pool:shuffle(pool),index:0,score:0,wrong:[],answered:false,selected:null};
    var p=loadProgress();p.attempts++;saveProgress(p);showQuestion();
  }
  function selectedPool(){
    var cat=category.value;var diff=difficulty.value;
    var pool=questions.filter(function(item){return(cat==="all"||item.category===cat)&&(diff==="all"||item.difficulty===diff);});
    var count=countSelect.value==="all"?pool.length:Number(countSelect.value);
    return shuffle(pool).slice(0,Math.min(count,pool.length));
  }
  function finish(){
    clearSession();questionBox.hidden=true;resultBox.hidden=false;progressBar.style.width="100%";progressBar.parentElement.setAttribute("aria-valuenow","100");
    var total=state.pool.length;var percent=total?Math.round(state.score/total*100):0;
    resultText.textContent=state.score+" / "+total+" 정답 ("+percent+"%)";
    retryButton.hidden=state.wrong.length===0;
  }
  nextButton.addEventListener("click",function(){
    if(!state.answered)return;
    if(state.index>=state.pool.length-1){finish();return;}
    state.index++;state.answered=false;state.selected=null;showQuestion();
  });
  startButton.addEventListener("click",function(){
    var pool=selectedPool();
    if(!pool.length){alert("선택한 조건에 해당하는 문항이 없습니다.");return;}
    start(pool);
  });
  retryButton.addEventListener("click",function(){
    var pool=questions.filter(function(q){return state.wrong.includes(q.id);});
    if(pool.length)start(pool);
  });
  document.querySelector("[data-new-quiz]").addEventListener("click",function(){clearSession();state=null;resultBox.hidden=true;questionBox.hidden=true;setup.hidden=false;});
  window.addEventListener("neuro-progress-reset",function(){
    state=null;questionBox.hidden=true;resultBox.hidden=true;setup.hidden=false;renderLifetime();
  });
  fetch("data/quiz-questions.json").then(function(r){if(!r.ok)throw new Error();return r.json();}).then(function(data){
    questions=data;renderLifetime();
    var query=new URLSearchParams(location.search).get("category");
    if(query&&Array.from(category.options).some(function(o){return o.value===query;}))category.value=query;
    var saved;
    try{saved=JSON.parse(localStorage.getItem(sessionKey)||"null");}catch(e){saved=null;}
    if(saved&&Array.isArray(saved.ids)){
      var pool=saved.ids.map(function(id){return questions.find(function(q){return q.id===id;});}).filter(Boolean);
      if(pool.length===saved.ids.length&&saved.index<pool.length){
        state={pool:pool,index:saved.index,score:saved.score||0,wrong:saved.wrong||[],answered:Boolean(saved.answered),selected:saved.selected};
        showQuestion();
      }else clearSession();
    }
  }).catch(function(){root.innerHTML='<p class="callout caution">퀴즈 데이터를 불러오지 못했습니다. 페이지를 다시 불러오세요.</p>';});
})();
