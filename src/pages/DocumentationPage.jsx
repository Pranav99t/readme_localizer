import React, { useEffect } from 'react';
import './StaticPage.css';

const DocumentationPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="static-page animate-fade-in">
      <div className="static-container">
        <header className="static-header">
          <div className="static-badge">User Manual</div>
          <h1 className="static-title">Product Documentation</h1>
          <p className="static-subtitle">
            Master README Localizer with our comprehensive guide to translating and managing your documentation.
          </p>
        </header>

        <div className="static-content">
          <div className="prose">
            <div className="doc-section">
              <h2>Quick Start Guide</h2>
              <div className="doc-card">
                <div className="doc-icon">🚀</div>
                <h3>1. Connect Your Repository</h3>
                <p>
                  Sign in with GitHub to allow README Localizer to view your public and private repositories. 
                  Don't worry, we only read the documentation files.
                </p>
              </div>

              <div className="doc-card">
                <div className="doc-icon">🌐</div>
                <h3>2. Select Languages</h3>
                <p>
                  Choose from over 30+ supported languages. You can select multiple target languages at 
                  once to create a comprehensive multi-lingual documentation suite.
                </p>
              </div>

              <div className="doc-card">
                <div className="doc-icon">✨</div>
                <h3>3. Localize & Review</h3>
                <p>
                  Our engine processes your documentation while preserving code snippets, badges, and 
                  Markdown formatting. Review the results in our side-by-side editor.
                </p>
              </div>
            </div>

            <h2>Features in Depth</h2>
            
            <h3>Smart Context Protection</h3>
            <p>
              Unlike generic translation tools, README Localizer understands Markdown. It identifies 
              <code>`code blocks`</code>, <code>images</code>, and <code>links</code>, ensuring they 
              remain functional and unchanged while the surrounding text is localized.
            </p>

            <h3>Translation History</h3>
            <p>
              Every translation you perform is saved in your dashboard. You can revisit past 
              translations, re-download them, or update them when your source documentation changes.
            </p>

            <h3>Language Support</h3>
            <p>
              We support a wide range of languages including:
            </p>
            <ul>
              <li><strong>Asia:</strong> Hindi, Mandarin, Japanese, Korean, Vietnamese</li>
              <li><strong>Europe:</strong> Spanish, French, German, Italian, Portuguese</li>
              <li><strong>And many more...</strong></li>
            </ul>

            <h2>Best Practices</h2>
            <ul>
              <li><strong>Keep Markdown clean:</strong> Use standard Markdown syntax for best results.</li>
              <li><strong>Avoid embedded HTML:</strong> While we support it, many translation engines handle pure Markdown better.</li>
              <li><strong>Use Descriptive Headers:</strong> Clear headers help the AI understand the structure of your document.</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            <div className="doc-card">
              <h3>Is my source code safe?</h3>
              <p>
                Absolutely. We only access the files you specify. We do not store your code beyond the 
                active translation session.
              </p>
            </div>
            <div className="doc-card">
              <h3>Can I translate private repos?</h3>
              <p>
                Yes, if you grant the necessary permissions during the GitHub OAuth process, you can 
                access and translate documentation in your private repositories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
