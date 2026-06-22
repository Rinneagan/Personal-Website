'use client';

import React from 'react';

interface CodeHighlighterProps {
  code: string;
  language: 'go' | 'python' | 'typescript' | 'rust' | 'cpp' | 'bash' | 'markdown' | 'javascript';
}

// A simple, high-performance regex-based syntax highlighter for Dracula/Monospace theme
export function CodeHighlighter({ code, language }: CodeHighlighterProps) {
  const highlight = (txt: string, lang: string) => {
    // Escape HTML special characters first
    let escaped = txt
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Keywords based on language
    const goKeywords = /\b(package|import|func|type|struct|const|var|return|defer|go|select|chan|map|range|if|else|for|switch|case|iota|interface|int|string|bool|float64|nil)\b/g;
    const pyKeywords = /\b(def|class|import|from|as|return|if|elif|else|for|while|in|is|not|and|or|try|except|raise|with|lambda|True|False|None)\b/g;
    const tsKeywords = /\b(const|let|var|function|return|import|from|export|default|interface|type|class|extends|implements|if|else|for|while|switch|case|break|try|catch|new|this|typeof|any|string|number|boolean|null|undefined|void|set|get)\b/g;
    const rsKeywords = /\b(fn|let|mut|pub|struct|impl|use|mod|struct|enum|match|if|else|for|loop|while|return|impl|trait|self|Self|i32|u32|f64|Option|Some|None|Result|Ok|Err|vec|Vec|Box|Result|std|io|net)\b/g;

    let keywords = tsKeywords;
    if (lang === 'go') keywords = goKeywords;
    else if (lang === 'python') keywords = pyKeywords;
    else if (lang === 'rust') keywords = rsKeywords;

    // Comments
    const commentRegex = /(\/\/.*|#.*)/g;
    // Strings
    const stringRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;
    // Numbers
    const numberRegex = /\b(\d+(?:\.\d+)?)\b/g;
    // Function calls
    const funcCallRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\()/g;

    // Temporary storage to avoid double-matching
    const tokens: string[] = [];
    const pushToken = (content: string, className: string) => {
      const id = `__TOKEN_${tokens.length}__`;
      tokens.push(`<span class="hl-${className}">${content}</span>`);
      return id;
    };

    // Phase 1: Match Strings and hide them
    escaped = escaped.replace(stringRegex, (match) => pushToken(match, 'string'));

    // Phase 2: Match Comments and hide them
    escaped = escaped.replace(commentRegex, (match) => pushToken(match, 'comment'));

    // Phase 3: Match Keywords and wrap
    escaped = escaped.replace(keywords, '<span class="hl-keyword">$1</span>');

    // Phase 4: Match Numbers and wrap
    escaped = escaped.replace(numberRegex, '<span class="hl-number">$1</span>');

    // Phase 5: Match Function names and wrap
    escaped = escaped.replace(funcCallRegex, '<span class="hl-function">$1</span>');

    // Phase 6: Restore comments and strings in reverse order
    for (let i = tokens.length - 1; i >= 0; i--) {
      escaped = escaped.replace(`__TOKEN_${i}__`, tokens[i]);
    }

    return escaped;
  };

  const highlightedHTML = highlight(code, language);

  return (
    <>
      <pre
        style={{
          margin: 0,
          padding: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          lineHeight: '1.5',
          overflowX: 'auto',
          background: '#181816',
          color: '#f8f8f2',
          height: '100%',
        }}
        dangerouslySetInnerHTML={{ __html: highlightedHTML }}
      />
      <style>{`
        .hl-keyword { color: #ff79c6; font-weight: 600; }
        .hl-string { color: #f1fa8c; }
        .hl-comment { color: #6272a4; font-style: italic; }
        .hl-number { color: #bd93f9; }
        .hl-function { color: #50fa7b; }
      `}</style>
    </>
  );
}
