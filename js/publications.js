// === publications.js for loading json or bibtex===
let publications = [];
let currentStyle = "apa";

// DOM references
const list = document.getElementById("publication-list");
const yearFilter = document.getElementById("filter-year");
const authorFilter = document.getElementById("filter-author");
const tagFilter = document.getElementById("filter-tag");
const sortSelect = document.getElementById("sort-by");
const toggleStyleBtn = document.getElementById("toggle-style");

// Load from JSON
async function loadFromJSON() {
  const res = await fetch("/data/publications.json");
  publications = await res.json();
  render();
  populateFilters();
}

// Load from BibTeX
async function loadFromBibTeX() {
  const res = await fetch("/data/publications.bib");
  const bibText = await res.text();
  const parsed = bibtexParse.toJSON(bibText);
  publications = parsed.map(entry => ({
    title: entry.entryTags.title || "",
    author: entry.entryTags.author || "",
    year: entry.entryTags.year || "",
    journal: entry.entryTags.journal || "",
    doi: entry.entryTags.doi || "",
    tags: [entry.entryType]
  }));
  render();
  populateFilters();
}

function populateFilters() {
  const years = [...new Set(publications.map(p => p.year))].sort().reverse();
  const authors = [...new Set(publications.flatMap(p => p.author.split(/,|and/).map(a => a.trim())))].sort();
  const tags = [...new Set(publications.flatMap(p => p.tags || []))];

  yearFilter.innerHTML += years.map(y => `<option value="${y}">${y}</option>`).join("");
  authorFilter.innerHTML += authors.map(a => `<option value="${a}">${a}</option>`).join("");
  tagFilter.innerHTML += tags.map(t => `<option value="${t}">${t}</option>`).join("");
}

function render() {
  let filtered = [...publications];
  const year = yearFilter.value;
  const author = authorFilter.value;
  const tag = tagFilter.value;
  const sort = sortSelect.value;

  if (year !== "all") filtered = filtered.filter(p => p.year === year);
  if (author !== "all") filtered = filtered.filter(p => p.author.includes(author));
  if (tag !== "all") filtered = filtered.filter(p => (p.tags || []).includes(tag));

  if (sort === "year-desc") filtered.sort((a, b) => b.year.localeCompare(a.year));
  else if (sort === "year-asc") filtered.sort((a, b) => a.year.localeCompare(b.year));
  else if (sort === "title-asc") filtered.sort((a, b) => a.title.localeCompare(b.title));

  list.innerHTML = filtered.map(formatEntry).join("");
}

function formatEntry(pub) {
  const apa = `<li><span class="author">${pub.author}</span> (${pub.year}). <span class="title">${pub.title}</span>. <span class="journal">${pub.journal || ''}</span>${pub.doi ? ` <a href="https://doi.org/${pub.doi}" target="_blank">DOI</a>` : ''}</li>`;
  const mla = `<li><span class="author">${pub.author}</span>. "<span class="title">${pub.title}</span>." <span class="journal">${pub.journal || ''}</span>, ${pub.year}.${pub.doi ? ` <a href="https://doi.org/${pub.doi}" target="_blank">DOI</a>` : ''}</li>`;
  return currentStyle === "apa" ? apa : mla;
}

// Event listeners
yearFilter.addEventListener("change", render);
authorFilter.addEventListener("change", render);
tagFilter.addEventListener("change", render);
sortSelect.addEventListener("change", render);
toggleStyleBtn.addEventListener("click", () => {
  currentStyle = currentStyle === "apa" ? "mla" : "apa";
  list.className = `publication-list ${currentStyle}`;
  toggleStyleBtn.textContent = currentStyle === "apa" ? "Switch to MLA Style" : "Switch to APA Style";
  render();
});

document.getElementById("load-json").addEventListener("click", loadFromJSON);
document.getElementById("load-bibtex").addEventListener("click", loadFromBibTeX);

// Optionally load JSON by default
// loadFromJSON();
