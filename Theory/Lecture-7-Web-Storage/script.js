// ===== SECTION 2 & 3: localStorage & sessionStorage Functions =====

// localStorage Methods
function localSetItem() {
  const key = document.querySelector('#localStorageKey').value;
  const value = document.querySelector('#localStorageValue').value;
  if (!key) { alert('Please enter a key'); return; }
  localStorage.setItem(key, value);
  document.querySelector('#localOutput').textContent = `Saved "${key}" = "${value}" to localStorage`;
  showAllLocal();
}

function localGetItem() {
  const key = document.querySelector('#localStorageKey').value;
  if (!key) { alert('Please enter a key'); return; }
  const value = localStorage.getItem(key);
  document.querySelector('#localOutput').textContent = `localStorage.getItem("${key}") → ${value ?? 'null'}`;
}

function localRemoveItem() {
  const key = document.querySelector('#localStorageKey').value;
  if (!key) { alert('Please enter a key'); return; }
  localStorage.removeItem(key);
  document.querySelector('#localOutput').textContent = `Removed "${key}" from localStorage`;
  showAllLocal();
}

function localClear() {
  localStorage.clear();
  document.querySelector('#localOutput').textContent = 'localStorage cleared!';
}

function showAllLocal() {
  const items = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    items.push(`${key}: ${value}`);
  }
  document.querySelector('#localOutput').textContent = 
    items.length > 0 ? items.join('\n') : 'localStorage is empty';
}

// sessionStorage Methods
function sessionSetItem() {
  const key = document.querySelector('#sessionStorageKey').value;
  const value = document.querySelector('#sessionStorageValue').value;
  if (!key) { alert('Please enter a key'); return; }
  sessionStorage.setItem(key, value);
  document.querySelector('#sessionOutput').textContent = `Saved "${key}" = "${value}" to sessionStorage`;
  showAllSession();
}

function sessionGetItem() {
  const key = document.querySelector('#sessionStorageKey').value;
  if (!key) { alert('Please enter a key'); return; }
  const value = sessionStorage.getItem(key);
  document.querySelector('#sessionOutput').textContent = `sessionStorage.getItem("${key}") → ${value ?? 'null'}`;
}

function sessionRemoveItem() {
  const key = document.querySelector('#sessionStorageKey').value;
  if (!key) { alert('Please enter a key'); return; }
  sessionStorage.removeItem(key);
  document.querySelector('#sessionOutput').textContent = `Removed "${key}" from sessionStorage`;
  showAllSession();
}

function sessionClear() {
  sessionStorage.clear();
  document.querySelector('#sessionOutput').textContent = 'sessionStorage cleared!';
}

function showAllSession() {
  const items = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    items.push(`${key}: ${value}`);
  }
  document.querySelector('#sessionOutput').textContent = 
    items.length > 0 ? items.join('\n') : 'sessionStorage is empty';
}

// ===== SECTION 7: JSON Functions =====

function jsonSaveToLocal() {
  const key = document.querySelector('#jsonKey').value;
  const jsonValue = document.querySelector('#jsonValue').value;
  if (!key) { alert('Please enter a key'); return; }
  
  try {
    const parsed = JSON.parse(jsonValue);
    localStorage.setItem(key, JSON.stringify(parsed));
    document.querySelector('#jsonOutput').textContent = 
      `Saved to localStorage\n\nJSON String:\n${JSON.stringify(parsed)}`;
  } catch (error) {
    document.querySelector('#jsonOutput').textContent = `❌ Invalid JSON: ${error.message}`;
  }
}

function jsonLoadFromLocal() {
  const key = document.querySelector('#jsonKey').value;
  if (!key) { alert('Please enter a key'); return; }
  
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      document.querySelector('#jsonOutput').textContent = `No value found for "${key}"`;
      return;
    }
    const parsed = JSON.parse(raw);
    document.querySelector('#jsonOutput').textContent = 
      `Loaded from localStorage\n\nParsed Object:\n${JSON.stringify(parsed, null, 2)}`;
  } catch (error) {
    document.querySelector('#jsonOutput').textContent = `❌ Parse Error: ${error.message}`;
  }
}

function jsonSaveToSession() {
  const key = document.querySelector('#jsonKey').value;
  const jsonValue = document.querySelector('#jsonValue').value;
  if (!key) { alert('Please enter a key'); return; }
  
  try {
    const parsed = JSON.parse(jsonValue);
    sessionStorage.setItem(key, JSON.stringify(parsed));
    document.querySelector('#jsonOutput').textContent = 
      `Saved to sessionStorage\n\nJSON String:\n${JSON.stringify(parsed)}`;
  } catch (error) {
    document.querySelector('#jsonOutput').textContent = `❌ Invalid JSON: ${error.message}`;
  }
}

function jsonLoadFromSession() {
  const key = document.querySelector('#jsonKey').value;
  if (!key) { alert('Please enter a key'); return; }
  
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      document.querySelector('#jsonOutput').textContent = `No value found for "${key}"`;
      return;
    }
    const parsed = JSON.parse(raw);
    document.querySelector('#jsonOutput').textContent = 
      `Loaded from sessionStorage\n\nParsed Object:\n${JSON.stringify(parsed, null, 2)}`;
  } catch (error) {
    document.querySelector('#jsonOutput').textContent = `❌ Parse Error: ${error.message}`;
  }
}

// ===== SECTION 12: Notes App Functions =====

const NOTES_KEY = 'lecture7-notes';

const noteForm = document.querySelector('#noteForm');
const noteText = document.querySelector('#noteText');
const notesList = document.querySelector('#notesList');
const statusMessage = document.querySelector('#status');

function getNotes() {
  const stored = localStorage.getItem(NOTES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse notes:', error);
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function notify(message) {
  statusMessage.textContent = message;
  setTimeout(() => {
    statusMessage.textContent = '';
  }, 3000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function addNote(text) {
  const notes = getNotes();
  const newNote = {
    id: Date.now(),
    text: text,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };
  notes.unshift(newNote);
  saveNotes(notes);
  notify('Note saved to localStorage.');
  renderNotes();
}

function editNote(id) {
  const notes = getNotes();
  const note = notes.find(n => n.id === id);
  if (!note) return;

  const newText = prompt('Edit note:', note.text);
  if (newText !== null && newText.trim()) {
    note.text = newText.trim();
    note.updatedAt = new Date().toISOString();
    saveNotes(notes);
    notify(' Note updated.');
    renderNotes();
  }
}

function deleteNote(id) {
  if (!confirm('Delete this note?')) return;
  
  const notes = getNotes().filter(n => n.id !== id);
  saveNotes(notes);
  notify(' Note deleted.');
  renderNotes();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderNotes() {
  const notes = getNotes();
  notesList.innerHTML = '';

  if (notes.length === 0) {
    notesList.innerHTML = '<div class="note-card empty">No notes yet. Add your first note above!</div>';
    return;
  }

  notes.forEach(note => {
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.innerHTML = `
      <div class="note-content">
        <div class="note-text">${escapeHtml(note.text)}</div>
        <div class="note-meta">
          Created ${formatDate(note.createdAt)}${note.updatedAt ? ` · Updated ${formatDate(note.updatedAt)}` : ''}
        </div>
      </div>
      <div class="note-actions">
        <button class="btn-edit" onclick="editNote(${note.id})">Edit</button>
        <button class="btn-delete" onclick="deleteNote(${note.id})">Delete</button>
      </div>
    `;
    notesList.appendChild(noteCard);
  });
}

// Event Listeners
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = noteText.value.trim();
  if (!text) {
    notify(' A note cannot be empty.');
    return;
  }
  addNote(text);
  noteForm.reset();
});

// Initialize on page load
window.addEventListener('load', () => {
  renderNotes();
  notify('Ready. All sections loaded.');
});
