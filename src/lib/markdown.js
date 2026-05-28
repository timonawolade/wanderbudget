export function formatMarkdown(text) {
  if (!text) return [];
  const lines = text.split("\n");
  const elements = [];
  let listItems = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push({
        type: "ul",
        key: `list-${key++}`,
        items: [...listItems],
      });
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      flushList();
      elements.push({ type: "h3", key: `h3-${key++}`, text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push({ type: "h2", key: `h2-${key++}`, text: line.slice(3) });
    } else if (line.startsWith("# ")) {
      flushList();
      elements.push({ type: "h1", key: `h1-${key++}`, text: line.slice(2) });
    } else if (/^[-•*]\s/.test(line)) {
      listItems.push({ key: `li-${key++}`, text: line.replace(/^[-•*]\s/, "") });
    } else if (line.startsWith("---")) {
      flushList();
      elements.push({ type: "hr", key: `hr-${key++}` });
    } else if (line.trim() === "") {
      flushList();
      elements.push({ type: "spacer", key: `sp-${key++}` });
    } else {
      flushList();
      elements.push({ type: "p", key: `p-${key++}`, text: line });
    }
  }
  flushList();
  return elements;
}

export function renderInlineFormatting(str) {
  if (!str) return str;
  const parts = [];
  let remaining = str;
  let k = 0;
  const regex = /\*\*(.+?)\*\*/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(remaining.slice(lastIndex, match.index));
    }
    parts.push(`<strong>${match[1]}</strong>`);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < remaining.length) {
    parts.push(remaining.slice(lastIndex));
  }
  return parts.join("");
}
