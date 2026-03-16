import React, { useEffect } from 'react';
import './StaticPage.css';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="static-page animate-fade-in">
      <div className="static-container">
        <header className="static-header">
          <div className="static-badge">Legal</div>
          <h1 className="static-title">Terms of Service</h1>
          <p className="static-subtitle">
            The rules and guidelines for using the README Localizer platform.
          </p>
        </header>

        <div className="static-content">
          <div className="prose">
            <p>Last Updated: March 16, 2026</p>
            
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using README Localizer, you agree to be bound by these Terms of Service. 
              If you do not agree to all the terms and conditions, then you may not access the website 
              or use any services.
            </p>

            <h2>Use of Service</h2>
            <p>
              README Localizer provides a platform for localizing documentation. You are responsible for 
              all content you submit for translation and ensuring you have the necessary rights to that 
              content.
            </p>

            <h3>User Responsibilities</h3>
            <ul>
              <li>You must be at least 13 years old to use this service.</li>
              <li>You must provide accurate and complete registration information.</li>
              <li>You are responsible for maintaining the security of your account and password.</li>
              <li>You may not use the service for any illegal or unauthorized purpose.</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              You retain all ownership rights to the content you submit. README Localizer does not 
              claim any ownership of your documentation. By using the service, you grant us a 
              temporary license to process and translate your content.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              In no event shall README Localizer, nor its directors, employees, or partners, be 
              liable for any indirect, incidental, special, consequential or punitive damages, including 
              without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" 
              and "AS AVAILABLE" basis. Translations provided by AI models may not always be 
              100% accurate or context-aware.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at 
              any time. We will provide notice via our website if changes are significant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
