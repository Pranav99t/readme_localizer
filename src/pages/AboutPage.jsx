import React, { useEffect } from 'react';
import './StaticPage.css';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="static-page animate-fade-in">
      <div className="static-container">
        <header className="static-header">
          <div className="static-badge">Our Mission</div>
          <h1 className="static-title">Breaking Language Barriers in Software Development</h1>
          <p className="static-subtitle">
            README Localizer is dedicated to making software documentation accessible to developers, 
            regardless of what language they speak.
          </p>
        </header>

        <div className="static-content">
          <div className="prose">
            <h2>The Vision</h2>
            <p>
              We believe that great software should be accessible to everyone. In the global tech ecosystem, 
              English has long been the primary language for documentation. However, this creates a significant 
              barrier for millions of talented developers worldwide.
            </p>
            <p>
              README Localizer was born out of the need to democratize access to technology. By leveraging 
              state-of-the-art AI translation engines, we enable project maintainers to localize their 
              documentation in seconds rather than days.
            </p>

            <h2>How It Works</h2>
            <p>
              The platform connects directly to your GitHub repositories or accepts raw Markdown content. 
              It uses a specialized localization engine that understands code context, preserving syntax 
              and technical terms while accurately translating the descriptive text.
            </p>

            <h2>About the Developer</h2>
            <p>
              I am an individual developer and language enthusiast who believes in the power of accessible technology. 
              Built with love and powered by the Lingo.dev Localization Engine, README Localizer is my 
              contribution to a more inclusive developer community.
            </p>

            <h2>Developer First</h2>
            <p>
              I am committed to supporting the developer community. The core features are designed to 
              help project maintainers grow their projects by reaching non-English speaking contributors and users 
              across Asia, Europe, Latin America, and beyond.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
