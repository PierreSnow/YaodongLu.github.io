async function loadPublications() {
  const res = await fetch("assets/data/publications.json");
  const pubs = await res.json();

  const list = document.getElementById("pubList");
  const search = document.getElementById("pubSearch");
  const filter = document.getElementById("pubFilter");

  function prettyRole(role) {
    const map = {
      first: "First author",
      corresponding: "Corresponding author",
      second: "Second author",
      coauthor: "Co-author"
    };
    return map[role] || role || "";
  }

  function prettyStatus(status) {
    const map = {
      published: "Published",
      accepted: "Accepted",
      under_review: "Under review",
      in_preparation: "In preparation"
    };
    return map[status] || status || "";
  }

  function render() {
    const q = (search.value || "").toLowerCase().trim();
    const f = filter.value;

    const items = pubs
      .filter(p => {
        const hay = `${p.title} ${p.authors} ${p.venue} ${p.year}`.toLowerCase();
        const okSearch = !q || hay.includes(q);
        const okFilter = (f === "all") || (p.type === f);
        return okSearch && okFilter;
      })
      .sort((a, b) => (b.year || 0) - (a.year || 0));

    list.innerHTML = items.map(p => {
      const links = [
        p.pdf ? `<a href="${p.pdf}" target="_blank" rel="noreferrer">PDF</a>` : "",
        p.video ? `<a href="${p.video}" target="_blank" rel="noreferrer">Video</a>` : "",
        p.code ? `<a href="${p.code}" target="_blank" rel="noreferrer">Code</a>` : "",
        p.doi ? `<a href="${p.doi}" target="_blank" rel="noreferrer">DOI</a>` : ""
      ].filter(Boolean).join(" · ");

      const tags = [
        p.type ? `<span class="tag">${p.type}</span>` : "",
        p.status ? `<span class="tag">${prettyStatus(p.status)}</span>` : "",
        p.role ? `<span class="tag">${prettyRole(p.role)}</span>` : ""
      ].filter(Boolean).join("");

      return `
        <div class="pub">
          <div class="title">${p.title}${tags}</div>
          <div class="authors">${p.authors}</div>
          <div class="venue">${p.venue} · ${p.year}</div>
          ${links ? `<div class="links">${links}</div>` : ""}
        </div>
      `;
    }).join("");
  }

  search.addEventListener("input", render);
  filter.addEventListener("change", render);
  render();
}

document.getElementById("year").textContent = new Date().getFullYear();
loadPublications();
document.getElementById("year").textContent = new Date().getFullYear();
loadPublications();
