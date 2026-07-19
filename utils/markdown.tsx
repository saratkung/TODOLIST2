import type { ReactNode } from "react";

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

/** Renders a small safe subset of Markdown: headers, bold, italic, lists. */
export function renderMarkdownLite(content: string): ReactNode[] {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let listBuffer: string[] = [];

  function flushList(key: string) {
    if (listBuffer.length === 0) return;
    nodes.push(
      <ul key={key} className="list-disc space-y-0.5 pl-5">
        {listBuffer.map((item, i) => (
          <li key={i}>{parseInline(item, `${key}-${i}`)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  }

  lines.forEach((line, index) => {
    const key = `l-${index}`;
    if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
      return;
    }
    flushList(`ul-${key}`);

    if (line.startsWith("### ")) {
      nodes.push(<h3 key={key} className="text-sm font-semibold">{parseInline(line.slice(4), key)}</h3>);
    } else if (line.startsWith("## ")) {
      nodes.push(<h2 key={key} className="text-base font-semibold">{parseInline(line.slice(3), key)}</h2>);
    } else if (line.startsWith("# ")) {
      nodes.push(<h1 key={key} className="text-lg font-semibold">{parseInline(line.slice(2), key)}</h1>);
    } else if (line.trim() === "") {
      nodes.push(<div key={key} className="h-2" />);
    } else {
      nodes.push(<p key={key} className="leading-relaxed">{parseInline(line, key)}</p>);
    }
  });

  flushList("ul-end");
  return nodes;
}
