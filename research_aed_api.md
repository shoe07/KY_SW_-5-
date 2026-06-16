# AED 공공 데이터 API 조사 메모

공공데이터포털의 **국립중앙의료원_전국 자동심장충격기(AED) 정보 조회 서비스**는 REST 방식, XML 응답 형식의 무료 OpenAPI로 제공된다. 페이지에서 확인된 서비스 URL은 `http://apis.data.go.kr/B552657/AEDInfoInqireService`이며, 관리정보 조회 엔드포인트 예시는 `getEgytAedManageInfoInqire`이다. 제공기관은 국립중앙의료원이고, 활용승인은 개발·운영 단계 모두 자동승인으로 표시되어 있다.

출처: https://www.data.go.kr/data/15000652/openapi.do

생활안전지도 개발자센터의 **AED(자동심장충격기)** Data API 페이지는 제공처를 국립중앙의료원, 버전을 1.1로 표시한다. 화면상 요청 URL 예시는 `http://www.safemap.go.kr/sm/apis.do?apiKey=인증키&요청변수` 형태이며, 샘플 코드에서 `serverUrl: 'www.safemap.go.kr/sm/apis.do?apikey=[APIKEY]'`, `layername: 'A2SM_AED'`, `styles: 'A2SM_AED'` 형태의 WMS 레이어 호출 예시가 확인된다. 이 API는 지도 레이어 시각화에는 유용하지만, 모바일 앱에서 주변 AED 후보 리스트와 거리 계산을 안정적으로 제공하려면 국립중앙의료원 공공데이터포털의 XML 조회 API를 우선 사용하는 편이 더 적합하다.

출처: https://www.safemap.go.kr/dvct/data/selectDataAPIDetail.do?dataApiId=90
