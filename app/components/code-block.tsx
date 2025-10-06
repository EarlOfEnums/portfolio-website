import { useState, type CSSProperties } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

// Custom dark theme
const customTheme: { [key: string]: CSSProperties } = {
  'code[class*="language-"]': {
    color: "#abb2bf",
    background: "transparent",
    fontFamily: "var(--font-mono, 'Monaco', 'Courier New', monospace)",
    textAlign: "left" as const,
    whiteSpace: "pre" as const,
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.7",
    fontSize: "0.875rem",
  },
  'pre[class*="language-"]': {
    color: "#abb2bf",
    background: "transparent",
    overflow: "auto",
  },
  comment: { color: "#5c6370", fontStyle: "italic" },
  prolog: { color: "#5c6370" },
  doctype: { color: "#5c6370" },
  cdata: { color: "#5c6370" },
  punctuation: { color: "#abb2bf" },
  property: { color: "#d19a66" },
  tag: { color: "#e06c75" },
  boolean: { color: "#d19a66" },
  number: { color: "#d19a66" },
  constant: { color: "#d19a66" },
  symbol: { color: "#61afef" },
  deleted: { color: "#e06c75" },
  selector: { color: "#98c379" },
  "attr-name": { color: "#d19a66" },
  string: { color: "#98c379" },
  char: { color: "#98c379" },
  builtin: { color: "#e6c07b" },
  inserted: { color: "#98c379" },
  variable: { color: "#e06c75" },
  operator: { color: "#56b6c2" },
  entity: { color: "#61afef", cursor: "help" },
  url: { color: "#56b6c2" },
  ".language-css .token.string": { color: "#56b6c2" },
  ".style .token.string": { color: "#56b6c2" },
  atrule: { color: "#c678dd" },
  "attr-value": { color: "#98c379" },
  keyword: { color: "#c678dd" },
  function: { color: "#61afef" },
  "class-name": { color: "#e6c07b" },
  regex: { color: "#98c379" },
  important: { color: "#c678dd", fontWeight: "bold" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
};

export function CodeBlock({
  code,
  language = "javascript",
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-lg overflow-hidden border border-border bg-sidebar">
      {/* Header with language/filename and copy button */}
      <div className="flex items-center justify-between bg-background px-4 py-2 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">
          {filename || language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-xs rounded hover:bg-accent/40 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content with syntax highlighting */}
      <SyntaxHighlighter
        language={language}
        style={customTheme}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
