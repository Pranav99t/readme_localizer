import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownRenderer.css';

export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className: codeClassName, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const language = match ? match[1] : '';

            if (!inline) {
              return (
                <div className="code-block-wrapper">
                  {language && (
                    <div className="code-block-header">
                      <span className="code-lang-badge">{language}</span>
                      <button
                        className="code-copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(String(children));
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="4" y="4" width="8" height="8" rx="1.5" />
                          <path d="M10 4V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5.5A1.5 1.5 0 003 10h1" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  )}
                  <pre className={`code-block ${language ? `language-${language}` : ''}`}>
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },
          h1: ({ children }) => <h1 className="md-heading md-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="md-heading md-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="md-heading md-h3">{children}</h3>,
          h4: ({ children }) => <h4 className="md-heading md-h4">{children}</h4>,
          h5: ({ children }) => <h5 className="md-heading md-h5">{children}</h5>,
          h6: ({ children }) => <h6 className="md-heading md-h6">{children}</h6>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="md-link">
              {children}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginLeft: '2px', display: 'inline' }}>
                <path d="M4 8L8 4M8 4H5M8 4v3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ),
          table: ({ children }) => (
            <div className="table-wrapper">
              <table className="md-table">{children}</table>
            </div>
          ),
          blockquote: ({ children }) => (
            <blockquote className="md-blockquote">{children}</blockquote>
          ),
          ul: ({ children }) => <ul className="md-list">{children}</ul>,
          ol: ({ children }) => <ol className="md-list md-list-ordered">{children}</ol>,
          img: ({ src, alt }) => (
            <div className="md-image-wrapper">
              <img src={src} alt={alt} className="md-image" loading="lazy" />
              {alt && <span className="md-image-caption">{alt}</span>}
            </div>
          ),
          hr: () => <hr className="md-hr" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
