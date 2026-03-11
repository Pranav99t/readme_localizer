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
  const [selectedLang, setSelectedLang] = useState('es');
  const [translating, setTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translatedContent, setTranslatedContent] = useState('');
  const [translationStats, setTranslationStats] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // split, original, translated
  const [showRawMarkdown, setShowRawMarkdown] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');

  const analyzeRepo = useCallback(async (url) => {
    if (!url) return;
    setLoading(true);
    setError('');
    setTranslatedContent('');
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
    if (!readmeContent || translating) return;
    setTranslating(true);
    setTranslationProgress(0);
    setTranslatedContent('');

    try {
      const result = await translateMarkdown(
        readmeContent,
        selectedLang,
        'en',
        (progress) => setTranslationProgress(progress)
      );
      setTranslatedContent(result);

      const stats = getTranslationStats(readmeContent, result);
      setTranslationStats(stats);

      // Save to translation history
      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
      localDB.saveTranslation({
        id: crypto.randomUUID(),
        repo: repoInfo?.full_name || 'unknown',
        file: selectedFile,
        source_lang: 'en',
        target_lang: selectedLang,
        target_lang_name: langInfo?.name || selectedLang,
        original_words: stats.originalWords,
        translated_words: stats.translatedWords,
        code_blocks_preserved: stats.codeBlocksPreserved,
      });
    } catch (err) {
      setError(`Translation failed: ${err.message}`);
    } finally {
      setTranslating(false);
    }
  };

  const handleFileSelect = async (filePath) => {
    if (!repoInfo) return;
    setSelectedFile(filePath);
    setTranslatedContent('');
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
    navigator.clipboard.writeText(translatedContent);
  };

  const handleDownload = () => {
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
    const fileName = `README.${selectedLang}.md`;
    const blob = new Blob([translatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
  const totalLangBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  return (
    <div className="project-page">
      {/* Sidebar */}
      <aside className="project-sidebar">
        <div className="sidebar-section">
          <label className="sidebar-label">Repository URL</label>
          <div className="sidebar-input-row">
            <input
              type="text"
              className="input input-mono"
              placeholder="github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyzeRepo(repoUrl)}
            />
            <button
              className="btn btn-primary btn-icon"
              onClick={() => analyzeRepo(repoUrl)}
              disabled={loading}
              title="Analyze"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 9h10M10 5l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {repoInfo && (
          <>
            {/* Repo Info Card */}
            <div className="sidebar-section">
              <div className="repo-card animate-fade-in">
                <div className="repo-card-header">
                  <div className="repo-avatar">
                    <img src={repoInfo.owner?.avatar_url} alt="" />
                  </div>
                  <div>
                    <div className="repo-name">{repoInfo.name}</div>
                    <div className="repo-owner">{repoInfo.owner?.login}</div>
                  </div>
                </div>
                {repoInfo.description && (
                  <p className="repo-desc">{repoInfo.description}</p>
                )}
                <div className="repo-meta">
                  <span className="repo-meta-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M7 1l1.8 3.6L13 5.2 9.95 8.1l.7 4.2L7 10.3 3.35 12.3l.7-4.2L1 5.2l4.2-.6L7 1z" />
                    </svg>
                    {repoInfo.stargazers_count?.toLocaleString()}
                  </span>
                  <span className="repo-meta-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 1v4M10 1v4M4 9v4M7 5a3 3 0 013 3v1M7 5a3 3 0 00-3 3v1" strokeLinecap="round" />
                    </svg>
                    {repoInfo.forks_count?.toLocaleString()}
                  </span>
                  {repoInfo.language && (
                    <span className="repo-meta-item">
                      <span className="lang-dot" style={{ background: getLanguageColor(repoInfo.language) }}></span>
                      {repoInfo.language}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Language Stats */}
            {Object.keys(languages).length > 0 && (
              <div className="sidebar-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <label className="sidebar-label">Languages</label>
                <div className="lang-bar">
                  {Object.entries(languages).slice(0, 6).map(([lang, bytes]) => (
                    <div
                      key={lang}
                      className="lang-bar-segment"
                      style={{
                        width: `${(bytes / totalLangBytes) * 100}%`,
                        background: getLanguageColor(lang),
                      }}
                      title={`${lang}: ${((bytes / totalLangBytes) * 100).toFixed(1)}%`}
                    />
                  ))}
                </div>
                <div className="lang-list">
                  {Object.entries(languages).slice(0, 4).map(([lang, bytes]) => (
                    <div key={lang} className="lang-list-item">
                      <span className="lang-dot" style={{ background: getLanguageColor(lang) }}></span>
                      <span className="lang-name">{lang}</span>
                      <span className="lang-pct">{((bytes / totalLangBytes) * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {repoStructure && (
              <div className="sidebar-section animate-fade-in" style={{ animationDelay: '0.15s' }}>
                <label className="sidebar-label">
                  Documentation Files
                  <span className="badge badge-primary" style={{ marginLeft: '8px' }}>
                    {repoStructure.readmeFiles.length + repoStructure.docFiles.length}
                  </span>
                </label>
                <div className="file-list">
                  {repoStructure.readmeFiles.map(file => (
                    <button
                      key={file}
                      className={`file-item ${selectedFile === file ? 'active' : ''}`}
                      onClick={() => handleFileSelect(file)}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 1H3a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5L8 1z" />
                        <path d="M8 1v4h4" />
                      </svg>
                      <span className="file-name">{file}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>README</span>
                    </button>
                  ))}
                  {repoStructure.docFiles.slice(0, 8).map(file => (
                    <button
                      key={file}
                      className={`file-item ${selectedFile === file ? 'active' : ''}`}
                      onClick={() => handleFileSelect(file)}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 1H3a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5L8 1z" />
                        <path d="M8 1v4h4" />
                      </svg>
                      <span className="file-name">{file}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Translation Controls */}
            <div className="sidebar-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <label className="sidebar-label">Target Language</label>
              <div className="lang-selector">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className={`lang-option ${selectedLang === lang.code ? 'active' : ''}`}
                    onClick={() => { setSelectedLang(lang.code); setTranslatedContent(''); setTranslationStats(null); }}
                    title={`${lang.name} (${lang.nativeName})`}
                  >
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-code">{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>

              <button
                className="btn btn-primary translate-btn"
                onClick={handleTranslate}
                disabled={translating || !readmeContent}
              >
                {translating ? (
                  <>
                    <div className="spinner"></div>
                    Translating... {translationProgress}%
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="9" cy="9" r="7" />
                      <line x1="1" y1="9" x2="17" y2="9" />
                      <path d="M9 2a11.5 11.5 0 013 7 11.5 11.5 0 01-3 7 11.5 11.5 0 01-3-7 11.5 11.5 0 013-7z" />
                    </svg>
                    Translate to {selectedLangInfo?.name}
                  </>
                )}
              </button>

              {translating && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${translationProgress}%` }}></div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Repo Stats */}
        {repoStructure && (
          <div className="sidebar-section sidebar-stats animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <div className="stat-row">
              <span className="stat-label">Total Files</span>
              <span className="stat-value">{repoStructure.totalFiles}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">README Files</span>
              <span className="stat-value">{repoStructure.readmeFiles.length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Doc Files</span>
              <span className="stat-value">{repoStructure.docFiles.length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Config Files</span>
              <span className="stat-value">{repoStructure.configFiles.length}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="project-main">
        {error && (
          <div className="project-error animate-fade-in">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v5M10 14v0" strokeLinecap="round" />
            </svg>
            <span>{error}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        {loading && (
          <div className="project-loading animate-fade-in">
            <div className="loading-content">
              <div className="spinner spinner-lg"></div>
              <h3>Analyzing Repository</h3>
              <p>{analysisStep}</p>
            </div>
          </div>
        )}

        {!loading && !repoInfo && !error && (
          <div className="project-empty animate-fade-in">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                <rect x="12" y="8" width="40" height="48" rx="4" />
                <path d="M24 20h16M24 28h12M24 36h14" strokeLinecap="round" />
                <circle cx="44" cy="44" r="12" fill="var(--bg-primary)" stroke="var(--accent-primary)" strokeWidth="2" />
                <path d="M41 44l2 2 4-4" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Enter a Repository URL</h2>
            <p>Paste a GitHub repository link in the sidebar to analyze its structure and translate documentation.</p>
          </div>
        )}

        {!loading && readmeContent && (
          <>
            {/* Toolbar */}
            <div className="content-toolbar">
              <div className="toolbar-left">
                <div className="toolbar-file-info">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z" />
                    <path d="M9 1v4h4" />
                  </svg>
                  <span className="toolbar-filename">{selectedFile}</span>
                </div>

                {translationStats && (
                  <div className="toolbar-stats">
                    <span className="badge badge-success">
                      {translationStats.codeBlocksPreserved ? '✓' : '✗'} {translationStats.codeBlockCount} code blocks
                    </span>
                    <span className="badge badge-info">
                      {translationStats.originalWords} → {translationStats.translatedWords} words
                    </span>
                  </div>
                )}
              </div>

              <div className="toolbar-right">
                <div className="view-toggle">
                  <button
                    className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
                    onClick={() => setViewMode('split')}
                    title="Split View"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="1" y="2" width="14" height="12" rx="2" />
                      <line x1="8" y1="2" x2="8" y2="14" />
                    </svg>
                  </button>
                  <button
                    className={`toggle-btn ${viewMode === 'original' ? 'active' : ''}`}
                    onClick={() => setViewMode('original')}
                    title="Original Only"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="12" height="12" rx="2" />
                      <path d="M5 6h6M5 8h4M5 10h5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    className={`toggle-btn ${viewMode === 'translated' ? 'active' : ''}`}
                    onClick={() => setViewMode('translated')}
                    title="Translated Only"
                    disabled={!translatedContent}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="8" r="6" />
                      <line x1="2" y1="8" x2="14" y2="8" />
                      <path d="M8 2a9 9 0 012.5 6A9 9 0 018 14a9 9 0 01-2.5-6A9 9 0 018 2z" />
                    </svg>
                  </button>
                </div>

                <button
                  className={`btn btn-ghost btn-sm ${showRawMarkdown ? 'active' : ''}`}
                  onClick={() => setShowRawMarkdown(!showRawMarkdown)}
                >
                  {showRawMarkdown ? 'Preview' : 'Raw'}
                </button>

                {translatedContent && (
                  <>
                    <button className="btn btn-ghost btn-sm" onClick={handleCopyTranslation} title="Copy translated markdown">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="4" y="4" width="8" height="8" rx="1.5" />
                        <path d="M10 4V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5.5A1.5 1.5 0 003 10h1" />
                      </svg>
                      Copy
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={handleDownload}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 1v9M4 7l3 3 3-3M2 12h10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Download
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className={`content-panels ${viewMode}`}>
              {(viewMode === 'split' || viewMode === 'original') && (
                <div className="content-panel panel-original animate-fade-in">
                  <div className="panel-header">
                    <span className="panel-label">
                      <span className="panel-flag">🇺🇸</span>
                      Original (English)
                    </span>
                    <span className="badge badge-primary">Source</span>
                  </div>
                  <div className="panel-body">
                    {showRawMarkdown ? (
                      <pre className="raw-markdown">{readmeContent}</pre>
                    ) : (
                      <MarkdownRenderer content={readmeContent} />
                    )}
                  </div>
                </div>
              )}

              {(viewMode === 'split' || viewMode === 'translated') && (
                <div className="content-panel panel-translated animate-fade-in">
                  <div className="panel-header">
                    <span className="panel-label">
                      <span className="panel-flag">{selectedLangInfo?.flag}</span>
                      {selectedLangInfo?.name} ({selectedLangInfo?.nativeName})
                    </span>
                    {translatedContent && <span className="badge badge-success">Translated</span>}
                  </div>
                  <div className="panel-body">
                    {translating ? (
                      <div className="panel-translating">
                        <div className="spinner spinner-lg"></div>
                        <p>Translating to {selectedLangInfo?.name}...</p>
                        <div className="progress-bar" style={{ width: '200px' }}>
                          <div className="progress-fill" style={{ width: `${translationProgress}%` }}></div>
                        </div>
                        <span className="progress-text">{translationProgress}% complete</span>
                      </div>
                    ) : translatedContent ? (
                      showRawMarkdown ? (
                        <pre className="raw-markdown">{translatedContent}</pre>
                      ) : (
                        <MarkdownRenderer content={translatedContent} />
                      )
                    ) : (
                      <div className="panel-empty">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                          <circle cx="24" cy="24" r="18" />
                          <line x1="6" y1="24" x2="42" y2="24" />
                          <path d="M24 6a27 27 0 017 18 27 27 0 01-7 18 27 27 0 01-7-18A27 27 0 0124 6z" />
                        </svg>
                        <p>Select a language and click <strong>Translate</strong> to generate localized content</p>
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
