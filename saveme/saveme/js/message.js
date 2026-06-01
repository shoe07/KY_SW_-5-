/* js/message.js */

let currentCoords = null;

function initMessage() {
  renderPreview();
}

function renderPreview() {
  const med = Storage.get('medical') || {};
  const locStr = currentCoords
    ? '위도 ' + currentCoords.latitude.toFixed(5) + ', 경도 ' + currentCoords.longitude.toFixed(5) +
      '\n지도: https://maps.google.com/?q=' + currentCoords.latitude + ',' + currentCoords.longitude
    : '위치 정보를 가져오지 못했습니다.';

  const msg = `[응급 SOS] 도움이 필요합니다.
현재 위치: ${locStr}

[환자 정보]
이름/별칭: ${med.name || '이름 미입력'}
혈액형: ${med.blood || '미입력'}
지병: ${med.conditions || '미입력'}
알레르기: ${med.allergies || '미입력'}
복용 약: ${med.medications || '미입력'}
특이사항: ${med.notes || '미입력'}

이 메시지는 SaveMe 앱에서 작성되었습니다. 즉시 119에 신고하거나 가까운 사람에게 도움을 요청해 주세요.`;

  document.getElementById('msg-preview').textContent = msg;
}

function fetchLocation() {
  if (!('geolocation' in navigator)) {
    alert('이 기기에서는 위치 정보를 지원하지 않습니다.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      currentCoords = pos.coords;
      document.getElementById('loc-status-msg').textContent =
        '위치가 포함되었습니다: 위도 ' + pos.coords.latitude.toFixed(5) + ', 경도 ' + pos.coords.longitude.toFixed(5);
      renderPreview();
    },
    err => {
      alert('위치를 가져오지 못했습니다: ' + err.message);
    }
  );
}

function sendToGuardians() {
  const guardians = Storage.get('guardians') || [];
  if (guardians.length === 0) {
    alert('등록된 보호자가 없습니다. 보호자 탭에서 먼저 등록해주세요.');
    return;
  }
  const msg = document.getElementById('msg-preview').textContent;
  guardians.forEach(g => {
    const phone = g.phone.replace(/[^0-9]/g, '');
    const isIOS = /iPhone|iPad/.test(navigator.userAgent);
    const smsLink = 'sms:' + phone + (isIOS ? '&' : '?') + 'body=' + encodeURIComponent(msg);
    window.open(smsLink, '_blank');
  });
}

function shareMessage() {
  const msg = document.getElementById('msg-preview').textContent;
  if (navigator.share) {
    navigator.share({ text: msg }).catch(() => copyToClipboard(msg));
  } else {
    copyToClipboard(msg);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => alert('메시지가 클립보드에 복사되었습니다.'));
}
