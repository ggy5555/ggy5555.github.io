# WORK RESUME — NEURO ARCHIVE 인수인계

- 마지막 갱신: 2026-09-14
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
- 뇌맵 팔레트 기반의 밝은 파스텔 기본 테마와 어두운 테마, sticky header, active 메뉴, 모바일 햄버거, focus 표시
- Nunito·Noto Sans KR 글꼴 체계와 localStorage 기반 밝은/어두운 모드 저장
- 모든 주 내비게이션의 독립 `뇌맵` 바로가기
- 홈의 가상 수치·좋아요·댓글 제거 및 JSON 기반 실제 카운트·최근 기록
- 뇌맵의 형태 변형 제거, 수평 viewport-clamped tooltip, 키보드·터치 지원
- 5개 뇌영역 상세 페이지
- 7개 학습 영역과 핵심/자세히/올림피아드 심화, 오해·용어·자가점검·참고자료
- 유리프 연구 아카이브와 CA 개발일지
- localStorage 기록 편집기, 수정·삭제 확인, JSON import/export, 두 종류 텍스트 복사, 입력 오류 처리
- 검색 색인 80항목
- 객관식·참거짓·경로 순서 45문항, 즉시 해설, 오답 재도전, localStorage 진도
- 12개 학습 페이지의 명시적 완료 표시, 홈 진행률·단계·체크리스트·퀴즈 누적 통계
- 1차 확인 뒤 다시 묻는 접근 가능한 2단계 진도 초기화; 학습·퀴즈 키만 삭제하고 연구기록·테마는 보존
- references 데이터와 저작권·개인정보·과학 검수 원칙
- 기존 5개 주소 redirect와 404 안내 페이지
- `.nojekyll` 및 공식 GitHub Pages 정적 배포 워크플로(배포 전 검증기 실행)

## 4. 정적 검증 결과

- 필수 파일 누락: 0
- 내부 링크·앵커 오류: 0
- JSON 파싱 오류: 0
- JavaScript 7개 구문 오류: 0
- 검색 URL/anchor 오류: 0
- 퀴즈 정답 인덱스·설명·관련 링크 오류: 0
- 가상 홈 수치·좋아요·댓글: 0
- 뇌맵 CSS의 translate/scale/rotate: 0
- PDF 원본 커밋: 0
- 공개 사이트 코드의 다른 프로젝트 내용: 0
- GitHub Actions 실행 `34819298417`: 검증·설정·업로드·Pages 배포 전 단계 성공
- 최신 검증 배포 SHA: `d0719b0fb809deda56ebcd0ae8a1a5f988ce30e2`

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
- `e71d2801e336` — `feat: add pastel themes and brain map navigation`
- `a42788bd031a` — `fix: keep cerebellum labels visible`
- `32a78261d642` — `fix: refresh shared theme assets`
- `d0719b0fb809` — `feat: add persistent learning progress`

위 커밋까지 `main`에 fast-forward 반영됐다. 최신 공식 Pages 워크플로 실행 `34819298417`이 성공했고 공개 URL에서 학습 진도와 기존 홈·뇌맵을 직접 확인했다.

## 6. 실제 브라우저 검수와 남은 범위

2026-09-14 공개 URL `https://ggy5555.github.io/`을 1363×936 브라우저에서 직접 검사했다.

- 홈과 뇌맵의 밝은·어두운 테마 렌더링 확인
- 테마 버튼의 접근 가능한 이름·pressed 상태와 새로고침 후 선택 유지 확인
- 홈·뇌맵·기초 신경과학·Quiz·기록 편집기에서 사이트 출처 콘솔 오류 0개 확인
- 상단 `뇌맵` 메뉴와 현재 페이지 active 상태 확인
- 뇌영역 hover 전후 bounding box 동일, 계산된 transform `none` 확인
- 툴팁 영문·한글 줄바꿈, 수평 transform, viewport 내부 배치 확인
- Space 키로 전두엽 상세 페이지 이동 확인
- 소뇌 내부 컨테이너가 실제 `display:flex`로 적용되고 라벨이 모양 안쪽 하단에 보이는 것 확인
- 기초 신경과학 완료 표시 후 새로고침 복구와 홈 `1/12`, `신호 포착`, 완료 체크·추천 카드 배지 반영 확인
- 퀴즈 1문항 응답 후 홈의 도전 횟수·응답 수·정답률 갱신 확인
- 진도 초기화의 1차 질문 → 2차 재확인 → 돌아가기·취소·Escape 흐름과 취소 후 데이터 보존 확인
- 초기화 코드는 학습 완료·퀴즈 누적·퀴즈 세션 3개 키만 제거하며 연구기록·테마 키를 참조하지 않음을 자동 검사
- 페이지 가로 overflow 0 확인

브라우저 도구의 viewport 크기를 변경할 수 없어 정확한 360·768·1024·1440px 실기기 렌더링과 모바일 두 번 터치는 이번 세션에서 자동화하지 못했다. 진행도 UI는 1000·650·390px 미디어 분기와 가로 overflow 방지를 정적으로 검사했다. 공개 브라우저의 실제 최종 초기화 클릭은 로컬 데이터 삭제에 해당해 실행하지 않았지만, 두 번의 명시적 확인 없이는 삭제 코드에 도달할 수 없고 삭제 키 3개를 허용 목록으로 자동 검사한다. 기록 편집기의 모든 import/export 예외 흐름은 이번 변경 범위에서 반복 실행하지 않았다.

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

1. 원격 `main`의 최신 SHA `d0719b0fb809deda56ebcd0ae8a1a5f988ce30e2`와 `git status` 확인
2. `node scripts/validate-site.mjs` 실행
3. 가능하면 실제 360px 또는 모바일 기기에서 햄버거, 뇌맵 첫 터치 설명·두 번째 이동, 소뇌 라벨, 진행도 체크리스트·초기화 대화상자를 확인
4. 768·1024·1440px에서 헤더 줄바꿈, 표 가로 스크롤, 진행도 카드 열 수를 확인
5. 발견한 문제만 최소 수정하고 별도 `fix:` 커밋
6. 이후 Quiz 전체 흐름과 기록 편집기 import/export 오류 흐름을 회귀 검사

사이트 구현은 이미 명시적으로 승인됐다. 다음 작업자는 계획 승인 질문으로 되돌아가지 말고, 남은 실기기 반응형 검증부터 시작한다.
