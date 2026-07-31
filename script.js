const content = document.getElementById("readme-content");
const toc = document.getElementById("toc");

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

const renderInline = (value) => {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return output;
};

const closeList = (state, html) => {
  if (state.listOpen) {
    html.push("</ul>");
    state.listOpen = false;
  }
};

const renderMarkdown = (markdown) => {
  const html = [];
  const headings = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const state = { listOpen: false };
  let inCode = false;
  let codeBuffer = [];
  let codeLanguage = "";

  for (const rawLine of lines) {
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
      if (!state.listOpen) {
        html.push("<ul>");
        state.listOpen = true;
      }
      html.push(`<li>${renderInline(bullet[1])}</li>`);
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
    .map((heading) => `<a class="depth-${heading.level}" href="#${heading.id}">${escapeHtml(heading.text)}</a>`)
    .join("");
};

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
  })
  .catch(() => {
    content.innerHTML = '<p>README.md could not be loaded. Open the Markdown file directly from the toolbar.</p>';
    toc.innerHTML = '<a href="README.md">Open README.md</a>';
  });
