"use strict";
(function () {
  var form=document.querySelector("[data-record-form]");
  if(!form)return;
  var storageKey="neuroArchive.records.v1";
  var list=document.querySelector("[data-saved-records]");
  var preview=document.querySelector("[data-record-preview]");
  var errorBox=document.querySelector("[data-editor-error]");
  var editingId=null;
  var records=[];
  var loadError="";

  function uid(){
    return window.crypto&&crypto.randomUUID?crypto.randomUUID():"record-"+Date.now()+"-"+Math.random().toString(16).slice(2);
  }
  function lines(value){
    return String(value||"").split(/\r?\n/).map(function(item){return item.trim();}).filter(Boolean);
  }
  function validRecord(record){
    return Boolean(record&&typeof record==="object"&&["eureka","ca"].includes(record.type)&&typeof record.title==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(record.date||""));
  }
  function normalizeRecord(record){
    return Object.assign({
      id:uid(),status:"계획",stage:"",goal:"",actualWork:"",changes:"",difficulties:"",
      solution:"",decisions:"",aiUsage:"",evidenceLinks:[],nextGoal:"",references:[],public:false
    },record,{
      evidenceLinks:Array.isArray(record.evidenceLinks)?record.evidenceLinks:[],
      references:Array.isArray(record.references)?record.references:[]
    });
  }
  function showError(message){errorBox.textContent=message;errorBox.hidden=false;}
  function clearError(){errorBox.textContent="";errorBox.hidden=true;}
  function safeLoad(){
    try{
      var parsed=JSON.parse(localStorage.getItem(storageKey)||"[]");
      if(!Array.isArray(parsed))throw new Error("저장 데이터가 배열이 아닙니다.");
      var valid=parsed.filter(validRecord).map(normalizeRecord);
      if(valid.length!==parsed.length)loadError="형식이 맞지 않는 일부 로컬 기록은 표시하지 않았습니다. 백업 JSON을 확인하세요.";
      return valid;
    }catch(error){
      loadError="브라우저 저장 데이터를 읽지 못했습니다. 내보낸 백업이 있다면 가져오기를 사용하세요.";
      return [];
    }
  }
  function persist(){
    try{localStorage.setItem(storageKey,JSON.stringify(records));return true;}
    catch(error){showError("저장 공간이 부족하거나 브라우저 저장이 차단되어 기록을 저장하지 못했습니다.");return false;}
  }
  function readForm(){
    var fd=new FormData(form);
    return {
      id:editingId||uid(),type:String(fd.get("type")||"eureka"),date:String(fd.get("date")||""),
      title:String(fd.get("title")||"").trim(),stage:String(fd.get("stage")||"").trim(),
      status:String(fd.get("status")||"계획").trim(),goal:String(fd.get("goal")||"").trim(),
      actualWork:String(fd.get("actualWork")||"").trim(),changes:String(fd.get("changes")||"").trim(),
      difficulties:String(fd.get("difficulties")||"").trim(),solution:String(fd.get("solution")||"").trim(),
      decisions:String(fd.get("decisions")||"").trim(),aiUsage:String(fd.get("aiUsage")||"").trim(),
      evidenceLinks:lines(fd.get("evidenceLinks")),nextGoal:String(fd.get("nextGoal")||"").trim(),
      references:lines(fd.get("references")),public:fd.get("public")==="on",updatedAt:new Date().toISOString()
    };
  }
  function validate(record){
    if(!record.date)return "날짜를 입력하세요.";
    if(!record.title)return "제목을 입력하세요.";
    if(!record.stage)return "단계를 입력하세요.";
    if(!record.actualWork)return "실제 수행 내용을 입력하세요. 수행 전이라면 ‘아직 수행 전’이라고 사실대로 적으세요.";
    var invalid=record.evidenceLinks.find(function(value){
      try{var url=new URL(value);return !["http:","https:"].includes(url.protocol);}catch(error){return true;}
    });
    return invalid?"증거 링크는 http 또는 https로 시작하는 URL이어야 합니다: "+invalid:"";
  }
  function textBlock(record,mode){
    var label=record.type==="eureka"?"유리프 연구기록":"CA 사이트 개발일지";
    return [
      label,"날짜: "+record.date,"제목: "+record.title,"단계/상태: "+record.stage+" / "+record.status,
      "",mode==="ca"?"1. 오늘의 목표":"1. 핵심 질문·목표",record.goal||"[미작성]",
      "",mode==="ca"?"2. 오늘 구현·수정한 것":"2. 실제 수행 내용",record.actualWork||"[미작성]",
      "","3. 변경 사항과 이유",record.changes||"[미작성]",
      "","4. 어려웠던 점",record.difficulties||"[미작성]",
      "","5. 해결 과정",record.solution||"[미작성]",
      "","6. 결정 사항",record.decisions||"[미작성]",
      "","7. AI 사용 목적·검토",record.aiUsage||"[사용하지 않음 또는 미작성]",
      "","8. 증거",record.evidenceLinks.length?record.evidenceLinks.join("\n"):"[미작성]",
      "","9. 다음 목표",record.nextGoal||"[미작성]",
      "","10. 참고 자료",record.references.length?record.references.join("\n"):"[미작성]"
    ].join("\n");
  }
  function updatePreview(){preview.textContent=textBlock(readForm(),form.elements.type.value==="ca"?"ca":"eureka");}
  function resetForm(preserveError){
    editingId=null;
    form.reset();
    form.elements.date.value=new Date().toISOString().slice(0,10);
    form.querySelector("[type='submit']").textContent="브라우저에 저장";
    document.querySelector("[data-cancel-edit]").hidden=true;
    if(!preserveError)clearError();
    updatePreview();
  }
  function fill(record){
    editingId=record.id;
    Object.keys(record).forEach(function(key){
      var field=form.elements[key];if(!field)return;
      if(field.type==="checkbox")field.checked=Boolean(record[key]);
      else if(Array.isArray(record[key]))field.value=record[key].join("\n");
      else field.value=record[key]||"";
    });
    form.querySelector("[type='submit']").textContent="수정 저장";
    document.querySelector("[data-cancel-edit]").hidden=false;
    updatePreview();
    form.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function render(){
    while(list.firstChild)list.removeChild(list.firstChild);
    if(!records.length){
      var empty=document.createElement("p");empty.className="empty-state";empty.textContent="이 브라우저에 저장된 기록이 없습니다.";list.appendChild(empty);return;
    }
    records.slice().sort(function(a,b){return b.date.localeCompare(a.date);}).forEach(function(record){
      var card=document.createElement("article");card.className="research-card";
      var meta=document.createElement("p");meta.className="text-small text-muted";meta.textContent=record.date+" · "+(record.type==="eureka"?"유리프":"CA")+" · "+record.status;
      var title=document.createElement("h3");title.textContent=record.title;
      var body=document.createElement("p");body.textContent=record.actualWork;
      var buttons=document.createElement("div");buttons.className="button-row";
      var edit=document.createElement("button");edit.type="button";edit.className="btn secondary";edit.textContent="수정";edit.addEventListener("click",function(){fill(record);});
      var del=document.createElement("button");del.type="button";del.className="btn danger";del.textContent="삭제";del.addEventListener("click",function(){
        if(!confirm("‘"+record.title+"’ 기록을 이 브라우저에서 삭제할까요? 내보내지 않은 기록은 복구할 수 없습니다."))return;
        records=records.filter(function(item){return item.id!==record.id;});
        if(persist()){render();if(editingId===record.id)resetForm(false);}
      });
      buttons.append(edit,del);card.append(meta,title,body,buttons);list.appendChild(card);
    });
  }
  async function copy(mode){
    clearError();
    var record=readForm(),message=validate(record);
    if(message){showError(message);return;}
    try{
      await navigator.clipboard.writeText(textBlock(record,mode));
      showError((mode==="ca"?"CA 제출용":"유리프 기록용")+" 텍스트를 복사했습니다.");
      errorBox.className="callout success";
    }catch(error){
      errorBox.className="callout caution";
      showError("클립보드 복사가 차단됐습니다. 미리보기 텍스트를 직접 선택해 복사하세요.");
    }
  }

  form.addEventListener("input",updatePreview);
  form.addEventListener("submit",function(event){
    event.preventDefault();errorBox.className="callout caution";clearError();
    var record=readForm(),message=validate(record);
    if(message){showError(message);return;}
    var index=records.findIndex(function(item){return item.id===record.id;});
    if(index>=0)records[index]=record;else records.push(record);
    if(persist()){render();resetForm(false);}
  });
  document.querySelector("[data-cancel-edit]").addEventListener("click",function(){resetForm(false);});
  document.querySelector("[data-reset-form]").addEventListener("click",function(){resetForm(false);});
  document.querySelector("[data-export]").addEventListener("click",function(){
    var blob=new Blob([JSON.stringify(records,null,2)],{type:"application/json"});
    var link=document.createElement("a");link.href=URL.createObjectURL(blob);
    link.download="neuro-archive-local-records-"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(link);link.click();link.remove();
    setTimeout(function(){URL.revokeObjectURL(link.href);},1000);
  });
  document.querySelector("[data-import]").addEventListener("change",function(event){
    var input=event.currentTarget,file=input.files&&input.files[0];if(!file)return;
    file.text().then(function(text){
      var parsed;
      try{parsed=JSON.parse(text);}catch(error){throw new Error("JSON 문법 오류: "+error.message);}
      if(!Array.isArray(parsed)||!parsed.every(validRecord))throw new Error("올바른 기록 배열이 아닙니다. type, date, title 필드를 확인하세요.");
      var normalized=parsed.map(normalizeRecord);
      if(document.querySelector("[data-import-mode]").value==="replace"){
        if(!confirm("현재 브라우저 기록을 가져온 파일로 교체할까요? 먼저 내보내기를 권장합니다."))return;
        records=normalized;
      }else{
        var map=new Map(records.map(function(item){return[item.id,item];}));
        normalized.forEach(function(item){map.set(item.id,item);});
        records=Array.from(map.values());
      }
      if(persist()){render();clearError();}
    }).catch(function(error){errorBox.className="callout caution";showError(error.message||"JSON을 가져오지 못했습니다.");})
      .finally(function(){input.value="";});
  });
  document.querySelector("[data-copy-eureka]").addEventListener("click",function(){copy("eureka");});
  document.querySelector("[data-copy-ca]").addEventListener("click",function(){copy("ca");});

  records=safeLoad();
  render();
  resetForm(Boolean(loadError));
  if(loadError)showError(loadError);
  var requestedType=new URLSearchParams(location.search).get("type");
  if(["eureka","ca"].includes(requestedType)){form.elements.type.value=requestedType;updatePreview();}
})();