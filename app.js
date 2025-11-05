// Fetch words.txt and build a 5x5 bingo board. Center cell is FREE and marked.

const boardEl = document.getElementById('board');
const newBoardBtn = document.getElementById('newBoard');
const shuffleBtn = document.getElementById('shuffle');
const exportBtn = document.getElementById('exportPdf');
const clearSavedBtn = document.getElementById('clearSaved');
const overlay = document.getElementById('overlay');
const closeOverlay = document.getElementById('closeOverlay');

let words = [];
const STORAGE_KEY = 'bingo_state_v1';
let boardContents = []; // array of 25 strings
let boardMarks = []; // array of 25 booleans
let config = {
  boardTitle: 'Bingo!',
  freeTileName: 'FREE',
  headerImage: '',
  colors: {
    bg: '#0f1724', card: '#0b1220', accent: '#ffca28', marked: '#1f8a70', text: '#e6eef8'
  }
};

async function loadConfig(){
  try{
    const res = await fetch('config.json');
    if(!res.ok) throw new Error('config not found');
    const j = await res.json();
    // shallow merge
    config = Object.assign(config, j || {});
    if(j && j.colors) config.colors = Object.assign(config.colors, j.colors);
  }catch(e){
    // use defaults if no config
    console.warn('Could not load config.json, using defaults', e);
  }
  applyConfig();
}

function applyConfig(){
  // set title
  const titleEl = document.querySelector('main h1');
  if(titleEl && config.boardTitle) titleEl.textContent = config.boardTitle;

  // set header image if provided
  if(config.headerImage){
    const main = document.querySelector('main');
    let header = document.getElementById('headerLogo');
    if(!header){
      header = document.createElement('img');
      header.id = 'headerLogo';
      header.alt = config.boardTitle || 'logo';
      header.className = 'header-logo';
      const h1 = document.querySelector('main h1');
      if(h1) main.insertBefore(header, h1);
      else main.prepend(header);
    }
    header.src = config.headerImage;
  }

  // set CSS variables for colors
  try{
    const root = document.documentElement;
    root.style.setProperty('--bg', config.colors.bg || '#0f1724');
    root.style.setProperty('--card', config.colors.card || '#0b1220');
    root.style.setProperty('--accent', config.colors.accent || '#ffca28');
    root.style.setProperty('--marked', config.colors.marked || '#1f8a70');
    root.style.setProperty('--text', config.colors.text || '#e6eef8');
  }catch(e){/* ignore */}
}

async function loadWords(){
  try{
    const res = await fetch('words.txt');
    const txt = await res.text();
    words = txt.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    if(words.length < 24){
      console.warn('Less than 24 words found; add more to words.txt for variety.');
    }
  }catch(e){
    console.error('Could not load words.txt', e);
    words = [];
  }
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function loadSavedState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    if(!parsed || !Array.isArray(parsed.contents) || !Array.isArray(parsed.marks)) return null;
    if(parsed.contents.length !== 25 || parsed.marks.length !== 25) return null;
    return parsed;
  }catch(e){
    console.warn('Failed to parse saved bingo state', e);
    return null;
  }
}

function saveState(){
  const payload = {contents: boardContents, marks: boardMarks, createdAt: Date.now()};
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); }catch(e){ console.warn('Could not save bingo state', e); }
}

function clearSavedState(){
  localStorage.removeItem(STORAGE_KEY);
}

function generateNewState(){
  const pool = shuffle(Array.from(words));
  const needed = 24;
  const picks = pool.slice(0,needed);
  const contents = new Array(25).fill('');
  const marks = new Array(25).fill(false);
  for(let i=0;i<25;i++){
    if(i===12){ contents[i] = config.freeTileName || 'FREE'; marks[i] = true; }
    else{
      const pickIndex = i < 12 ? i : i - 1;
      contents[i] = picks[pickIndex] ?? '';
    }
  }
  boardContents = contents;
  boardMarks = marks;
  saveState();
}

function buildBoard(forceNew = false){
  boardEl.innerHTML = '';
  let state = null;
  if(!forceNew) state = loadSavedState();
  if(state){
    boardContents = state.contents.slice();
    boardMarks = state.marks.slice();
  }else{
    generateNewState();
  }

  for(let idx=0; idx<25; idx++){
    const r = Math.floor(idx/5);
    const c = idx % 5;
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.r = r; cell.dataset.c = c;
    const text = boardContents[idx] ?? '';
    cell.textContent = text;
    if(idx===12) cell.classList.add('free');
    // ensure center shows configured free tile name
    if(idx===12 && (!cell.textContent || cell.textContent === 'FREE')){
      cell.textContent = config.freeTileName || 'FREE';
    }
    if(boardMarks[idx]) cell.classList.add('marked');
    cell.addEventListener('click',()=>{
      // toggle mark for this index
      boardMarks[idx] = !boardMarks[idx];
      cell.classList.toggle('marked');
      saveState();
      if(checkBingo()) showBingo();
    });
    boardEl.appendChild(cell);
  }
}

function checkBingo(){
  // build boolean grid
  const grid = Array.from({length:5},()=>Array(5).fill(false));
  const cells = boardEl.querySelectorAll('.cell');
  cells.forEach(cell=>{
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    grid[r][c] = cell.classList.contains('marked');
  });

  // rows
  for(let r=0;r<5;r++) if(grid[r].every(Boolean)) return true;
  // cols
  for(let c=0;c<5;c++){
    let ok=true;
    for(let r=0;r<5;r++) if(!grid[r][c]){ok=false;break}
    if(ok) return true;
  }
  // diagonals
  let ok=true;
  for(let i=0;i<5;i++) if(!grid[i][i]){ok=false;break}
  if(ok) return true;
  ok=true;
  for(let i=0;i<5;i++) if(!grid[i][4-i]){ok=false;break}
  if(ok) return true;

  return false;
}

function showBingo(){
  overlay.classList.remove('hidden');
  launchConfetti();
}

function launchConfetti(){
  // simple confetti using many small divs
  const confetti = overlay.querySelector('.confetti');
  confetti.innerHTML = '';
  const colors = ['#ff5e6c','#ffca28','#6ee7b7','#60a5fa','#c084fc'];
  for(let i=0;i<80;i++){
    const d = document.createElement('div');
    d.style.position='absolute';
    d.style.left = (Math.random()*100)+'%';
    d.style.top = (Math.random()*20)+'%';
    d.style.width = d.style.height = (6+Math.random()*10)+'px';
    d.style.background = colors[Math.floor(Math.random()*colors.length)];
    d.style.opacity = 0.95;
    d.style.borderRadius = (Math.random()>0.5? '50%':'2px');
    d.style.transform = 'translateY(-20vh) rotate('+ (Math.random()*360)+'deg)';
    d.style.animation = 'fall '+(2+Math.random()*2)+'s linear forwards';
    confetti.appendChild(d);
  }
}

// add falling animation rule
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes fall{to{transform:translateY(120vh) rotate(360deg);opacity:1}}`;
document.head.appendChild(styleSheet);

// interactions
newBoardBtn.addEventListener('click',()=>{ buildBoard(true); overlay.classList.add('hidden'); });
shuffleBtn.addEventListener('click',()=>{ loadWords().then(()=>buildBoard(true)); overlay.classList.add('hidden'); });
if(closeOverlay) closeOverlay.addEventListener('click',()=>overlay.classList.add('hidden'));
if(exportBtn) exportBtn.addEventListener('click', exportBoardPdf);
if(clearSavedBtn) clearSavedBtn.addEventListener('click',()=>{ clearSavedState(); buildBoard(true); overlay.classList.add('hidden'); });

async function exportBoardPdf(){
  const board = document.getElementById('board');
  if(!board){
    alert('Board not found');
    return;
  }

  // hide overlay if visible
  const prevOverlayHidden = overlay.classList.contains('hidden');
  overlay.classList.add('hidden');

  try{
    // use a higher scale for better resolution
    const canvas = await html2canvas(board, {scale:2, backgroundColor: null});
    const imgData = canvas.toDataURL('image/png');

    // create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({orientation:'portrait', unit:'pt', format:'a4'});
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const imgWidth = pageWidth - margin*2;
    const imgHeight = canvas.height * (imgWidth / canvas.width);

    let drawWidth = imgWidth;
    let drawHeight = imgHeight;
    if(drawHeight > pageHeight - margin*2){
      const scale = (pageHeight - margin*2) / drawHeight;
      drawWidth = drawWidth * scale;
      drawHeight = drawHeight * scale;
    }

    pdf.addImage(imgData, 'PNG', (pageWidth - drawWidth) / 2, margin, drawWidth, drawHeight);
    pdf.save('bingo-board.pdf');
  }catch(err){
    console.error('Export failed', err);
    alert('Export failed; see console for details.');
  }finally{
    if(!prevOverlayHidden) overlay.classList.remove('hidden');
  }
}

// initial load
// initial load: load config, words, then restore/create board
loadConfig().then(()=> loadWords()).then(()=> buildBoard(false));

