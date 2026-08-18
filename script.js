const content = document.getElementById("readme-content");
const toc = document.getElementById("toc");
const tocSearch = document.getElementById("toc-search");
const tocEmpty = document.getElementById("toc-empty");
const tocPanel = document.querySelector(".toc-panel");
const readProgress = document.getElementById("read-progress");
const currentYear = document.getElementById("current-year");
const backToTop = document.querySelector(".back-to-top");

if (currentYear) {
  const year = String(new Date().getFullYear());
  currentYear.textContent = year;
  currentYear.setAttribute("datetime", year);
}

backToTop?.addEventListener("click", (event) => {
  event.preventDefault();
  document.documentElement.classList.add("no-smooth-scroll");
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    document.documentElement.classList.remove("no-smooth-scroll");
  });
});

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeSearchValue = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const renderInline = (value) => {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return output;
};

const closeList = (state, html) => {
  if (state.listOpen) {
    html.push(`</${state.listType}>`);
    state.listOpen = false;
    state.listType = "";
  }
};

const isTableDivider = (line) =>
  /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);

const splitTableRow = (line) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

const renderTable = (headerLine, dividerLine, rows) => {
  if (!isTableDivider(dividerLine)) return null;

  const headers = splitTableRow(headerLine);
  if (!headers.length) return null;

  const bodyRows = rows
    .filter((row) => row.trim().startsWith("|"))
    .map(splitTableRow)
    .filter((cells) => cells.length);

  const headHtml = headers
    .map((header) => `<th>${renderInline(header)}</th>`)
    .join("");
  const bodyHtml = bodyRows
    .map((cells) => {
      const cellsHtml = headers
        .map((_header, index) => `<td>${renderInline(cells[index] || "")}</td>`)
        .join("");
      return `<tr>${cellsHtml}</tr>`;
    })
    .join("");

  return `<div class="table-wrap"><table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
};

const renderMarkdown = (markdown) => {
  const html = [];
  const headings = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const state = { listOpen: false, listType: "" };
  let inCode = false;
  let codeBuffer = [];
  let codeLanguage = "";

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trimEnd();
    const fence = line.match(/^```(\w+)?\s*$/);

    if (fence) {
      if (inCode) {
        html.push(`<pre><code class="language-${escapeHtml(codeLanguage)}">${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
        codeBuffer = [];
        codeLanguage = "";
        inCode = false;
      } else {
        closeList(state, html);
        inCode = true;
        codeLanguage = fence[1] || "";
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      closeList(state, html);
      continue;
    }

    const nextLine = lines[index + 1] || "";
    if (line.trim().startsWith("|") && isTableDivider(nextLine)) {
      closeList(state, html);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(lines[index]);
        index += 1;
      }
      index -= 1;

      const tableHtml = renderTable(line, nextLine, rows);
      if (tableHtml) {
        html.push(tableHtml);
        continue;
      }
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList(state, html);
      const level = heading[1].length;
      const text = heading[2].trim();
      const baseId = slugify(text) || `section-${headings.length + 1}`;
      let id = baseId;
      let suffix = 2;
      while (headings.some((item) => item.id === id)) {
        id = `${baseId}-${suffix}`;
        suffix += 1;
      }
      headings.push({ id, text, level });
      html.push(`<h${level} id="${id}">${renderInline(text)}</h${level}>`);
      continue;
    }

    const bullet = line.match(/^\s*-\s+(.+)$/);
    if (bullet) {
      if (!state.listOpen || state.listType !== "ul") {
        closeList(state, html);
        html.push("<ul>");
        state.listOpen = true;
        state.listType = "ul";
      }
      html.push(`<li>${renderInline(bullet[1])}</li>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (ordered) {
      if (!state.listOpen || state.listType !== "ol") {
        closeList(state, html);
        html.push("<ol>");
        state.listOpen = true;
        state.listType = "ol";
      }
      html.push(`<li>${renderInline(ordered[1])}</li>`);
      continue;
    }

    closeList(state, html);
    html.push(`<p>${renderInline(line.trim())}</p>`);
  }

  closeList(state, html);
  return { html: html.join("\n"), headings };
};

const renderToc = (headings) => {
  const visibleHeadings = headings.filter((heading) => heading.level === 2 || heading.level === 3);
  toc.innerHTML = visibleHeadings
    .map((heading) => {
      const searchableText = normalizeSearchValue(`${heading.text} ${heading.id.replace(/-/g, " ")}`);
      return `<a class="depth-${heading.level}" href="#${heading.id}" data-section-text="${escapeHtml(searchableText)}">${escapeHtml(heading.text)}</a>`;
    })
    .join("");
};

const filterToc = () => {
  if (!toc) return;
  const query = normalizeSearchValue(tocSearch?.value || "");
  let visibleCount = 0;
  toc.querySelectorAll("a").forEach((link) => {
    const text = link.dataset.sectionText || "";
    const isHidden = query && !text.includes(query);
    link.hidden = isHidden;
    if (!isHidden) visibleCount += 1;
  });
  if (tocEmpty) {
    tocEmpty.hidden = visibleCount > 0;
  }
};

const keepTocLinkInView = (link) => {
  if (!tocPanel || !link || link.hidden) return;

  const panelRect = tocPanel.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  const panelStyle = window.getComputedStyle(tocPanel);
  const panelPaddingTop = parseFloat(panelStyle.paddingTop) || 0;
  const panelPaddingBottom = parseFloat(panelStyle.paddingBottom) || 0;
  const visibleTop = panelRect.top + panelPaddingTop;
  const visibleBottom = panelRect.bottom - panelPaddingBottom;

  if (linkRect.top < visibleTop) {
    tocPanel.scrollTop -= visibleTop - linkRect.top;
  } else if (linkRect.bottom > visibleBottom) {
    tocPanel.scrollTop += linkRect.bottom - visibleBottom;
  }
};

const setActiveTocLink = (id) => {
  let activeLink = null;
  toc.querySelectorAll("a").forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);
    if (isActive) {
      activeLink = link;
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
  keepTocLinkInView(activeLink);
};

const observeHeadings = () => {
  const headings = Array.from(content.querySelectorAll("h2, h3"));
  if (!headings.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible[0]?.target?.id) {
        setActiveTocLink(visible[0].target.id);
      }
    },
    {
      rootMargin: "-24% 0px -68% 0px",
      threshold: 0,
    },
  );

  headings.forEach((heading) => observer.observe(heading));
};

const updateReadProgress = () => {
  if (!readProgress) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
  readProgress.style.transform = `scaleX(${progress / 100})`;
};

tocSearch?.addEventListener("input", filterToc);
tocSearch?.addEventListener("search", filterToc);
window.addEventListener("scroll", updateReadProgress, { passive: true });
window.addEventListener("resize", updateReadProgress);

fetch("README.md", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`README request failed with ${response.status}`);
    }
    return response.text();
  })
  .then((markdown) => {
    const rendered = renderMarkdown(markdown);
    content.innerHTML = rendered.html;
    renderToc(rendered.headings);
    filterToc();
    observeHeadings();
    updateReadProgress();
  })
  .catch(() => {
    content.innerHTML = '<p>README.md could not be loaded. Open the Markdown file directly from the toolbar.</p>';
    toc.innerHTML = '<a href="README.md">Open README.md</a>';
  });
