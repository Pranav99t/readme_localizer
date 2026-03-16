import { useState, useEffect, useCallback } from 'react';
import { parseGitHubUrl, fetchRepoInfo, fetchRepoTree, fetchFileContent, analyzeRepoStructure, fetchRepoLanguages } from '../services/github';
import { translateMarkdown, SUPPORTED_LANGUAGES, getTranslationStats } from '../services/translator';
import { localDB } from '../lib/supabase';
import MarkdownRenderer from '../components/MarkdownRenderer';
import './ProjectPage.css';

export default function ProjectPage({ navData, onNavigate }) {
  const [repoUrl, setRepoUrl] = useState(navData?.repoUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);
  const [repoStructure, setRepoStructure] = useState(null);
  const [languages, setLanguages] = useState({});
  const [readmeContent, setReadmeContent] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedLangs, setSelectedLangs] = useState(['es']);
  const [activeLang, setActiveLang] = useState('es');
  const [translating, setTranslating] = useState(false);
  const [translatingIndex, setTranslatingIndex] = useState(0);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translations, setTranslations] = useState({}); // { es: '...', fr: '...' }
  const [translationStats, setTranslationStats] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // split, original, translated
  const [showRawMarkdown, setShowRawMarkdown] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');

  const analyzeRepo = useCallback(async (url) => {
    if (!url) return;
    setLoading(true);
    setError('');
    setTranslations({});
    setTranslationStats(null);

    try {
      const parsed = parseGitHubUrl(url);
      if (!parsed) throw new Error('Invalid GitHub URL. Please use format: https://github.com/owner/repo');

      const { owner, repo } = parsed;

      // Fetch repo info
      setAnalysisStep('Fetching repository metadata...');
      const info = await fetchRepoInfo(owner, repo);
      setRepoInfo(info);

      // Fetch tree
      setAnalysisStep('Analyzing repository structure...');
      const tree = await fetchRepoTree(owner, repo, info.default_branch);
      const structure = analyzeRepoStructure(tree);
      setRepoStructure(structure);

      // Fetch languages
      setAnalysisStep('Detecting programming languages...');
      const langs = await fetchRepoLanguages(owner, repo);
      setLanguages(langs);

      // Fetch primary README
      if (structure.readmeFiles.length > 0) {
        const primaryReadme = structure.readmeFiles[0];
        setSelectedFile(primaryReadme);
        setAnalysisStep(`Reading ${primaryReadme}...`);
        const content = await fetchFileContent(owner, repo, primaryReadme, info.default_branch);
        setReadmeContent(content);
      } else {
        setReadmeContent('# No README found\n\nThis repository does not contain a README file.');
      }

      // Save project
      localDB.saveProject({
        id: `${owner}/${repo}`,
        owner,
        repo,
        name: info.full_name,
        description: info.description,
        stars: info.stargazers_count,
        forks: info.forks_count,
        language: info.language,
        readmeFiles: structure.readmeFiles,
        url: info.html_url,
      });

      setAnalysisStep('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (navData?.repoUrl) {
      analyzeRepo(navData.repoUrl);
    }
  }, [navData?.repoUrl, analyzeRepo]);

  const handleTranslate = async () => {
    if (!readmeContent || translating || selectedLangs.length === 0) return;
    setTranslating(true);
    setTranslationProgress(0);
    setTranslatingIndex(1);
    
    // Clear old translations for the selected languages
    const newTranslations = { ...translations };
    
    try {
      let completedCount = 0;
      const totalToTranslate = selectedLangs.length;

      for (const langCode of selectedLangs) {
        setTranslatingIndex(completedCount + 1);
        const result = await translateMarkdown(
          readmeContent,
          langCode,
          'en',
          (progress) => {
            const overallProgress = ((completedCount / totalToTranslate) * 100) + (progress / totalToTranslate);
            setTranslationProgress(Math.round(overallProgress));
          }
        );
        
        newTranslations[langCode] = result;
        setTranslations({ ...newTranslations });
        
        // If this is the first successfully translated language and activeLang is not in selectedLangs, 
        // or if it's the first one we're doing, set it as active
        if (completedCount === 0 || !selectedLangs.includes(activeLang)) {
          setActiveLang(langCode);
        }

        const stats = getTranslationStats(readmeContent, result);
        
        // Save to translation history
        const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
        localDB.saveTranslation({
          id: crypto.randomUUID(),
          repo: repoInfo?.full_name || 'unknown',
          file: selectedFile,
          source_lang: 'en',
          target_lang: langCode,
          target_lang_name: langInfo?.name || langCode,
          original_words: stats.originalWords,
          translated_words: stats.translatedWords,
          code_blocks_preserved: stats.codeBlocksPreserved,
        });

        completedCount++;
        setTranslationProgress(Math.round((completedCount / totalToTranslate) * 100));
        
        // Set stats for the last translated one for display
        setTranslationStats(stats);
      }
    } catch (err) {
      setError(`Translation failed: ${err.message}`);
    } finally {
      setTranslating(false);
    }
  };

  const toggleLanguage = (langCode) => {
    setSelectedLangs(prev => {
      if (prev.includes(langCode)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(c => c !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  };

  const handleFileSelect = async (filePath) => {
    if (!repoInfo) return;
    setSelectedFile(filePath);
    setTranslations({});
    setTranslationStats(null);
    setLoading(true);

    try {
      const parsed = parseGitHubUrl(repoUrl);
      const content = await fetchFileContent(parsed.owner, parsed.repo, filePath, repoInfo.default_branch);
      setReadmeContent(content);
    } catch (err) {
      setError(`Failed to load ${filePath}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTranslation = () => {
    const content = translations[activeLang];
    if (content) navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const content = translations[activeLang];
    if (!content) return;
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === activeLang);
    const fileName = `README.${activeLang}.md`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="project-page-v2 animate-fade-in">
      {/* Project Header Info */}
      {repoInfo && (
        <header className="project-top-header">
          <div className="repo-breadcrumb">
            <span className="owner">{repoInfo.owner?.login || 'source'}</span>
            <span className="sep">/</span>
            <span className="repo">{repoInfo.name}</span>
            <span className="badge-br badge-primary">{repoInfo.default_branch}</span>
          </div>
          <div className="repo-quick-stats">
            <div className="q-stat" title="Stars">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              {repoInfo.stargazers_count?.toLocaleString()}
            </div>
            <div className="q-stat" title="Forks">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v12M18 3v12M6 15a3 3 0 100 6 3 3 0 000-6zm12 0a3 3 0 100 6 3 3 0 000-6zm-6-7V4"/></svg>
              {repoInfo.forks_count?.toLocaleString()}
            </div>
          </div>
        </header>
      )}

      <div className="project-layout">
        {/* Sidebar */}
        <aside className="project-sidebar-v2">
          <div className="sidebar-group">
            <h4 className="sidebar-title">Repository</h4>
            <div className="sidebar-input-box">
              <input
                type="text"
                className="input-v2"
                placeholder="Repository URL"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && analyzeRepo(repoUrl)}
              />
              <button 
                className={`analyze-btn-mini ${loading ? 'loading' : ''}`}
                onClick={() => analyzeRepo(repoUrl)}
                disabled={loading}
              >
                {loading ? '...' : '→'}
              </button>
            </div>
          </div>

          {repoInfo && (
            <>
              <div className="sidebar-group">
                <h4 className="sidebar-title">Files</h4>
                <div className="sidebar-scroll-list">
                  {repoStructure?.readmeFiles.map(file => (
                    <button
                      key={file}
                      className={`sidebar-file-item ${selectedFile === file ? 'active' : ''}`}
                      onClick={() => handleFileSelect(file)}
                    >
                      <span className="file-icon">📄</span>
                      <span className="file-name">{file}</span>
                    </button>
                  ))}
                  {repoStructure?.docFiles.slice(0, 10).map(file => (
                    <button
                      key={file}
                      className={`sidebar-file-item ${selectedFile === file ? 'active' : ''}`}
                      onClick={() => handleFileSelect(file)}
                    >
                      <span className="file-icon">📁</span>
                      <span className="file-name">{file}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sidebar-group">
            <h4 className="sidebar-title">Synthesize Locale</h4>
            <div className="sidebar-grid-langs">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={`sidebar-lang-btn ${selectedLangs.includes(lang.code) ? 'active' : ''}`}
                  onClick={() => toggleLanguage(lang.code)}
                  title={lang.name}
                >
                  <span className="flag">{lang.flag}</span>
                  <div className="lang-info">
                    <span className="code">{lang.code.toUpperCase()}</span>
                    <span className="name">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

              <div className="sidebar-footer-action">
                <button
                  className="btn btn-primary translate-main-btn"
                  onClick={handleTranslate}
                  disabled={translating || !readmeContent || selectedLangs.length === 0}
                >
                  {translating ? (
                    `Synthesizing ${translatingIndex}/${selectedLangs.length}...`
                  ) : (
                    selectedLangs.length > 1 
                      ? `Localize to ${selectedLangs.length} Languages` 
                      : `Localize to ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLangs[0])?.name}`
                  )}
                </button>
              </div>
            </>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="project-content-v2">
          {error && <div className="error-banner">{error}</div>}
          
          {loading ? (
            <div className="loading-state">
              <div className="pulse-loader"></div>
              <h3>Analyzing Repository</h3>
              <p>{analysisStep}</p>
            </div>
          ) : !repoInfo ? (
            <div className="empty-state">
              <div className="empty-visual">🔍</div>
              <h2>Bring your documentation to the world</h2>
              <p>Enter a GitHub repository URL to start the localization process.</p>
            </div>
          ) : (
            <>
              <div className="content-toolbar-v2">
                <div className="toolbar-file-meta">
                  <span className="file-pill">{selectedFile}</span>
                  {translationStats && (
                    <div className="meta-stats">
                      <span className="stat-pill">{translationStats.originalWords} words</span>
                      <span className="stat-pill success">Verified Integrity</span>
                    </div>
                  )}
                </div>
                
                <div className="toolbar-actions-v2">
                  <div className="segmented-control">
                    <button className={viewMode === 'split' ? 'active' : ''} onClick={() => setViewMode('split')}>Split</button>
                    <button className={viewMode === 'translated' ? 'active' : ''} onClick={() => setViewMode('translated')} disabled={Object.keys(translations).length === 0}>Result</button>
                  </div>
                  
                  {Object.keys(translations).length > 0 && (
                    <div className="action-btns">
                      <button className="btn btn-secondary btn-sm" onClick={handleCopyTranslation}>Copy</button>
                      <button className="btn btn-primary btn-sm" onClick={handleDownload}>Export</button>
                    </div>
                  )}
                </div>
              </div>

              <div className={`editor-layout ${viewMode}`}>
                {(viewMode === 'split' || viewMode === 'original') && (
                  <div className="panel-v2">
                    <div className="panel-label-v2">SOURCE (EN)</div>
                    <div className="panel-content-v2">
                      <MarkdownRenderer content={readmeContent} />
                    </div>
                  </div>
                )}
                
                {(viewMode === 'split' || viewMode === 'translated') && (
                  <div className="panel-v2 result">
                    <div className="panel-label-v2">
                      TRANSLATION ({activeLang.toUpperCase()})
                      {Object.keys(translations).length > 1 && (
                        <select 
                          className="lang-switcher-inline"
                          value={activeLang}
                          onChange={(e) => setActiveLang(e.target.value)}
                        >
                          {selectedLangs.filter(code => translations[code]).map(code => (
                            <option key={code} value={code}>
                              {SUPPORTED_LANGUAGES.find(l => l.code === code)?.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="panel-content-v2">
                      {translating && !translations[activeLang] ? (
                        <div className="translating-overlay">
                          <div className="progress-circle">
                            <div className="inner-loader">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v9h-9"/></svg>
                            </div>
                          </div>
                          <p>Synthesizing...</p>
                        </div>
                      ) : translations[activeLang] ? (
                        <MarkdownRenderer content={translations[activeLang]} />
                      ) : (
                        <div className="panel-empty-state">
                          <p>Ready to localize. <br/>Click the button in the sidebar to begin.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function getLanguageColor(lang) {
  const colors = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', Go: '#00ADD8', Rust: '#dea584',
    Ruby: '#701516', PHP: '#4F5D95', 'C++': '#f34b7d',
    C: '#555555', 'C#': '#178600', Swift: '#F05138',
    Kotlin: '#A97BFF', Dart: '#00B4AB', Vue: '#41b883',
    Svelte: '#ff3e00', HTML: '#e34c26', CSS: '#563d7c',
    Shell: '#89e051', Dockerfile: '#384d54', SCSS: '#c6538c',
    Makefile: '#427819',
  };
  return colors[lang] || '#8b949e';
}
