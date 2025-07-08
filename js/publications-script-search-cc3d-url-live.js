async function loadBibliography() {
    const response = await fetch("/data/bibliography-cc3d.json");
    const data = await response.json();
    const container = document.getElementById('bibliography-cc3d');
  
    function formatEntry(entry) {
      const authors = (entry.author || []).map(a => `${a.family}, ${a.given}`).join(', ');
      const year = entry.issued?.['date-parts']?.[0]?.[0] || '';
      const journal = entry['container-title'] || '';
      const doi = entry.DOI ? `https://doi.org/${entry.DOI}` : null;
    
      return `
        <span class="entry" data-search="${authors} ${entry.title} ${year}">
          <strong>${authors}</strong> (${year}). 
          <em>${entry.title}</em>. 
          ${journal}.
          ${doi ? `<br><a href="${doi}" target="_blank" rel="noopener noreferrer">${doi}</a>` : ''}
        </span>`;
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
  