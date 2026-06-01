/* js/sos.js */

function initSOS() {
  const med = Storage.get('medical') || {};
  const guardians = Storage.get('guardians') || [];

  // Medical status
  const hasMed = med.name || med.blood;
  document.getElementById('med-status').textContent = hasMed ? '등록됨 ✓' : '미등록';
  document.getElementById('med-status').className = 'status-val ' + (hasMed ? 'ok' : 'warn');

  // Guardian status
  document.getElementById('guardian-status').textContent = guardians.length + '명';
  document.getElementById('guardian-status').className = 'status-val ' + (guardians.length > 0 ? 'ok' : 'warn');

  // Location permission
  if ('geolocation' in navigator) {
    navigator.permissions && navigator.permissions.query({ name: 'geolocation' }).then(r => {
      const el = document.getElementById('loc-status');
      if (r.state === 'granted') { el.textContent = '허용됨 ✓'; el.className = 'status-val ok'; }
      else if (r.state === 'denied') { el.textContent = '거부됨'; el.className = 'status-val error'; }
      else { el.textContent = '미요청'; el.className = 'status-val warn'; }
    });
  }

  // Ready status
  const ready = hasMed && guardians.length > 0;
  const el = document.getElementById('ready-status');
  el.textContent = ready ? '준비됨 ✓' : '미완료';
  el.className = 'status-val ' + (ready ? 'ok' : 'warn');

  // Summary
  document.getElementById('summary-text').innerHTML =
    '이름/별칭: ' + (med.name || '미입력') + '<br>' +
    '혈액형: ' + (med.blood || '미입력') + '<br>' +
    '보호자: ' + guardians.length + '명 등록';
}

function triggerSOS() {
  // 1. Call 119
  if (confirm('119에 전화하시겠습니까?')) {
    location.href = 'tel:119';
  }
  // 2. Send guardian messages
  sendEmergencyMessages();
}

function sendEmergencyMessages() {
  const guardians = Storage.get('guardians') || [];
  if (guardians.length === 0) {
    alert('등록된 보호자가 없습니다. 보호자 탭에서 먼저 등록해주세요.');
    return;
  }
  const msg = buildMessage(null);
  guardians.forEach(g => {
    const phone = g.phone.replace(/[^0-9]/g, '');
    const smsLink = 'sms:' + phone + (navigator.userAgent.match(/iPhone|iPad/) ? '&' : '?') + 'body=' + encodeURIComponent(msg);
    window.open(smsLink, '_blank');
  });
}

function buildMessage(coords) {
  const med = Storage.get('medical') || {};
  const locStr = coords
    ? '위도 ' + coords.latitude.toFixed(5) + ', 경도 ' + coords.longitude.toFixed(5) +
      '\n지도: https://maps.google.com/?q=' + coords.latitude + ',' + coords.longitude
    : '위치 정보를 가져오지 못했습니다.';

  return `[응급 SOS] 도움이 필요합니다.
현재 위치: ${locStr}

[환자 정보]
이름/별칭: ${med.name || '이름 미입력'}
혈액형: ${med.blood || '미입력'}
지병: ${med.conditions || '미입력'}
알레르기: ${med.allergies || '미입력'}
복용 약: ${med.medications || '미입력'}
특이사항: ${med.notes || '미입력'}

이 메시지는 SaveMe 앱에서 작성되었습니다. 즉시 119에 신고하거나 가까운 사람에게 도움을 요청해 주세요.`;
}
