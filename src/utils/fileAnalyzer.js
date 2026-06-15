/**
 * File Analyzer Utility
 * Performs comprehensive file analysis using multiple detection methods:
 * - Extension-based detection
 * - MIME type detection
 * - File signature (magic bytes) detection
 * Compares results and provides a security assessment.
 */

import {
  FILE_SIGNATURES,
  EXTENSION_MAP,
  DANGEROUS_EXTENSIONS,
  DANGEROUS_MIMES
} from './fileSignatures';

/**
 * Read the first N bytes of a file as a Uint8Array.
 * @param {File} file - The file to read.
 * @param {number} numBytes - Number of bytes to read from the start.
 * @returns {Promise<Uint8Array>} The file header bytes.
 */
async function readFileHeader(file, numBytes = 32) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const blob = file.slice(0, numBytes);
    reader.onload = (e) => resolve(new Uint8Array(e.target.result));
    reader.onerror = () => reject(new Error('Failed to read file header'));
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Extract file extension from filename.
 * @param {string} filename - The file name.
 * @returns {string} Lowercase extension with dot (e.g., '.pdf').
 */
function getFileExtension(filename) {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Detect file format from its extension.
 * @param {string} filename - The file name.
 * @returns {object|null} Extension detection result.
 */
function detectByExtension(filename) {
  const ext = getFileExtension(filename);
  if (!ext) return null;

  const info = EXTENSION_MAP[ext];
  if (info) {
    return {
      method: 'Extension Detection',
      format: info.format,
      mime: info.mime,
      category: info.category,
      extension: ext,
      confidence: 'Medium'
    };
  }

  return {
    method: 'Extension Detection',
    format: ext.replace('.', '').toUpperCase(),
    mime: 'application/octet-stream',
    category: 'Unknown',
    extension: ext,
    confidence: 'Low'
  };
}

/**
 * Detect file format from browser-reported MIME type.
 * @param {File} file - The file object.
 * @returns {object|null} MIME detection result.
 */
function detectByMime(file) {
  const mime = file.type;
  if (!mime) return null;

  // Reverse-lookup from extension map to find format
  for (const [, info] of Object.entries(EXTENSION_MAP)) {
    if (info.mime === mime) {
      return {
        method: 'MIME Detection',
        format: info.format,
        mime: mime,
        category: info.category,
        confidence: 'Medium'
      };
    }
  }

  // Fallback: derive category from MIME prefix
  let category = 'Unknown';
  if (mime.startsWith('image/')) category = 'Image';
  else if (mime.startsWith('audio/')) category = 'Audio';
  else if (mime.startsWith('video/')) category = 'Video';
  else if (mime.startsWith('text/')) category = 'Document';
  else if (mime.startsWith('application/')) category = 'Application';

  return {
    method: 'MIME Detection',
    format: mime.split('/')[1]?.toUpperCase() || 'Unknown',
    mime: mime,
    category: category,
    confidence: 'Low'
  };
}

/**
 * Detect file format by inspecting binary file signature (magic bytes).
 * @param {Uint8Array} header - The file header bytes.
 * @returns {object|null} Signature detection result.
 */
function detectBySignature(header) {
  if (!header || header.length === 0) return null;

  // Sort signatures by length descending so longer (more specific) matches win
  const sorted = [...FILE_SIGNATURES].sort(
    (a, b) => (b.signature?.length || 0) - (a.signature?.length || 0)
  );

  for (const sig of sorted) {
    // Check primary signature bytes
    let primaryMatch = true;
    for (let i = 0; i < sig.signature.length; i++) {
      if (header[i] !== sig.signature[i]) {
        primaryMatch = false;
        break;
      }
    }

    if (!primaryMatch) continue;

    // Check secondary signature if present (e.g., RIFF sub-format: WAV, AVI, WebP)
    if (sig.secondSignature) {
      const { offset, bytes } = sig.secondSignature;
      let secondaryMatch = true;
      for (let i = 0; i < bytes.length; i++) {
        if (header[offset + i] !== bytes[i]) {
          secondaryMatch = false;
          break;
        }
      }
      if (!secondaryMatch) continue;
    }

    return {
      method: 'File Signature Detection',
      format: sig.format,
      mime: sig.mime,
      category: sig.category,
      extension: sig.extension,
      description: sig.description,
      confidence: 'High',
      signatureBytes: Array.from(header.slice(0, sig.signature.length))
        .map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0'))
        .join(' ')
    };
  }

  return null;
}

/**
 * Determine the security assessment for a file.
 * @param {object} analysis - The combined analysis result.
 * @returns {object} Security assessment with status, score, and reasons.
 */
function assessSecurity(analysis) {
  const { extensionResult, mimeResult, signatureResult, extension } = analysis;
  let score = 0;
  const reasons = [];

  // Check for dangerous extensions
  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    score += 40;
    reasons.push(`File extension "${extension}" is commonly associated with executable or script files`);
  }

  // Check for dangerous MIME types
  if (mimeResult && DANGEROUS_MIMES.includes(mimeResult.mime)) {
    score += 30;
    reasons.push(`MIME type "${mimeResult.mime}" indicates potentially executable content`);
  }

  // Check for signature-detected executables
  if (signatureResult && signatureResult.category === 'Executable') {
    score += 35;
    reasons.push(`File signature identifies this as an executable binary (${signatureResult.format})`);
  }

  // Check for extension mismatch - a strong indicator of disguise
  if (signatureResult && extensionResult) {
    const sigCat = signatureResult.category?.toLowerCase();
    const extCat = extensionResult.category?.toLowerCase();

    if (sigCat && extCat && sigCat !== extCat) {
      score += 45;
      reasons.push(
        `⚠ Extension mismatch: File claims to be "${extensionResult.format}" (${extensionResult.category}) ` +
        `but signature reveals "${signatureResult.format}" (${signatureResult.category})`
      );
    } else if (signatureResult.format !== extensionResult.format &&
               signatureResult.format !== 'ZIP/Office') {
      // Minor mismatch within the same category
      score += 15;
      reasons.push(
        `Extension suggests "${extensionResult.format}" but signature detects "${signatureResult.format}"`
      );
    }
  }

  // Check if there's no signature at all for a binary file
  if (!signatureResult && extensionResult &&
      !['Document', 'Code', 'Data'].includes(extensionResult.category)) {
    score += 10;
    reasons.push('File signature could not be verified against known formats');
  }

  // Ensure score is within bounds
  score = Math.min(100, Math.max(0, score));

  // Determine overall status
  let status, statusColor;
  if (score >= 60) {
    status = 'Potentially Dangerous';
    statusColor = '#ff4757';
  } else if (score >= 25) {
    status = 'Suspicious';
    statusColor = '#ffa502';
  } else {
    status = 'Safe';
    statusColor = '#2ed573';
  }

  if (reasons.length === 0) {
    reasons.push('No significant security concerns detected');
  }

  return { status, statusColor, score, reasons };
}

/**
 * Get overall confidence level by combining all detection methods.
 * @param {object} extensionResult - Extension detection result.
 * @param {object} mimeResult - MIME detection result.
 * @param {object} signatureResult - Signature detection result.
 * @returns {object} Overall confidence assessment.
 */
function getOverallConfidence(extensionResult, mimeResult, signatureResult) {
  const methods = [];

  if (signatureResult) methods.push({ ...signatureResult, weight: 3 });
  if (mimeResult) methods.push({ ...mimeResult, weight: 2 });
  if (extensionResult) methods.push({ ...extensionResult, weight: 1 });

  if (methods.length === 0) {
    return { level: 'Low', percentage: 20, methods: [] };
  }

  // If all methods agree, that's highest confidence
  const formats = methods.map(m => m.format);
  const allAgree = formats.length > 1 && new Set(formats).size === 1;

  let percentage;
  if (allAgree) {
    percentage = 98;
  } else if (signatureResult) {
    percentage = 85;
  } else if (mimeResult && extensionResult) {
    percentage = 65;
  } else if (mimeResult || extensionResult) {
    percentage = 45;
  } else {
    percentage = 20;
  }

  let level;
  if (percentage >= 80) level = 'High';
  else if (percentage >= 50) level = 'Medium';
  else level = 'Low';

  return {
    level,
    percentage,
    methods: methods.map(m => m.method)
  };
}

/**
 * Get image dimensions if the file is an image.
 * @param {File} file - The image file.
 * @returns {Promise<object|null>} Image dimensions or null.
 */
async function getImageDimensions(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}

/**
 * Format file size into human-readable string.
 * @param {number} bytes - File size in bytes.
 * @returns {string} Formatted file size.
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main analysis function.
 * Performs comprehensive file analysis using all available detection methods.
 * @param {File} file - The file to analyze.
 * @returns {Promise<object>} Complete analysis result.
 */
export async function analyzeFile(file) {
  if (!file) throw new Error('No file provided');
  if (file.size === 0) throw new Error('File is empty (0 bytes)');

  try {
    // Read the file header for signature detection
    const header = await readFileHeader(file, 32);

    // Run all detection methods
    const extension = getFileExtension(file.name);
    const extensionResult = detectByExtension(file.name);
    const mimeResult = detectByMime(file);
    const signatureResult = detectBySignature(header);

    // Determine the best format result (signature > MIME > extension)
    const bestResult = signatureResult || mimeResult || extensionResult;

    // Determine if the file is genuine
    let isGenuine = true;
    let mismatchWarning = null;

    if (signatureResult && extensionResult) {
      if (signatureResult.category !== extensionResult.category) {
        isGenuine = false;
        mismatchWarning = `This file has a "${extension}" extension but is actually a ${signatureResult.format} file (${signatureResult.category})`;
      }
    }

    // Get image dimensions if applicable
    const imageDimensions = await getImageDimensions(file);

    // Build security assessment
    const security = assessSecurity({
      extensionResult,
      mimeResult,
      signatureResult,
      extension
    });

    // Calculate confidence
    const confidence = getOverallConfidence(extensionResult, mimeResult, signatureResult);

    // Build magic bytes hex string for display
    const magicBytesHex = header
      ? Array.from(header.slice(0, 16))
          .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
          .join(' ')
      : 'N/A';

    return {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      fileName: file.name,
      fileSize: file.size,
      fileSizeFormatted: formatFileSize(file.size),
      lastModified: new Date(file.lastModified),
      extension,
      browserMime: file.type || 'Not reported',

      // Detection results
      extensionResult,
      mimeResult,
      signatureResult,

      // Best determination
      actualFormat: bestResult?.format || 'Unknown',
      actualMime: bestResult?.mime || 'application/octet-stream',
      actualCategory: bestResult?.category || 'Unknown',
      formatDescription: signatureResult?.description || bestResult?.format || 'Unknown format',

      // Integrity
      isGenuine,
      mismatchWarning,

      // Security
      security,

      // Confidence
      confidence,

      // Metadata
      magicBytesHex,
      imageDimensions,

      // Timestamp
      analyzedAt: new Date(),

      // File reference for preview
      file
    };
  } catch (error) {
    throw new Error(`File analysis failed: ${error.message}`);
  }
}
