// Translation service using Lingo.dev API directly
// SDK format from lingo.dev/sdk source:
//   POST https://api.lingo.dev/process/localize
//   Header: X-API-Key
//   Body: { sourceLocale, targetLocale, data: { text: "..." }, params: { fast: false } }
//   Response: { data: { text: "translated" } }

// API key loaded from .env file (VITE_ prefix exposes it to client via Vite)
const LINGO_API_KEY = import.meta.env.VITE_LINGO_API_KEY;

// In dev mode we use Vite proxy at /api/lingo → https://api.lingo.dev
// In production you'd set this to your backend proxy URL
const LINGO_API_BASE = '/api/lingo';

/**
 * Supported languages with display names and flags
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'zh-Hans', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'uk-UA', name: 'Ukrainian', flag: '🇺🇦', nativeName: 'Українська' },
];

/**
 * Split markdown content into translatable segments, preserving code blocks
 */
function splitMarkdownSegments(markdown) {
  const segments = [];
  const lines = markdown.split('\n');
  let currentText = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeBlockLang = '';

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        codeBlockContent.push(line);
        segments.push({
          type: 'code',
          content: codeBlockContent.join('\n'),
          language: codeBlockLang,
        });
        codeBlockContent = [];
        inCodeBlock = false;
        codeBlockLang = '';
      } else {
        // Start code block - flush current text first
        if (currentText.length > 0) {
          const text = currentText.join('\n');
          if (text.trim()) {
            segments.push({ type: 'text', content: text });
          }
          currentText = [];
        }
        inCodeBlock = true;
        codeBlockLang = line.trim().replace(/^```/, '').trim();
        codeBlockContent.push(line);
      }
    } else if (inCodeBlock) {
      codeBlockContent.push(line);
    } else {
      currentText.push(line);
    }
  }

  // Flush remaining text
  if (currentText.length > 0) {
    const text = currentText.join('\n');
    if (text.trim()) {
      segments.push({ type: 'text', content: text });
    }
  }

  // Flush remaining code block (unclosed)
  if (codeBlockContent.length > 0) {
    segments.push({
      type: 'code',
      content: codeBlockContent.join('\n'),
      language: codeBlockLang,
    });
  }

  return segments;
}

/**
 * Protect inline code, URLs, and special markdown syntax from translation
 */
function protectSpecialContent(text) {
  const protections = [];
  let protectedText = text;
  let counter = 0;

  // Protect image references  ![alt](url)
  protectedText = protectedText.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match) => {
    const placeholder = `⟦IMG${counter}⟧`;
    protections.push({ placeholder, original: match });
    counter++;
    return placeholder;
  });

  // Protect links [label](url)
  protectedText = protectedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
    const placeholder = `⟦LINK${counter}⟧`;
    protections.push({ placeholder, original: match });
    counter++;
    return placeholder;
  });

  // Protect inline code `code`
  protectedText = protectedText.replace(/`[^`]+`/g, (match) => {
    const placeholder = `⟦CODE${counter}⟧`;
    protections.push({ placeholder, original: match });
    counter++;
    return placeholder;
  });

  // Protect bare URLs
  protectedText = protectedText.replace(/(https?:\/\/[^\s\)]+)/g, (match) => {
    const placeholder = `⟦URL${counter}⟧`;
    protections.push({ placeholder, original: match });
    counter++;
    return placeholder;
  });

  // Protect HTML tags
  protectedText = protectedText.replace(/<[^>]+>/g, (match) => {
    const placeholder = `⟦HTML${counter}⟧`;
    protections.push({ placeholder, original: match });
    counter++;
    return placeholder;
  });

  return { text: protectedText, protections };
}

/**
 * Restore protected content after translation
 */
function restoreSpecialContent(text, protections) {
  let restored = text;
  for (const { placeholder, original } of protections) {
    // The translation engine might add spaces around placeholders
    restored = restored.replace(new RegExp(escapeRegex(placeholder), 'g'), original);
  }
  return restored;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Call Lingo.dev API for translation using the exact SDK format
 * POST /process/localize
 */
async function callLingoAPI(text, targetLocale, sourceLocale = 'en') {
  const url = `${LINGO_API_BASE}/process/localize`;

  const body = {
    sourceLocale: sourceLocale,
    targetLocale: targetLocale,
    data: {
      text: text,
    },
    params: {
      fast: false,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-API-Key': LINGO_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Lingo.dev API error:', response.status, errText);
    throw new Error(`Lingo.dev API error (${response.status}): ${errText}`);
  }

  const data = await response.json();

  // SDK returns { data: { text: "translated" } }
  if (data.data?.text) {
    return data.data.text;
  }
  // Fallback shapes
  if (data.text) {
    return data.text;
  }
  if (typeof data === 'string') {
    return data;
  }

  throw new Error('Unexpected API response format');
}

/**
 * Translate a batch of text segments using Lingo.dev API
 * The SDK sends data as key-value object: { key1: "text1", key2: "text2", ... }
 */
async function callLingoAPIBatch(segments, targetLocale, sourceLocale = 'en') {
  const url = `${LINGO_API_BASE}/process/localize`;

  // Build a keyed object like the SDK does
  const data = {};
  segments.forEach((seg, i) => {
    data[`seg_${i}`] = seg;
  });

  const body = {
    sourceLocale: sourceLocale,
    targetLocale: targetLocale,
    data: data,
    params: {
      fast: false,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-API-Key': LINGO_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Lingo.dev batch API error:', response.status, errText);
    throw new Error(`Lingo.dev API error (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const translated = result.data || result;

  // Return in same order
  return segments.map((_, i) => translated[`seg_${i}`] || segments[i]);
}

/**
 * Translate markdown content preserving code blocks and formatting
 */
export async function translateMarkdown(markdown, targetLocale, sourceLocale = 'en', onProgress = null) {
  const segments = splitMarkdownSegments(markdown);
  const translatedSegments = [];
  let completed = 0;

  // Collect text segments for batch translation
  const textSegments = [];
  const textIndices = [];

  segments.forEach((segment, i) => {
    if (segment.type === 'text') {
      textSegments.push(segment);
      textIndices.push(i);
    }
  });

  // Pre-fill with code segments preserved as-is
  segments.forEach((segment) => {
    if (segment.type === 'code') {
      translatedSegments.push(segment.content);
    } else {
      translatedSegments.push(null); // placeholder
    }
  });

  // Translate text segments — try batch first, fall back to one-by-one
  if (textSegments.length > 0) {
    // Protect special content in each text segment
    const protectedSegments = textSegments.map(seg => protectSpecialContent(seg.content));

    try {
      // Try batch API call (more efficient)
      const batchTexts = protectedSegments.map(p => p.text);
      const batchResults = await callLingoAPIBatch(batchTexts, targetLocale, sourceLocale);

      batchResults.forEach((translated, idx) => {
        const restored = restoreSpecialContent(translated, protectedSegments[idx].protections);
        const originalIndex = textIndices[idx];
        translatedSegments[originalIndex] = restored;
      });

      if (onProgress) onProgress(100);
    } catch (batchErr) {
      console.warn('Batch translation failed, trying one-by-one:', batchErr.message);

      // Fall back to one-by-one translation
      for (let idx = 0; idx < protectedSegments.length; idx++) {
        const { text: protectedText, protections } = protectedSegments[idx];
        const originalIndex = textIndices[idx];

        try {
          const translated = await callLingoAPI(protectedText, targetLocale, sourceLocale);
          translatedSegments[originalIndex] = restoreSpecialContent(translated, protections);
        } catch (err) {
          console.warn(`Segment ${idx} translation failed:`, err.message);
          // Keep original text if translation fails
          translatedSegments[originalIndex] = textSegments[idx].content;
        }

        completed++;
        if (onProgress) {
          onProgress(Math.round((completed / protectedSegments.length) * 100));
        }
      }
    }
  }

  // Fill any remaining null slots with original content
  segments.forEach((segment, i) => {
    if (translatedSegments[i] === null) {
      translatedSegments[i] = segment.content;
    }
  });

  return translatedSegments.join('\n');
}

/**
 * Get translation statistics
 */
export function getTranslationStats(original, translated) {
  const originalWords = original.split(/\s+/).filter(Boolean).length;
  const translatedWords = translated.split(/\s+/).filter(Boolean).length;
  const codeBlocks = (original.match(/```[\s\S]*?```/g) || []).length;
  const preservedCodeBlocks = (translated.match(/```[\s\S]*?```/g) || []).length;

  return {
    originalWords,
    translatedWords,
    codeBlocksPreserved: preservedCodeBlocks === codeBlocks,
    codeBlockCount: codeBlocks,
    compressionRatio: translatedWords / originalWords,
  };
}
