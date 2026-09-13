# NEURO ARCHIVE

1학기 CA 프로젝트용 웹 기반 뇌과학 학습·탐구 아카이브입니다.

- 배포: https://ggy5555.github.io/
- 기술: 빌드 과정 없는 HTML, CSS, JavaScript
- 범위: 기초 신경과학, 신경해부학, 감각·인지, 운동·행동, 뇌 발달, 뇌질환, 연구·기술
- 도구: 인터랙티브 뇌맵, 검색, 45문항 퀴즈, 로컬 기록 편집기
- 기록: 유리프 AR·EEG 연구기록과 CA 사이트 개발일지

## 중요한 경계

이 저장소는 NEURO ARCHIVE 전용입니다. 다른 학기 CA 프로젝트의 코드나 내용은 포함하지 않습니다.

제공된 PDF 8개는 저작권과 용량 문제로 저장소에 포함하지 않았습니다. 사이트 내용은 자료의 개념 범위를 바탕으로 새로 서술했으며, 오래되거나 단순화된 설명은 `references.html`의 원칙에 따라 검수했습니다.

## 로컬 확인

정적 서버로 실행해야 JSON 검색·퀴즈·기록 데이터가 정상적으로 로드됩니다.

```bash
python -m http.server 8000
```

그 뒤 `http://localhost:8000/`을 엽니다.

정적 링크·앵커·JSON·퀴즈 데이터 검사는 Node.js 18 이상에서 다음처럼 실행합니다.

```bash
node scripts/validate-site.mjs
```

## 기록 편집기

`record-editor.html`의 저장 내용은 현재 브라우저의 `localStorage`에만 남습니다. 공개하려면 JSON을 내보내 개인정보를 검토한 뒤 `data/research-records.json`에 수동 반영해야 합니다. 피험자 이름, 연락처, 동의서와 민감한 EEG 원자료는 공개 저장소에 올리지 않습니다.
