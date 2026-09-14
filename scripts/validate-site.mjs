import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const required=[
  "index.html","brainmap.html","basic-neuroscience.html","neuroanatomy.html","sensory-cognition.html",
  "movement-behavior.html","brain-development.html","brain-disorders.html","research-tech.html",
  "research-archive.html","record-editor.html","quiz.html","references.html","frontal.html","parietal.html",
  "temporal.html","occipital.html","cerebellum.html",
  "assets/css/base.css","assets/css/layout.css","assets/css/components.css","assets/css/content.css","assets/css/brainmap.css","assets/css/theme.css",
  "assets/js/site.js","assets/js/search.js","assets/js/brainmap.js","assets/js/quiz.js","assets/js/research-records.js","assets/js/record-editor.js",
  "data/search-index.json","data/quiz-questions.json","data/research-records.json","data/references.json"
];
const errors=[];
for(const file of required)if(!fs.existsSync(path.join(root,file)))errors.push("필수 파일 누락: "+file);

const htmlFiles=fs.readdirSync(root).filter(name=>name.endsWith(".html"));
const docs=new Map(htmlFiles.map(name=>[name,fs.readFileSync(path.join(root,name),"utf8")]));
function anchors(html){return new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]));}
for(const [file,html] of docs){
  const refs=[...html.matchAll(/(?:href|src)=["']([^"'#]+(?:#[^"']*)?)["']/g)].map(m=>m[1]);
  for(const ref of refs){
    if(/^(?:https?:|mailto:|tel:|data:|javascript:)/.test(ref))continue;
    const [rawTarget,hash]=ref.split("#");
    const clean=rawTarget.split("?")[0];
    const target=clean||file;
    const resolved=path.normalize(path.join(path.dirname(file),target)).replaceAll("\\","/");
    if(!fs.existsSync(path.join(root,resolved))){errors.push(file+" → 누락 경로: "+ref);continue;}
    if(hash&&resolved.endsWith(".html")){
      const targetHtml=docs.get(resolved)||fs.readFileSync(path.join(root,resolved),"utf8");
      if(!anchors(targetHtml).has(decodeURIComponent(hash)))errors.push(file+" → 누락 앵커: "+ref);
    }
  }
  if(!/<main\b/i.test(html))errors.push(file+": main 요소 누락");
  if(!/<title>[^<]+<\/title>/i.test(html))errors.push(file+": title 누락");
  if(/class=["'][^"']*site-header/.test(html)){
    if(!html.includes('href="assets/css/theme.css"'))errors.push(file+": 테마 스타일 연결 누락");
    if(!html.includes('href="brainmap.html">뇌맵</a>'))errors.push(file+": 상단 뇌맵 메뉴 누락");
  }
}
for(const json of ["data/search-index.json","data/quiz-questions.json","data/research-records.json","data/references.json"]){
  try{JSON.parse(fs.readFileSync(path.join(root,json),"utf8"));}catch(error){errors.push(json+" JSON 오류: "+error.message);}
}
const quiz=JSON.parse(fs.readFileSync(path.join(root,"data/quiz-questions.json"),"utf8"));
if(quiz.length<40||quiz.length>50)errors.push("퀴즈 문항 수가 40~50 범위가 아님: "+quiz.length);
const ids=new Set();
for(const item of quiz){
  if(ids.has(item.id))errors.push("퀴즈 ID 중복: "+item.id);ids.add(item.id);
  if(!Array.isArray(item.options)||item.options.length<2||!Number.isInteger(item.answer)||item.answer<0||item.answer>=item.options.length)errors.push("퀴즈 정답 구조 오류: "+item.id);
  if(!item.explanation||!item.wrong||!item.conceptUrl)errors.push("퀴즈 해설 필드 누락: "+item.id);
}
const search=JSON.parse(fs.readFileSync(path.join(root,"data/search-index.json"),"utf8"));
for(const item of search){
  const [target,hash]=item.url.split("#");
  if(!fs.existsSync(path.join(root,target)))errors.push("검색 경로 누락: "+item.url);
  else if(hash&&!anchors(fs.readFileSync(path.join(root,target),"utf8")).has(hash))errors.push("검색 앵커 누락: "+item.url);
}
const index=docs.get("index.html");
for(const fake of ["60+","120+","25+","♡","댓글"])if(index.includes(fake))errors.push("홈에 제거 대상 가상 수치/메타 존재: "+fake);
const mapCss=fs.readFileSync(path.join(root,"assets/css/brainmap.css"),"utf8");
if(/(?:translate|scale|rotate)\s*\(/.test(mapCss))errors.push("뇌맵 CSS에 형태 변형 transform 존재");
const themeCss=fs.readFileSync(path.join(root,"assets/css/theme.css"),"utf8");
const siteJs=fs.readFileSync(path.join(root,"assets/js/site.js"),"utf8");
if(!themeCss.includes(':root[data-theme="dark"]'))errors.push("어두운 테마 스타일 누락");
if(!/\.brain-lobe\s+\.cerebellum-shape\s*\{[^}]*display:\s*flex/s.test(themeCss))errors.push("소뇌 라벨 flex 배치 누락");
if(!siteJs.includes("neuro-archive-theme")||!siteJs.includes("dataset.themeToggle"))errors.push("테마 전환·저장 기능 누락");
const refs=JSON.parse(fs.readFileSync(path.join(root,"data/references.json"),"utf8"));
if(refs.filter(r=>r.type==="제공 PDF").length!==8)errors.push("제공 PDF 참고자료가 8개가 아님");

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("PASS: 필수 파일 "+required.length+"개");
console.log("PASS: HTML "+htmlFiles.length+"개 내부 경로·앵커");
console.log("PASS: 검색 색인 "+search.length+"개");
console.log("PASS: 퀴즈 "+quiz.length+"문항");
console.log("PASS: 제공 PDF 참고자료 8개");
