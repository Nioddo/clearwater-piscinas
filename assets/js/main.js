// ClearWater Piscinas
// Dato de muestra: reemplazar por el número real (código de país + área sin 0 + número sin 15).
const WHATSAPP = '5492910000000';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const hasIO = 'IntersectionObserver' in window;

/* ---------- Barra: línea inferior al desplazarse ---------- */
const bar = document.querySelector('.bar');
const onScroll = () => bar.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Entradas al aparecer (una sola vez) ---------- */
const revealables = document.querySelectorAll('[data-reveal], [data-pop]');
if (hasIO) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('is-in'));
}

/* ---------- Botones de alternancia (trabajos): uno presionado a la vez ---------- */
function pressGroup(list, onSelect) {
  const items = [...list.querySelectorAll('[aria-pressed]')];
  items.forEach((btn, i) => btn.addEventListener('click', () => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    items.forEach((b) => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    onSelect(btn, i);
  }));
}

/* ---------- Comparador antes / después ---------- */
const box = document.querySelector('[data-compare]');
if (box) {
  const before = box.querySelector('.compare__before img');
  const afterPane = box.querySelector('.compare__after');
  const after = afterPane.querySelector('img');
  const edge = box.querySelector('.compare__edge');
  const range = box.querySelector('.compare__range');
  let touched = false;

  const set = (p) => {
    afterPane.style.clipPath = `inset(0 0 0 ${p}%)`;
    edge.style.transform = `translateX(${p}cqw)`;
  };
  set(range.value);
  range.addEventListener('input', () => { touched = true; set(range.value); });

  // Arrastre con dedo o mouse en cualquier punto de la foto; el range queda para el teclado.
  const fromPointer = (e) => {
    const r = box.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    range.value = p;
    set(p);
  };
  let drag = false;
  let sx = 0;
  let sy = 0;
  box.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || drag) return;
    touched = true;
    sx = e.clientX; sy = e.clientY;
    drag = e.pointerType === 'mouse' ? 'on' : 'pending';
    if (drag === 'on') { box.setPointerCapture(e.pointerId); box.classList.add('is-dragging'); fromPointer(e); }
  });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return;
    if (drag === 'pending') {
      // En pantallas táctiles: si el gesto es vertical, es scroll y se suelta.
      const dx = Math.abs(e.clientX - sx);
      const dy = Math.abs(e.clientY - sy);
      if (dy > dx && dy > 6) { drag = false; return; }
      if (dx < 6) return;
      drag = 'on';
      box.setPointerCapture(e.pointerId);
      box.classList.add('is-dragging');
    }
    fromPointer(e);
  });
  const end = (e) => {
    if (drag === 'pending' && e.type === 'pointerup') fromPointer(e);
    drag = false;
    box.classList.remove('is-dragging');
  };
  box.addEventListener('pointerup', end);
  box.addEventListener('pointercancel', end);

  // Pista: el borde se corre y vuelve la primera vez, para mostrar que se arrastra.
  const hint = () => {
    if (reduceMotion || touched) return;
    const start = performance.now();
    const keys = [[0, 50], [650, 26], [1450, 70], [2100, 50]];
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const tick = (now) => {
      if (touched) return;
      const t = now - start;
      const i = keys.findIndex(([k]) => k > t);
      if (i === -1) { set(50); range.value = 50; return; }
      const [t0, v0] = keys[i - 1];
      const [t1, v1] = keys[i];
      const v = v0 + (v1 - v0) * ease((t - t0) / (t1 - t0));
      set(v); range.value = v;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (hasIO) {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); setTimeout(hint, 900); } }, { threshold: 0.5 });
    io.observe(box);
  }

  // Trabajos: cada uno cambia el par de fotos y el texto.
  const projects = [
    {
      before: ['assets/img/trabajo-dic25-antes.webp', 'Antes: pileta con agua verde y hojas en el fondo'],
      after: ['assets/img/trabajo-dic25-despues.webp', 'Después: la misma pileta con agua turquesa y limpia'],
      fit: ['', 'scale(1.4)|70% 15%'],
      title: 'Del verde al turquesa', meta: 'Diciembre de 2025',
      text: 'Agua verde y un equipo que no filtraba. Recuperamos el agua, limpiamos fondo y paredes e instalamos un circuito de filtrado nuevo.',
    },
    {
      before: ['assets/img/equipo-antes.webp', 'Antes: filtro viejo y oxidado dentro de su caja'],
      after: ['assets/img/equipo-despues.webp', 'Después: equipo nuevo con bomba, filtro y válvulas'],
      fit: ['', 'scale(1.45)|31% 98%'],
      title: 'Un equipo de filtrado nuevo', meta: 'Diciembre de 2025, la misma pileta',
      text: 'El filtro viejo estaba oxidado. Lo reemplazamos y armamos el circuito completo con bomba, filtro y válvulas nuevas.',
    },
  ];
  const projectList = document.querySelector('.projects');
  const caseBox = document.querySelector('.case');
  if (projectList) {
    pressGroup(projectList, (btn) => {
      const p = projects[Number(btn.dataset.project)];
      const apply = () => {
        before.src = p.before[0]; before.alt = p.before[1];
        after.src = p.after[0]; after.alt = p.after[1];
        [before, after].forEach((img, k) => {
          const [t, o] = (p.fit[k] || '|').split('|');
          img.style.transform = t; img.style.transformOrigin = o || '';
        });
        document.getElementById('case-title').textContent = p.title;
        document.getElementById('case-meta').textContent = p.meta;
        document.getElementById('case-text').textContent = p.text;
        range.value = 50; set(50);
      };
      if (reduceMotion) { apply(); return; }
      box.classList.add('is-swapping');
      caseBox.classList.add('is-swapping');
      const pre = [new Image(), new Image()];
      pre[0].src = p.before[0]; pre[1].src = p.after[0];
      Promise.all([...pre.map((i) => i.decode().catch(() => {})), new Promise((r) => setTimeout(r, 240))]).then(() => {
        apply();
        requestAnimationFrame(() => { box.classList.remove('is-swapping'); caseBox.classList.remove('is-swapping'); });
      });
    });
  }
}

/* ---------- Pedido: arma el mensaje de WhatsApp ---------- */
const form = document.getElementById('orden');
if (form) {
  const out = document.getElementById('orden-mensaje');
  const send = document.getElementById('orden-enviar');
  const water = { cristalina: 'está cristalina', turbia: 'está turbia', verde: 'está verde', negra: 'tiene el agua negra' };
  const service = {
    recuperarla: 'quiero recuperarla',
    mantenimiento: 'me interesa el mantenimiento mensual',
    'puesta a punto': 'quiero ponerla a punto para la temporada',
    equipo: 'necesito que revisen el filtro y la bomba',
    'diagnóstico': 'quiero que la revisen y me digan qué necesita',
  };
  const compose = () => {
    const d = new FormData(form);
    const name = (d.get('nombre') || '').trim();
    const zone = (d.get('zona') || '').trim();
    return `Hola ClearWater!${name ? ` Soy ${name}.` : ''} Mi pileta ${water[d.get('agua')] || 'necesita una mano'}${zone ? `, en ${zone},` : ''} y ${service[d.get('servicio')] || 'quiero que alguien la vea'}. ¿Cuándo pueden venir a verla?`;
  };
  let last = out.textContent;
  const update = () => {
    const msg = compose();
    send.href = waLink(msg);
    if (msg === last) return;
    last = msg;
    out.textContent = msg;
    if (!reduceMotion) { out.classList.remove('is-inking'); void out.offsetWidth; out.classList.add('is-inking'); }
  };
  // Si el agua está verde o negra lo lógico es recuperarla; si está cristalina, mantenerla.
  form.addEventListener('change', (e) => {
    if (e.target.name === 'agua') {
      const v = e.target.value;
      const pick = v === 'cristalina' ? 'mantenimiento' : (v === 'turbia' ? null : 'recuperarla');
      if (pick) form.querySelector(`input[name="servicio"][value="${pick}"]`).checked = true;
    }
    update();
  });
  form.addEventListener('input', update);
  form.addEventListener('submit', (e) => { e.preventDefault(); send.click(); });
  update();
}

/* Los demás enlaces de WhatsApp usan el mismo número */
document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa.trim()); a.target = '_blank'; a.rel = 'noopener'; });

/* ---------- Barra fija en el teléfono ---------- */
const dock = document.querySelector('[data-dock]');
if (dock && hasIO) {
  const state = {};
  const sync = () => dock.classList.toggle('is-on', !Object.values(state).some(Boolean));
  [['hero', '.hero'], ['order', '#pedir'], ['foot', '.foot']].forEach(([key, sel]) => {
    state[key] = key === 'hero';
    new IntersectionObserver(([e]) => { state[key] = e.isIntersecting; sync(); }).observe(document.querySelector(sel));
  });
}

/* ---------- Mapa de zonas ---------- */
// Zonas de muestra, a confirmar con el cliente: el polígono es una aproximación del ejido urbano.
const initMap = () => {
  const el = document.getElementById('mapa');
  if (!el || !window.L) return;
  const L = window.L;
  const narrow = matchMedia('(max-width: 640px)').matches;
  const map = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, zoomControl: !narrow, zoomSnap: 0.25 });

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: 'Mapa base &copy; Esri, HERE, Garmin, &copy; colaboradores de OpenStreetMap',
  }).addTo(map);

  const css = getComputedStyle(document.documentElement);
  const petrol = css.getPropertyValue('--petrol').trim();
  const turq = css.getPropertyValue('--turq').trim();

  const city = [
    [-38.668, -62.318], [-38.655, -62.285], [-38.650, -62.255], [-38.668, -62.226],
    [-38.688, -62.205], [-38.715, -62.198], [-38.735, -62.205], [-38.752, -62.228],
    [-38.765, -62.250], [-38.758, -62.275], [-38.745, -62.300], [-38.728, -62.322],
    [-38.705, -62.335], [-38.685, -62.330],
  ];
  L.circle([-38.735, -62.215], { radius: 27000, stroke: false, fillColor: turq, fillOpacity: 0.22, interactive: false }).addTo(map);
  L.polygon(city, { color: petrol, weight: 3, fillColor: petrol, fillOpacity: 0.32, interactive: false })
    .addTo(map).bindTooltip('Bahía Blanca', { permanent: true, direction: 'center', className: 'city-label' });

  const towns = [
    ['Ingeniero White', -38.7833, -62.2667, 'bottom'],
    ['General Daniel Cerri', -38.7136, -62.3906, 'left'],
    ['Grünbein', -38.7478, -62.1767, 'right'],
    ['Villa Bordeu', -38.6567, -62.3333, 'left'],
    ['Punta Alta', -38.8794, -62.0731, 'right'],
  ];
  // En el teléfono el mapa se acerca a la ciudad; los pueblos lejanos quedan en la lista.
  const phoneSide = { 'Ingeniero White': 'bottom', 'Grünbein': 'left', 'Villa Bordeu': 'top' };
  const dot = L.divIcon({ className: 'town', iconSize: [14, 14] });
  towns.forEach(([name, lat, lng, side]) => {
    if (narrow && !phoneSide[name]) return;
    const dir = narrow ? phoneSide[name] : side;
    const offset = { left: [-10, 0], right: [10, 0], top: [0, -8], bottom: [0, 10] }[dir];
    L.marker([lat, lng], { icon: dot, keyboard: false, title: name }).addTo(map)
      .bindTooltip(name, { permanent: true, direction: dir, offset });
  });

  const bounds = narrow
    ? L.latLngBounds([[-38.645, -62.345], [-38.795, -62.175]])
    : L.latLngBounds([[-38.64, -62.41], [-38.89, -62.06]]);
  map.fitBounds(bounds, narrow ? { padding: [24, 24] } : { paddingTopLeft: [150, 40], paddingBottomRight: [110, 40] });
};
if (document.readyState === 'complete') initMap();
else addEventListener('load', initMap);
