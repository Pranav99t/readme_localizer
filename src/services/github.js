// GitHub API service for fetching repository data
const GITHUB_API = 'https://api.github.com';

/**
 * Parse a GitHub URL into owner and repo name
 */
export function parseGitHubUrl(url) {
  try {
    const cleaned = url.trim().replace(/\/+$/, '');
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/\#\?]+)/,
      /^([^\/]+)\/([^\/]+)$/,
    ];
    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch repository metadata
 */
export async function fetchRepoInfo(owner, repo) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`);
  if (!res.ok) throw new Error(`Repository not found: ${owner}/${repo}`);
  return res.json();
}

/**
 * Fetch repository file tree (recursive)
 */
export async function fetchRepoTree(owner, repo, branch = 'main') {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    if (!res.ok) {
      // Try 'master' branch if 'main' fails
      const res2 = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/master?recursive=1`);
      if (!res2.ok) throw new Error('Could not fetch repository tree');
      return res2.json();
    }
    return res.json();
  } catch (err) {
    throw new Error(`Failed to fetch repo tree: ${err.message}`);
  }
}

/**
 * Fetch file content from the repository
 */
export async function fetchFileContent(owner, repo, path, branch = 'main') {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
    if (!res.ok) {
      const res2 = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=master`);
      if (!res2.ok) throw new Error(`File not found: ${path}`);
      const data = await res2.json();
      return decodeContent(data);
    }
    const data = await res.json();
    return decodeContent(data);
  } catch (err) {
    throw new Error(`Failed to fetch file: ${err.message}`);
  }
}

function decodeContent(data) {
  if (data.encoding === 'base64') {
    // atob decodes to a binary string where each character is a single byte
    const binaryString = atob(data.content.replace(/\s/g, ''));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // Use TextDecoder to correctly interpret the bytes as UTF-8
    return new TextDecoder().decode(bytes);
  }
  return data.content || '';
}


/**
 * Find README and important files in the repository
 */
export function analyzeRepoStructure(tree) {
  const files = tree.tree || [];
  
  const structure = {
    readmeFiles: [],
    configFiles: [],
    scriptFiles: [],
    docFiles: [],
    totalFiles: files.length,
    languages: new Set(),
    directories: new Set(),
  };

  const readmePatterns = /^(readme|README|Readme)(\.md|\.mdx|\.rst|\.txt)?$/i;
  const configPatterns = /^(package\.json|tsconfig\.json|\.eslintrc|\.prettierrc|vite\.config|webpack\.config|next\.config|Cargo\.toml|pyproject\.toml|setup\.py|go\.mod|Gemfile|Makefile|Dockerfile|docker-compose|\.github)/i;
  const docPatterns = /\.(md|mdx|rst|txt)$/i;
  const scriptPatterns = /^(scripts\/|bin\/|\.github\/workflows\/)/i;

  files.forEach(file => {
    if (file.type === 'tree') {
      structure.directories.add(file.path);
      return;
    }

    // Detect language from extension
    const ext = file.path.split('.').pop()?.toLowerCase();
    const langMap = {
      js: 'JavaScript', jsx: 'JavaScript', ts: 'TypeScript', tsx: 'TypeScript',
      py: 'Python', rb: 'Ruby', go: 'Go', rs: 'Rust', java: 'Java',
      cpp: 'C++', c: 'C', cs: 'C#', php: 'PHP', swift: 'Swift',
      kt: 'Kotlin', dart: 'Dart', vue: 'Vue', svelte: 'Svelte',
    };
    if (langMap[ext]) structure.languages.add(langMap[ext]);

    const fileName = file.path.split('/').pop();
    
    if (readmePatterns.test(fileName)) {
      structure.readmeFiles.push(file.path);
    }
    
    if (configPatterns.test(file.path)) {
      structure.configFiles.push(file.path);
    }
    
    if (docPatterns.test(fileName) && !readmePatterns.test(fileName)) {
      structure.docFiles.push(file.path);
    }
    
    if (scriptPatterns.test(file.path)) {
      structure.scriptFiles.push(file.path);
    }
  });

  structure.languages = Array.from(structure.languages);
  structure.directories = Array.from(structure.directories);

  return structure;
}

/**
 * Get repository language stats
 */
export async function fetchRepoLanguages(owner, repo) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`);
  if (!res.ok) return {};
  return res.json();
}
