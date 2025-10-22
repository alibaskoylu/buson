import { supabase } from './supabase.js';

const dynamicRoot = document.getElementById('dynamic-content');
let allData = { cats: [], prods: [] };

function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}

function formatTRY(val) {
  const n = Number(val || 0);
  try { return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }); }
  catch (e) { return (n + ' ₺'); }
}

function renderCategory(cat, products) {
  const kategori = el('div', { class: 'kategori' });
  const header = el('div', { class: 'kategori-header' }, [
    document.createTextNode(cat.name || 'Kategori'),
    el('span', { class: 'ok' }, ['▶'])
  ]);
  const list = el('div', { class: 'urunler', style: 'display:none;' });

  header.addEventListener('click', () => {
    const opened = list.style.display !== 'none';
    list.style.display = opened ? 'none' : 'grid';
    header.querySelector('.ok').textContent = opened ? '▶' : '▼';
  });

  if (!products || products.length === 0) {
    const empty = el('div', { class: 'urun' }, [
      el('p', {}, ['Ürün bulunamadı'])
    ]);
    list.appendChild(empty);
  } else {
    for (const p of products) {
      const card = el('div', { class: 'urun' });
      const img = el('img', { src: p.image_url || '', alt: p.name || 'Ürün' });
      const name = el('p', {}, [p.name || '']);
      const price = el('p', {}, [formatTRY(p.price)]);
      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(price);
      list.appendChild(card);
    }
  }

  kategori.appendChild(header);
  kategori.appendChild(list);
  return kategori;
}

function renderAll(searchText = '') {
  const text = searchText.toLowerCase().trim();
  dynamicRoot.innerHTML = '';

  const cats = allData.cats || [];
  const prods = allData.prods || [];

  const byCat = new Map();
  for (const c of cats) byCat.set(c.id, []);
  for (const p of prods) {
    if (!byCat.has(p.category_id)) byCat.set(p.category_id, []);
    byCat.get(p.category_id).push(p);
  }

  for (const c of cats) {
    let products = byCat.get(c.id) || [];
    if (text) {
      products = products.filter(p => (p.name || '').toLowerCase().includes(text));
    }
    const catNode = renderCategory(c, products);
    dynamicRoot.appendChild(catNode);
  }
}

async function loadData() {
  const { data: cats, error: catErr } = await supabase.from('categories').select('*').order('id', { ascending: true });
  const { data: prods, error: prodErr } = await supabase.from('products').select('id,name,price,description,image_url,category_id').order('id', { ascending: true });

  if (catErr) {
    dynamicRoot.innerHTML = '<p style="color:#b71c1c">Kategoriler yüklenemedi: ' + catErr.message + '</p>';
    return;
  }
  if (prodErr) console.error(prodErr);

  allData = { cats: cats || [], prods: prods || [] };
  renderAll();
}

document.addEventListener('DOMContentLoaded', async () => {
  const searchBar = document.createElement('div');
  searchBar.style.textAlign = 'center';
  searchBar.style.margin = '20px 0';
  searchBar.innerHTML = '<input type="text" id="searchBox" placeholder="Ürün ara..." style="width:60%;max-width:400px;padding:10px;border-radius:12px;border:1px solid #ccc;">';
  dynamicRoot.parentNode.insertBefore(searchBar, dynamicRoot);
  document.getElementById('searchBox').addEventListener('input', (e) => renderAll(e.target.value));
  await loadData();
});
