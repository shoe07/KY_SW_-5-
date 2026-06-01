/* js/medical.js */

function loadMedical() {
  const med = Storage.get('medical') || {};
  if (med.name)        document.getElementById('name').value = med.name;
  if (med.conditions)  document.getElementById('conditions').value = med.conditions;
  if (med.allergies)   document.getElementById('allergies').value = med.allergies;
  if (med.medications) document.getElementById('medications').value = med.medications;
  if (med.notes)       document.getElementById('notes').value = med.notes;
  if (med.blood) {
    const radios = document.querySelectorAll('input[name="blood"]');
    radios.forEach(r => { if (r.value === med.blood) r.checked = true; });
  }
}

function saveMedical() {
  const blood = document.querySelector('input[name="blood"]:checked')?.value || '미입력';
  const med = {
    name:        document.getElementById('name').value.trim(),
    blood,
    conditions:  document.getElementById('conditions').value.trim(),
    allergies:   document.getElementById('allergies').value.trim(),
    medications: document.getElementById('medications').value.trim(),
    notes:       document.getElementById('notes').value.trim(),
  };
  Storage.set('medical', med);
  showToast();
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}
