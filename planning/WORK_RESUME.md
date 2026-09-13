# WORK RESUME — NEURO ARCHIVE 인수인계

- 마지막 갱신: 2026-09-13
- Repository: `ggy5555/ggy5555.github.io`
- Branch: `main`
- 프로젝트: 1학기 CA `NEURO ARCHIVE`
- 승인 상태: 사용자가 2026-09-13 구현·검증·커밋·배포를 명시적으로 승인함
- 다른 학기 프로젝트: 이 저장소와 사이트 콘텐츠에 혼합 금지

## 1. 프로젝트 목적

뇌과학을 기초 신호 → 신경해부 → 감각·인지 → 운동·행동 → 발달 → 질환 → 연구기술 순서로 학습하고, 뇌맵·검색·퀴즈로 복습하며, 유리프 AR·EEG 연구와 CA 사이트 개발 과정을 사실 기반으로 기록하는 정적 GitHub Pages 사이트다.

## 2. PDF 8개 검토 상태

| 자료 | PDF 쪽수 | 확인 상태 | 구현 시 주의 |
|---|---:|---|---|
| 신경해부학(서종모 교수) 강의자료 | 31 | 전체 텍스트·단원 흐름 확인 | 그림 작은 레이블은 별도 대조 필요 |
| 신경과학(민병경 교수) 강의자료 | 123 | 전체 텍스트·주제 전환 확인 | 도식·시기 의존 수치 재검증 |
| Brain Facts | 71 | 전체 목차·18개 장 범위 확인 | 질환 통계 최신 검증 |
| Neuroscience: The Science of the Brain | 60 | 전체 목차·20개 장 범위 확인 | 2003년 역사적 설명 구분 |
| 뇌질환(장원석 교수) 강의자료 | 39 | 전체 텍스트·질환 범위 확인 | 낙인·단일전달물질·통계 교정 |
| 뇌캠프 part 1 | 43 | 전체 텍스트·심화 범위 확인 | 고정 세포 수·10:1 비율 금지 |
| 뇌캠프 part 2 | 73 | 전체 텍스트·해부·발달 범위 확인 | 삼위일체뇌의 문자적 사용 금지 |
| 뇌캠프 part 4 | 46 | 전체 텍스트·인지 범위 확인 | 기출 문항 복제 금지 |

총 486쪽이다. 분석의 정확한 한계는 `PDF_ANALYSIS_CHECKPOINT.md`를 따른다.

## 3. 완료한 구현

- canonical 페이지 18개 전부 생성·연결
- 기존 `basic-neuroscience.html`의 8개 주요 섹션 보존
- 공통 남색·파란색 디자인, sticky header, active 메뉴, 모바일 햄버거, focus 표시
- 홈의 가상 수치·좋아요·댓글 제거 및 JSON 기반 실제 카운트·최근 기록
- 뇌맵의 형태 변형 제거, 수평 viewport-clamped tooltip, 키보드·터치 지원
- 5개 뇌영역 상세 페이지
- 7개 학습 영역과 핵심/자세히/올림피아드 심화, 오해·용어·자가점검·참고자료
- 유리프 연구 아카이브와 CA 개발일지
- localStorage 기록 편집기, 수정·삭제 확인, JSON import/export, 두 종류 텍스트 복사, 입력 오류 처리
- 검색 색인 80항목
- 객관식·참거짓·경로 순서 45문항, 즉시 해설, 오답 재도전, localStorage 진도
- references 데이터와 저작권·개인정보·과학 검수 원칙
- 기존 5개 주소 redirect와 404 안내 페이지
- `.nojekyll` 및 공식 GitHub Pages 정적 배포 워크플로(배포 전 검증기 실행)

## 4. 정적 검증 결과

- 필수 파일 누락: 0
- 내부 링크·앵커 오류: 0
- JSON 파싱 오류: 0
- JavaScript 6개 구문 오류: 0
- 검색 URL/anchor 오류: 0
- 퀴즈 정답 인덱스·설명·관련 링크 오류: 0
- 가상 홈 수치·좋아요·댓글: 0
- 뇌맵 CSS의 translate/scale/rotate: 0
- PDF 원본 커밋: 0
- 공개 사이트 코드의 다른 프로젝트 내용: 0
- GitHub Actions 실행 `34738602601`: 검증·설정·업로드·Pages 배포 전 단계 성공
- 검증 배포 SHA: `4bf87b938234ea7f003aead9f097e6bc89fc26ab`

검증기는 `scripts/validate-site.mjs`이며 Node.js 18 이상에서 `node scripts/validate-site.mjs`로 실행한다.

## 5. 이번 커밋 체인

- `569b5ad72954` — `refactor: unify navigation and shared site structure`
- `0abe43e73fec` — `fix: stabilize accessible brain map interactions`
- `70351f0e4ae3` — `feat: add neuroscience learning sections and lobe guides`
- `9470784d5b3e` — `feat: add research archive and local record editor`
- `b1228c5a6ce9` — `feat: add searchable concepts and 45-question quiz`
- `83df3fa10518` — `docs: add references and project validation guide`
- `288a77573d40` — `fix: finalize accessibility and implementation checkpoint`
- `4bf87b938234` — `ci: add static GitHub Pages deployment`

위 커밋까지 `main`에 fast-forward 반영됐고, 공식 Pages 워크플로의 첫 복구 실행이 성공했다. 이 문서는 배포 결과를 보존하는 후속 체크포인트다.

## 6. 아직 완료하지 못한 검수

이 세션의 로컬 exec-server 연결이 실패해 실제 브라우저 자동화·콘솔·스크린샷 검사를 실행하지 못했다. 다음 항목은 정적 코드 검사를 통과했지만 실제 브라우저에서 한 번 더 확인해야 한다.

1. 360·768·1024·1440px 화면
2. 모바일 햄버거와 focus 이동
3. 뇌맵 hover·focus·Enter·Space·두 번 터치
4. 툴팁의 네 모서리 viewport clipping
5. 퀴즈 새로고침 복구·오답 재도전·초기화
6. 기록 저장·수정·삭제·잘못된 JSON·내보내기 파일·클립보드
7. 검색 결과 이동
8. 모든 페이지의 실제 브라우저 콘솔 오류와 공개 URL의 개별 경로 HTTP 404

GitHub Actions의 정적 검증과 Pages 배포 단계는 성공했다. 다만 이 세션의 외부 HTTP 브라우저가 없어 `https://ggy5555.github.io/`의 렌더링 화면 자체는 직접 열지 못했다.

## 7. 절대로 하지 말 것

- PDF 원본·그림·표·기출문항을 저장소에 올리거나 복제하지 말 것
- 실제로 없는 연구 결과·통계·좋아요·댓글을 만들지 말 것
- 참가자 이름·연락처·동의서·민감 EEG 원자료를 공개하지 말 것
- 전달물질–감정 1:1, 좌뇌·우뇌 성격론, 고정 10:1 교세포 비율, 문자 그대로의 삼위일체뇌를 쓰지 말 것
- 정신질환을 낙인적으로 쓰거나 교육 페이지를 개인 진단처럼 만들지 말 것
- 다른 학기 CA 프로젝트의 코드·문서를 섞지 말 것
- `basic-neuroscience.html`을 검토 없이 전면 덮어쓰지 말 것
- force push, destructive reset, 기존 사용자 기록 삭제를 하지 말 것

## 8. 다음 세션의 정확한 시작 지점

1. `git fetch origin main` 후 현재 브랜치와 `git status` 확인
2. `node scripts/validate-site.mjs` 실행
3. `python -m http.server 8000`으로 로컬 서버 실행
4. 브라우저 자동화 또는 수동 검사로 위 8개 미검수 항목 확인
5. 발견한 문제만 최소 수정하고 별도 `fix:` 커밋
6. `planning/WORK_RESUME.md`에 실제 화면 검사 결과와 최종 SHA 추가

사이트 구현은 이미 명시적으로 승인됐다. 다음 작업자는 계획 승인 질문으로 되돌아가지 말고, 남은 실제 브라우저 검증과 오류 수정부터 시작한다.
