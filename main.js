/* ═══════════════════════════════════════════════════════════
   HIDD Advisory — Temp JS (iterate on design)
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar ──────────────────────────────────────────── */
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60), { passive: true });

  /* ── Mobile menu ─────────────────────────────────────── */
  const tog = document.getElementById('mobileToggle');
  const links = document.getElementById('navLinks');
  tog.addEventListener('click', () => {
    tog.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    tog.classList.remove('active'); links.classList.remove('open'); document.body.style.overflow = '';
  }));

  /* ── Smooth scroll ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
    });
  });

  /* ── Risk Map Modal ─────────────────────────────────── */
  const modal = document.getElementById('riskModal');
  const areas = {
    vi:       { name:'Victoria Island', risk:'low', label:'Low Risk', flood:25, infra:90, title:12, desc:'Victoria Island benefits from mature infrastructure, well-documented titles, and strong institutional presence. Premium pricing reflects genuine underlying value.' },
    ikoyi:    { name:'Ikoyi', risk:'low', label:'Low Risk', flood:18, infra:88, title:10, desc:'One of Lagos\'s most established neighbourhoods with excellent infrastructure, low flood exposure, and well-documented land titles.' },
    lekki1:   { name:'Lekki Phase 1', risk:'low', label:'Low Risk', flood:30, infra:78, title:20, desc:'Mature residential environment with reliable infrastructure and relatively straightforward title verification.' },
    lekki2:   { name:'Lekki Phase 2', risk:'medium', label:'Medium Risk', flood:50, infra:55, title:40, desc:'Still developing. Infrastructure improving but inconsistent. Title complexity moderate due to ongoing allocation disputes.' },
    ajah:     { name:'Ajah', risk:'high', label:'High Risk', flood:78, infra:32, title:70, desc:'Significant challenges including recurring floods, limited infrastructure, and high incidence of disputed land titles.' },
    surulere: { name:'Surulere', risk:'medium', label:'Medium Risk', flood:35, infra:60, title:45, desc:'Well-known residential hub. Ageing but functional infrastructure. Title searches complex due to older family-held land.' },
    ikeja:    { name:'Ikeja GRA', risk:'low', label:'Low Risk', flood:20, infra:75, title:18, desc:'Premium mainland neighbourhood with strong governance, clear title documentation, and reliable infrastructure.' },
    yaba:     { name:'Yaba', risk:'medium', label:'Medium Risk', flood:40, infra:58, title:50, desc:'Tech ecosystem driving demand but land titles often complicated by multi-generational ownership.' },
    magodo:   { name:'Magodo', risk:'medium', label:'Medium Risk', flood:30, infra:62, title:38, desc:'Suburban residential with moderate infrastructure. Title disputes less frequent but due diligence remains important.' },
    gbagada:  { name:'Gbagada', risk:'medium', label:'Medium Risk', flood:42, infra:55, title:42, desc:'Rapid development outpacing infrastructure. Flood risk in valley areas and mixed title histories.' },
    ojodu:    { name:'Ojodu Berger', risk:'high', label:'High Risk', flood:60, infra:35, title:65, desc:'Rapid growth with minimal planning. Significant flood risk, strained infrastructure, common land disputes.' },
    sangotedo:{ name:'Sangotedo', risk:'high', label:'High Risk', flood:65, infra:28, title:68, desc:'Emerging corridor with speculative pricing. Minimal infrastructure, high flood risk, complex title verification.' },
  };

  const colors = { low:'#34d399', medium:'#fbbf24', high:'#f87171' };
  const riskColor = (val, invert) => {
    if (invert) return val > 65 ? colors.low : val > 40 ? colors.medium : colors.high;
    return val > 55 ? colors.high : val > 30 ? colors.medium : colors.low;
  };

  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      const d = areas[pin.dataset.area];
      if (!d) return;
      document.getElementById('modalTitle').textContent = d.name;
      const badge = document.getElementById('modalRiskBadge');
      badge.textContent = d.label;
      badge.className = `modal-badge risk-${d.risk}`;
      document.getElementById('modalDesc').textContent = d.desc;
      document.getElementById('valFlood').textContent = d.flood + '%';
      document.getElementById('valInfra').textContent = d.infra + '%';
      document.getElementById('valTitle').textContent = d.title + '%';
      const mF = document.getElementById('meterFlood');
      const mI = document.getElementById('meterInfra');
      const mT = document.getElementById('meterTitle');
      mF.style.width = '0%'; mI.style.width = '0%'; mT.style.width = '0%';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setTimeout(() => {
        mF.style.width = d.flood + '%'; mF.style.background = riskColor(d.flood);
        mI.style.width = d.infra + '%'; mI.style.background = riskColor(d.infra, true);
        mT.style.width = d.title + '%'; mT.style.background = riskColor(d.title);
      }, 60));
    });
  });

  const closeModal = () => { modal.classList.remove('active'); document.body.style.overflow = ''; };
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.getElementById('modalCTA').addEventListener('click', closeModal);

  /* ── FAQ ─────────────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  /* ── Contact form ───────────────────────────────────── */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.timestamp = new Date().toISOString();
    console.log('━━━ HIDD Enquiry ━━━');
    console.table(data);
    form.reset();
    const s = document.getElementById('formSuccess');
    s.classList.add('show');
    setTimeout(() => s.classList.remove('show'), 5000);
  });

  /* ── URL param for service select ───────────────────── */
  const sel = document.getElementById('serviceSelect');
  const p = new URLSearchParams(location.search).get('service');
  if (sel && p) sel.value = p;

  /* ── Scroll reveal ──────────────────────────────────── */
  const reveals = document.querySelectorAll('.section-eyebrow, .section-title, .section-desc, .section-header-split, .svc-card, .why-card, .t-card, .faq-item, .contact-layout, .cta-inner, .map-stage');
  reveals.forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.05 });
  reveals.forEach(el => obs.observe(el));

  /* Stagger children in grids */
  document.querySelectorAll('.services-grid, .why-grid, .testimonial-track, .faq-list').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.06}s`;
    });
  });
});