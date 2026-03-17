/* pharos-map.js — Carte interactive Pharos Energy · Projet Résurgence */
window.PharosMap = (function () {

  const TERRITORY = [
    // ═══════════════════════════════════════════════════
    // Royaume-Uni du Nil — Frontières nationales
    // Égypte + Cyrénaïque libyenne + nord-est du Soudan
    // ═══════════════════════════════════════════════════

    // ─── Cyrénaïque libyenne (lobe nord-ouest) ───
    // Pointe ouest Cyrénaïque (env. Benghazi)
    [32.10, 20.0],  [32.30, 20.5],  [32.50, 21.0],
    [32.65, 21.5],  [32.75, 22.0],  [32.80, 22.5],
    [32.80, 23.0],  [32.70, 23.3],
    // Jonction côte libyenne → frontière Égypte
    [32.40, 23.5],  [32.10, 23.8],
    [31.90, 24.0],  [31.70, 24.5],
    [31.58, 25.0],

    // ─── Côte méditerranéenne Égypte ───
    // Sallum → Matruh → Alexandrie → Delta
    [31.55, 25.15], [31.50, 25.8],  [31.40, 26.5],
    [31.30, 27.0],  [31.25, 27.5],  [31.30, 28.0],
    [31.35, 28.5],  [31.40, 29.0],  [31.45, 29.5],

    // ─── Delta du Nil (côte nord) ───
    [31.50, 29.8],  [31.52, 30.2],  [31.53, 30.5],
    [31.52, 30.8],  [31.50, 31.0],  [31.55, 31.3],

    // ─── Sinaï (nord) → Canal de Suez ───
    [31.30, 31.8],  [31.10, 32.2],  [30.90, 32.5],
    [30.50, 32.58],

    // ─── Côte mer Rouge — descente Égypte ───
    [30.05, 32.60], [29.60, 32.70], [29.10, 32.85],
    [28.60, 33.10], [28.10, 33.30], [27.60, 33.55],
    [27.10, 33.80], [26.60, 34.00], [26.10, 34.20],
    [25.60, 34.40], [25.10, 34.55],

    // ─── Côte mer Rouge — Soudan (Hala'ib → Port-Soudan) ───
    [24.60, 34.80], [24.10, 35.10], [23.60, 35.40],
    [23.10, 35.70], [22.60, 36.00], [22.10, 36.30],
    [21.60, 36.60], [21.10, 36.90],
    [20.60, 37.10], [20.10, 37.40],

    // ─── Pointe sud-est (Soudan côte — env. Port-Soudan) ───
    [19.60, 37.50], [19.10, 37.60],
    [18.70, 37.70],

    // ─── Frontière sud — intérieur Soudan ───
    // Retour vers l'ouest le long ~18°N → ~15°N
    [18.50, 37.0],  [18.30, 36.0],  [18.10, 35.5],
    [17.90, 35.0],  [17.70, 34.5],  [17.50, 34.0],
    [17.30, 33.5],  [17.10, 33.0],
    [16.90, 32.5],  [16.50, 32.0],

    // ─── Frontière sud-ouest (Soudan / limite Nil Bleu) ───
    [16.10, 31.5],  [15.80, 31.0],
    [15.60, 30.5],  [15.60, 30.0],

    // ─── Frontière ouest Soudan — remontée désert ───
    [16.0,  29.5],  [16.5,  29.0],
    [17.0,  28.5],  [17.5,  28.0],
    [18.0,  27.5],  [18.5,  27.0],
    [19.0,  26.5],  [19.5,  26.0],
    [20.0,  25.5],  [20.5,  25.2],

    // ─── Frontière Égypte-Libye-Soudan (22°N) — désert ───
    [21.0,  25.0],  [21.5,  25.0],
    [22.0,  25.0],

    // ─── Frontière ouest Égypte (25°E méridien libyen) ───
    [22.5,  25.0],  [23.0,  25.0],
    [23.5,  25.0],  [24.0,  25.0],
    [24.5,  25.0],  [25.0,  25.0],

    // ─── Remontée frontière libyenne ───
    [25.5,  25.0],  [26.0,  25.0],
    [26.5,  25.0],  [27.0,  25.0],
    [27.5,  25.0],  [28.0,  25.0],
    [28.5,  25.0],  [29.0,  25.0],
    [29.5,  25.0],

    // ─── Frontière Libye intérieure → côte Cyrénaïque ───
    [30.0,  24.5],  [30.3,  24.0],
    [30.6,  23.5],  [30.8,  23.0],
    [31.0,  22.5],  [31.2,  22.0],
    [31.4,  21.5],  [31.6,  21.0],
    [31.8,  20.5],  [32.0,  20.2],

    // Fermeture
    [32.10, 20.0],
  ];

  const DARK_TILE  = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
  const LIGHT_TILE = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
  const ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#545d72">OSM</a> &copy; <a href="https://carto.com/" style="color:#545d72">CARTO</a>';

  const SITES = [
    { lat: 29.34013, lon: 30.94513, label: 'NILDU', sub: 'Centrale nucléaire · Médinet El-Fayoum', ref: 'NILDU-REF-001', status: 'En construction', color: '#1bbd8a' },
    { lat: 30.21796, lon: 31.25895, label: 'MEMPHIS', sub: 'Pile atomique · Le Caire', ref: 'MEMPHIS-PILE-001', status: 'En service', color: '#8b6fd4' },
    { lat: 23.96933, lon: 32.87741, label: "Barrage d'Assouan", sub: 'Centrale hydroélectrique · Nil', ref: 'ASSOUAN-HDA-001', status: 'En service', color: '#3b82f6' }
  ];

  function makeIcon(color, active) {
    const size = active ? 28 : 20;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size*1.33)}" viewBox="0 0 24 32">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20S24 21 24 12C24 5.37 18.63 0 12 0z" fill="${color}" opacity="${active ? 1 : 0.55}"/>
      <circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/>
      <circle cx="12" cy="12" r="2.5" fill="${color}"/>
    </svg>`;
    return L.divIcon({ html: svg, className: '', iconSize: [size, Math.round(size*1.33)], iconAnchor: [size/2, Math.round(size*1.33)], popupAnchor: [0, -Math.round(size*1.33)-2] });
  }

  function init(containerId, opts) {
    opts = Object.assign({ siteRef: null, zoom: 5, centerLat: 25.0, centerLon: 30.0, theme: document.documentElement.getAttribute('data-theme') || 'dark' }, opts);

    const map = L.map(containerId, { center: [opts.centerLat, opts.centerLon], zoom: opts.zoom, zoomControl: true, attributionControl: true, scrollWheelZoom: false });
    map.attributionControl.setPrefix('');

    const tileUrl = opts.theme === 'light' ? LIGHT_TILE : DARK_TILE;
    let tileLayer = L.tileLayer(tileUrl, { attribution: ATTR, maxZoom: 18 }).addTo(map);

    // Territoire du Royaume-Uni du Nil
    L.polygon(TERRITORY, {
      color: '#1bbd8a',
      weight: 1.5,
      opacity: 0.7,
      fillColor: '#1bbd8a',
      fillOpacity: 0.15,
      dashArray: null
    }).addTo(map);

    // Marqueurs
    SITES.forEach(site => {
      const active = opts.siteRef === site.ref;
      const marker = L.marker([site.lat, site.lon], { icon: makeIcon(site.color, active) }).addTo(map);
      marker.bindPopup(
        `<div style="font-family:'IBM Plex Mono',monospace;min-width:160px">
          <div style="font-weight:600;font-size:13px;color:${site.color};margin-bottom:2px">${site.label}</div>
          <div style="font-size:10px;color:#8b93a8;margin-bottom:5px">${site.ref}</div>
          <div style="font-size:11px;color:#c8ccd8">${site.sub}</div>
          <div style="margin-top:6px;font-size:10px;color:${site.color}">${site.status}</div>
        </div>`,
        { className: 'pharos-popup', closeButton: false }
      );
      if (active) setTimeout(() => marker.openPopup(), 400);
    });

    // Thème réactif
    map._pharosThemeLayer = tileLayer;
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());

    return map;
  }

  function setTheme(map, theme) {
    if (!map) return;
    map.eachLayer(l => { if (l instanceof L.TileLayer) map.removeLayer(l); });
    L.tileLayer(theme === 'light' ? LIGHT_TILE : DARK_TILE, { attribution: ATTR, maxZoom: 18 }).addTo(map);
  }

  return { init, setTheme };
})();
