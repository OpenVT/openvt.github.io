async function loadBibliography() {
    const response = await fetch("/data/framework-comparisons-bib.json");
    const data = await response.json();
    const container = document.getElementById('bibliography-frame-cap');
  
    function formatEntry(entry) {
      const authors = (entry.author || []).map(a => `${a.family}, ${a.given}`).join(', ');
      return `
        <div class="entry" data-search="${authors} ${entry.title} ${entry.issued['date-parts'][0][0]}">
          <strong>${authors}</strong> (${entry.issued['date-parts'][0][0]}). 
          <em>${entry.title}</em>. 
          ${entry['container-title'] || ''}.
        </div>`;
    }
  
    function render(entries) {
      container.innerHTML = entries.map(formatEntry).join('');
    }
  
    render(data);
  
    document.getElementById('search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = data.filter(entry => {
        const searchText = `${entry.title} ${(entry.author || []).map(a => a.family + a.given).join(' ')} ${entry.issued['date-parts'][0][0]}`.toLowerCase();
        return searchText.includes(query);
      });
      render(filtered);
    });
  }
  
  loadBibliography();
  