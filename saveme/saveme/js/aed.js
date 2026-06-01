/* js/aed.js
 * AED 위치 조회 — 공공데이터포털 국립중앙의료원 API 연동
 * API 키는 환경에 따라 직접 발급 후 AED_API_KEY 상수에 입력하세요.
 * https://www.data.go.kr/data/15000939/openapi.do
 */

const AED_API_KEY = 'YOUR_API_KEY_HERE'; // 발급 후 교체

function initAED() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchAED(pos.coords.latitude, pos.coords.longitude),
      ()  => showAEDError('위치 권한이 필요합니다.')
    );
  } else {
    showAEDError('이 기기에서는 위치 정보를 지원하지 않습니다.');
  }
}

function refreshAED() {
  initAED();
}

async function fetchAED(lat, lng) {
  updateMapPlaceholder(lat, lng);

  if (AED_API_KEY === 'YOUR_API_KEY_HERE') {
    // Demo mode — no real key provided
    document.getElementById('aed-list').innerHTML =
      '<p class="empty-msg">AED API 키를 js/aed.js에 입력하면 주변 AED 목록이 표시됩니다.</p>';
    return;
  }

  const url = `https://apis.data.go.kr/B552657/AEDInfoInqireService/getAEDLcinfoInqire` +
    `?serviceKey=${AED_API_KEY}&WGS84_LAT=${lat}&WGS84_LON=${lng}&pageNo=1&numOfRows=10`;

  try {
    const res  = await fetch(url);
    const text = await res.text();
    const xml  = new DOMParser().parseFromString(text, 'text/xml');
    const items = xml.querySelectorAll('item');

    if (!items.length) { showAEDError('주변 AED 정보를 찾을 수 없습니다.'); return; }

    const list = document.getElementById('aed-list');
    list.innerHTML = Array.from(items).map(item => {
      const name = item.querySelector('buildPlace')?.textContent || '—';
      const addr = item.querySelector('buildAddress')?.textContent || '—';
      const iLat = item.querySelector('wgs84Lat')?.textContent;
      const iLng = item.querySelector('wgs84Lon')?.textContent;
      const mapLink = iLat && iLng
        ? `<a href="https://maps.google.com/?q=${iLat},${iLng}" target="_blank" style="font-size:.75rem;color:var(--red)">지도 보기</a>`
        : '';
      return `<div class="aed-item"><h3>${name}</h3><p>${addr}</p>${mapLink}</div>`;
    }).join('');
  } catch (e) {
    showAEDError('AED 정보를 불러오지 못했습니다.');
  }
}

function updateMapPlaceholder(lat, lng) {
  const box = document.getElementById('aed-map');
  box.innerHTML = `
    <div class="map-placeholder">
      <span class="map-icon">📍</span>
      <p>내 위치</p>
      <p class="map-sub">${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
      <a href="https://maps.google.com/?q=${lat},${lng}" target="_blank"
         style="font-size:.75rem;color:var(--red);text-decoration:none;">Google 지도에서 열기</a>
    </div>`;
}

function showAEDError(msg) {
  document.getElementById('aed-list').innerHTML = `<p class="empty-msg">${msg}</p>`;
}
