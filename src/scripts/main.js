import config from '../config.js';

// Mobiel menu
const b = document.querySelector('.burger'), m = document.querySelector('.menu');
b.onclick = () => { const o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); };
m.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => m.classList.remove('open')));

// Offerteformulier: met endpoint → POST naar de Worker; zonder endpoint of bij
// een fout → het e-mailprogramma van de bezoeker opent met de aanvraag (mailto).
const mailto = (f) => 'mailto:' + config.contact.email + '?subject=' + encodeURIComponent('Offerteaanvraag — ' + f.dienst.value) +
  '&body=' + encodeURIComponent([...new FormData(f)].filter((x) => x[1]).map((x) => x[0] + ': ' + x[1]).join('\n'));

document.querySelectorAll('.quote').forEach((f) => f.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!f.naam.value.trim()) return f.naam.focus();
  if (!f.email.value || !f.email.checkValidity()) return f.email.focus();
  const ok = f.querySelector('.ok'), btn = f.querySelector('button[type=submit]');
  const fallback = () => { ok.textContent = ok.dataset.mailto; ok.style.display = 'block'; location.href = mailto(f); };
  ok.dataset.mailto ??= ok.textContent;
  if (!config.endpoints.contact) return fallback();
  btn.disabled = true;
  try {
    const res = await fetch(config.endpoints.contact, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(f)))
    });
    if (!res.ok) throw new Error(res.status);
    f.reset();
    ok.textContent = 'Bedankt! Uw aanvraag is verstuurd. Wij reageren binnen 24 uur op werkdagen.';
    ok.style.display = 'block';
  } catch {
    fallback();
  } finally {
    btn.disabled = false;
  }
}));
