/* js/guardians.js */

function loadGuardians() {
  renderList();
}

function renderList() {
  const guardians = Storage.get('guardians') || [];
  const list = document.getElementById('guardian-list');
  const badge = document.getElementById('guardian-count');
  badge.textContent = guardians.length + '명';

  if (guardians.length === 0) {
    list.innerHTML = '<p class="empty-msg">등록된 보호자가 없습니다. 위급 상황 전에 최소 1명을 등록해 주세요.</p>';
    return;
  }

  list.innerHTML = guardians.map((g, i) => `
    <div class="guardian-card">
      <div class="guardian-info">
        <h3>${escHtml(g.name)}</h3>
        <p>${escHtml(g.phone)}${g.rel ? ' · ' + escHtml(g.rel) : ''}</p>
      </div>
      <button class="delete-btn" onclick="deleteGuardian(${i})" aria-label="삭제">🗑️</button>
    </div>
  `).join('');
}

function addGuardian() {
  const name  = document.getElementById('g-name').value.trim();
  const phone = document.getElementById('g-phone').value.trim();
  const rel   = document.getElementById('g-rel').value.trim();

  if (!name || !phone) { alert('이름과 전화번호를 입력해주세요.'); return; }

  const guardians = Storage.get('guardians') || [];
  guardians.push({ name, phone, rel });
  Storage.set('guardians', guardians);

  // Reset form
  document.getElementById('g-name').value = '';
  document.getElementById('g-phone').value = '';
  document.getElementById('g-rel').value = '';

  renderList();
}

function deleteGuardian(index) {
  if (!confirm('이 보호자를 삭제하시겠습니까?')) return;
  const guardians = Storage.get('guardians') || [];
  guardians.splice(index, 1);
  Storage.set('guardians', guardians);
  renderList();
}

function escHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
