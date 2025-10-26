
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

document.getElementById('add-movie-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const tags = form.tags.value ? form.tags.value.split(',').map(t => t.trim()) : [];
  
  const { data, error } = await supabase.from('movies').insert([{
    title: form.title.value,
    rating: form.rating.value,
    poster: form.poster.value || null,
    notes: form.notes.value || null,
    director: form.director.value || null,
    tags: form.tags.value || null,
    date_watched: form.date_watched.value || null
  }]);
  
  if(error) console.error(error);
  form.reset();
  fetchFeed();
});

async function fetchFeed() {
  const { data } = await supabase.from('movies').select('*').order('date_watched', { ascending: false });
  const feed = document.getElementById('feed');
  feed.innerHTML = data.map(m => `
    <div class="card">
      <h3>${m.title} (${m.rating}⭐)</h3>
      ${m.poster ? `<img src="${m.poster}" width="100">` : ''}
      <p>${m.notes || ''}</p>
      <p>${m.director || ''}</p>
      <p>${m.cast || ''}</p>
      <p>${m.tags ? m.tags.join(', ') : ''}</p>
      <p>${m.date_watched || ''}</p>
    </div>
  `).join('');
}

fetchFeed();
