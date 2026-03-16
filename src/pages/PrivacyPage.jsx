import React, { useEffect } from 'react';
import './StaticPage.css';

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="static-page animate-fade-in">
      <div className="static-container">
        <header className="static-header">
          <div className="static-badge">Trust & Safety</div>
          <h1 className="static-title">Privacy Policy</h1>
          <p className="static-subtitle">
            Your privacy is important to us. Here's how we handle your data and repository access.
          </p>
        </header>

        <div className="static-content">
          <div className="prose">
            <p>Last Updated: March 16, 2026</p>
            
            <h2>Introduction</h2>
            <p>
              At README Localizer, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your data when you visit our 
              website and tell you about your privacy rights.
            </p>

            <h2>Data We Collect</h2>
            <h3>Account Information</h3>
            <p>
              When you sign up via GitHub or email, we collect basic profile information such as your name, 
              email address, and avatar. This is used solely for authentication and account management.
            </p>

            <h3>Repository Data</h3>
            <p>
              When you authorize us to access your GitHub repositories, we only read the content necessary 
              to perform translations (specifically README files and other documentation). We do not store 
              your source code on our servers beyond the duration of the translation process.
            </p>

            <h2>How We Use Your Data</h2>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
            </ul>

            <h2>Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission 
              over the Internet, or method of electronic storage is 100% secure. We strive to use 
              commercially acceptable means to protect your Personal Data.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              We use third-party translation providers (like Lingo.dev) to process your localization 
              requests. These providers do not receive any of your personal identification data, only 
              the text content to be translated.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at 
              support@readmelocalizer.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
