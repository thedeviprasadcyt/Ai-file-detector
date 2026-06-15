/**
 * File Signatures (Magic Bytes) Database
 * Maps binary file headers to their actual file formats.
 * Used for accurate file format detection beyond extension-based identification.
 */

export const FILE_SIGNATURES = [
  // Images
  {
    signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
    format: 'PNG',
    mime: 'image/png',
    extension: '.png',
    category: 'Image',
    description: 'Portable Network Graphics image format with lossless compression'
  },
  {
    signature: [0xFF, 0xD8, 0xFF],
    format: 'JPEG',
    mime: 'image/jpeg',
    extension: '.jpg',
    category: 'Image',
    description: 'Joint Photographic Experts Group image with lossy compression'
  },
  {
    signature: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    format: 'GIF87a',
    mime: 'image/gif',
    extension: '.gif',
    category: 'Image',
    description: 'Graphics Interchange Format (version 87a)'
  },
  {
    signature: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
    format: 'GIF89a',
    mime: 'image/gif',
    extension: '.gif',
    category: 'Image',
    description: 'Graphics Interchange Format (version 89a) with animation support'
  },
  {
    signature: [0x52, 0x49, 0x46, 0x46],
    secondSignature: { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
    format: 'WebP',
    mime: 'image/webp',
    extension: '.webp',
    category: 'Image',
    description: 'Google WebP image format with superior compression'
  },
  {
    signature: [0x42, 0x4D],
    format: 'BMP',
    mime: 'image/bmp',
    extension: '.bmp',
    category: 'Image',
    description: 'Bitmap image file format'
  },
  {
    signature: [0x49, 0x49, 0x2A, 0x00],
    format: 'TIFF',
    mime: 'image/tiff',
    extension: '.tiff',
    category: 'Image',
    description: 'Tagged Image File Format (Little-endian)'
  },
  {
    signature: [0x4D, 0x4D, 0x00, 0x2A],
    format: 'TIFF',
    mime: 'image/tiff',
    extension: '.tiff',
    category: 'Image',
    description: 'Tagged Image File Format (Big-endian)'
  },
  {
    signature: [0x00, 0x00, 0x01, 0x00],
    format: 'ICO',
    mime: 'image/x-icon',
    extension: '.ico',
    category: 'Image',
    description: 'Windows Icon file format'
  },

  // Documents
  {
    signature: [0x25, 0x50, 0x44, 0x46],
    format: 'PDF',
    mime: 'application/pdf',
    extension: '.pdf',
    category: 'Document',
    description: 'Portable Document Format by Adobe'
  },
  {
    signature: [0x50, 0x4B, 0x03, 0x04],
    format: 'ZIP/Office',
    mime: 'application/zip',
    extension: '.zip',
    category: 'Archive',
    description: 'ZIP archive or Microsoft Office Open XML document'
  },
  {
    signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1],
    format: 'MS Office (Legacy)',
    mime: 'application/msword',
    extension: '.doc',
    category: 'Document',
    description: 'Microsoft Office legacy format (DOC, XLS, PPT)'
  },

  // Archives
  {
    signature: [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07],
    format: 'RAR',
    mime: 'application/x-rar-compressed',
    extension: '.rar',
    category: 'Archive',
    description: 'RAR compressed archive'
  },
  {
    signature: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C],
    format: '7Z',
    mime: 'application/x-7z-compressed',
    extension: '.7z',
    category: 'Archive',
    description: '7-Zip compressed archive with high compression ratio'
  },
  {
    signature: [0x1F, 0x8B],
    format: 'GZIP',
    mime: 'application/gzip',
    extension: '.gz',
    category: 'Archive',
    description: 'GNU zip compressed file'
  },
  {
    signature: [0x42, 0x5A, 0x68],
    format: 'BZIP2',
    mime: 'application/x-bzip2',
    extension: '.bz2',
    category: 'Archive',
    description: 'BZIP2 compressed file'
  },

  // Audio
  {
    signature: [0x49, 0x44, 0x33],
    format: 'MP3',
    mime: 'audio/mpeg',
    extension: '.mp3',
    category: 'Audio',
    description: 'MPEG-1 Audio Layer 3 with ID3 metadata tag'
  },
  {
    signature: [0xFF, 0xFB],
    format: 'MP3',
    mime: 'audio/mpeg',
    extension: '.mp3',
    category: 'Audio',
    description: 'MPEG-1 Audio Layer 3 (sync frame)'
  },
  {
    signature: [0xFF, 0xF3],
    format: 'MP3',
    mime: 'audio/mpeg',
    extension: '.mp3',
    category: 'Audio',
    description: 'MPEG-1 Audio Layer 3 (sync frame variant)'
  },
  {
    signature: [0x52, 0x49, 0x46, 0x46],
    secondSignature: { offset: 8, bytes: [0x57, 0x41, 0x56, 0x45] },
    format: 'WAV',
    mime: 'audio/wav',
    extension: '.wav',
    category: 'Audio',
    description: 'Waveform Audio File Format'
  },
  {
    signature: [0x66, 0x4C, 0x61, 0x43],
    format: 'FLAC',
    mime: 'audio/flac',
    extension: '.flac',
    category: 'Audio',
    description: 'Free Lossless Audio Codec'
  },
  {
    signature: [0x4F, 0x67, 0x67, 0x53],
    format: 'OGG',
    mime: 'audio/ogg',
    extension: '.ogg',
    category: 'Audio',
    description: 'OGG multimedia container format'
  },

  // Video
  {
    signature: [0x00, 0x00, 0x00],
    secondSignature: { offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] },
    format: 'MP4',
    mime: 'video/mp4',
    extension: '.mp4',
    category: 'Video',
    description: 'MPEG-4 Part 14 multimedia container'
  },
  {
    signature: [0x52, 0x49, 0x46, 0x46],
    secondSignature: { offset: 8, bytes: [0x41, 0x56, 0x49, 0x20] },
    format: 'AVI',
    mime: 'video/x-msvideo',
    extension: '.avi',
    category: 'Video',
    description: 'Audio Video Interleave multimedia container'
  },
  {
    signature: [0x1A, 0x45, 0xDF, 0xA3],
    format: 'MKV/WebM',
    mime: 'video/x-matroska',
    extension: '.mkv',
    category: 'Video',
    description: 'Matroska/WebM multimedia container'
  },
  {
    signature: [0x46, 0x4C, 0x56],
    format: 'FLV',
    mime: 'video/x-flv',
    extension: '.flv',
    category: 'Video',
    description: 'Flash Video format'
  },

  // Executables
  {
    signature: [0x4D, 0x5A],
    format: 'EXE/DLL',
    mime: 'application/x-msdownload',
    extension: '.exe',
    category: 'Executable',
    description: 'Windows Portable Executable / Dynamic Link Library'
  },
  {
    signature: [0x7F, 0x45, 0x4C, 0x46],
    format: 'ELF',
    mime: 'application/x-elf',
    extension: '',
    category: 'Executable',
    description: 'Executable and Linkable Format (Linux/Unix)'
  },

  // Fonts
  {
    signature: [0x00, 0x01, 0x00, 0x00, 0x00],
    format: 'TTF',
    mime: 'font/ttf',
    extension: '.ttf',
    category: 'Font',
    description: 'TrueType Font'
  },
  {
    signature: [0x4F, 0x54, 0x54, 0x4F],
    format: 'OTF',
    mime: 'font/otf',
    extension: '.otf',
    category: 'Font',
    description: 'OpenType Font'
  },
  {
    signature: [0x77, 0x4F, 0x46, 0x46],
    format: 'WOFF',
    mime: 'font/woff',
    extension: '.woff',
    category: 'Font',
    description: 'Web Open Font Format'
  },
  {
    signature: [0x77, 0x4F, 0x46, 0x32],
    format: 'WOFF2',
    mime: 'font/woff2',
    extension: '.woff2',
    category: 'Font',
    description: 'Web Open Font Format 2.0'
  },

  // Database
  {
    signature: [0x53, 0x51, 0x4C, 0x69, 0x74, 0x65],
    format: 'SQLite',
    mime: 'application/x-sqlite3',
    extension: '.sqlite',
    category: 'Database',
    description: 'SQLite database file'
  },

  // Other
  {
    signature: [0x3C, 0x3F, 0x78, 0x6D, 0x6C],
    format: 'XML',
    mime: 'application/xml',
    extension: '.xml',
    category: 'Data',
    description: 'Extensible Markup Language document'
  },
];

/**
 * Extension-to-format mapping for fallback detection.
 */
export const EXTENSION_MAP = {
  // Images
  '.jpg': { format: 'JPEG', mime: 'image/jpeg', category: 'Image' },
  '.jpeg': { format: 'JPEG', mime: 'image/jpeg', category: 'Image' },
  '.png': { format: 'PNG', mime: 'image/png', category: 'Image' },
  '.gif': { format: 'GIF', mime: 'image/gif', category: 'Image' },
  '.webp': { format: 'WebP', mime: 'image/webp', category: 'Image' },
  '.bmp': { format: 'BMP', mime: 'image/bmp', category: 'Image' },
  '.svg': { format: 'SVG', mime: 'image/svg+xml', category: 'Image' },
  '.ico': { format: 'ICO', mime: 'image/x-icon', category: 'Image' },
  '.tiff': { format: 'TIFF', mime: 'image/tiff', category: 'Image' },
  '.tif': { format: 'TIFF', mime: 'image/tiff', category: 'Image' },

  // Documents
  '.pdf': { format: 'PDF', mime: 'application/pdf', category: 'Document' },
  '.doc': { format: 'DOC', mime: 'application/msword', category: 'Document' },
  '.docx': { format: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', category: 'Document' },
  '.xls': { format: 'XLS', mime: 'application/vnd.ms-excel', category: 'Document' },
  '.xlsx': { format: 'XLSX', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', category: 'Document' },
  '.ppt': { format: 'PPT', mime: 'application/vnd.ms-powerpoint', category: 'Document' },
  '.pptx': { format: 'PPTX', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', category: 'Document' },
  '.txt': { format: 'Text', mime: 'text/plain', category: 'Document' },
  '.rtf': { format: 'RTF', mime: 'application/rtf', category: 'Document' },
  '.csv': { format: 'CSV', mime: 'text/csv', category: 'Data' },
  '.md': { format: 'Markdown', mime: 'text/markdown', category: 'Document' },

  // Audio
  '.mp3': { format: 'MP3', mime: 'audio/mpeg', category: 'Audio' },
  '.wav': { format: 'WAV', mime: 'audio/wav', category: 'Audio' },
  '.flac': { format: 'FLAC', mime: 'audio/flac', category: 'Audio' },
  '.aac': { format: 'AAC', mime: 'audio/aac', category: 'Audio' },
  '.ogg': { format: 'OGG', mime: 'audio/ogg', category: 'Audio' },
  '.wma': { format: 'WMA', mime: 'audio/x-ms-wma', category: 'Audio' },
  '.m4a': { format: 'M4A', mime: 'audio/mp4', category: 'Audio' },

  // Video
  '.mp4': { format: 'MP4', mime: 'video/mp4', category: 'Video' },
  '.avi': { format: 'AVI', mime: 'video/x-msvideo', category: 'Video' },
  '.mkv': { format: 'MKV', mime: 'video/x-matroska', category: 'Video' },
  '.mov': { format: 'MOV', mime: 'video/quicktime', category: 'Video' },
  '.wmv': { format: 'WMV', mime: 'video/x-ms-wmv', category: 'Video' },
  '.flv': { format: 'FLV', mime: 'video/x-flv', category: 'Video' },
  '.webm': { format: 'WebM', mime: 'video/webm', category: 'Video' },

  // Archives
  '.zip': { format: 'ZIP', mime: 'application/zip', category: 'Archive' },
  '.rar': { format: 'RAR', mime: 'application/x-rar-compressed', category: 'Archive' },
  '.7z': { format: '7Z', mime: 'application/x-7z-compressed', category: 'Archive' },
  '.tar': { format: 'TAR', mime: 'application/x-tar', category: 'Archive' },
  '.gz': { format: 'GZIP', mime: 'application/gzip', category: 'Archive' },
  '.bz2': { format: 'BZIP2', mime: 'application/x-bzip2', category: 'Archive' },

  // Executables
  '.exe': { format: 'EXE', mime: 'application/x-msdownload', category: 'Executable' },
  '.dll': { format: 'DLL', mime: 'application/x-msdownload', category: 'Executable' },
  '.msi': { format: 'MSI', mime: 'application/x-msi', category: 'Executable' },
  '.bat': { format: 'BAT', mime: 'application/x-bat', category: 'Executable' },
  '.sh': { format: 'Shell Script', mime: 'application/x-sh', category: 'Executable' },
  '.cmd': { format: 'CMD', mime: 'application/x-bat', category: 'Executable' },
  '.ps1': { format: 'PowerShell', mime: 'application/x-powershell', category: 'Executable' },
  '.apk': { format: 'APK', mime: 'application/vnd.android.package-archive', category: 'Executable' },

  // Code
  '.js': { format: 'JavaScript', mime: 'text/javascript', category: 'Code' },
  '.ts': { format: 'TypeScript', mime: 'text/typescript', category: 'Code' },
  '.jsx': { format: 'JSX', mime: 'text/javascript', category: 'Code' },
  '.tsx': { format: 'TSX', mime: 'text/typescript', category: 'Code' },
  '.html': { format: 'HTML', mime: 'text/html', category: 'Code' },
  '.css': { format: 'CSS', mime: 'text/css', category: 'Code' },
  '.json': { format: 'JSON', mime: 'application/json', category: 'Data' },
  '.xml': { format: 'XML', mime: 'application/xml', category: 'Data' },
  '.yaml': { format: 'YAML', mime: 'text/yaml', category: 'Data' },
  '.yml': { format: 'YAML', mime: 'text/yaml', category: 'Data' },
  '.py': { format: 'Python', mime: 'text/x-python', category: 'Code' },
  '.java': { format: 'Java', mime: 'text/x-java', category: 'Code' },
  '.c': { format: 'C', mime: 'text/x-c', category: 'Code' },
  '.cpp': { format: 'C++', mime: 'text/x-c++', category: 'Code' },
  '.go': { format: 'Go', mime: 'text/x-go', category: 'Code' },
  '.rs': { format: 'Rust', mime: 'text/x-rust', category: 'Code' },
  '.rb': { format: 'Ruby', mime: 'text/x-ruby', category: 'Code' },
  '.php': { format: 'PHP', mime: 'text/x-php', category: 'Code' },
  '.sql': { format: 'SQL', mime: 'application/sql', category: 'Data' },

  // Fonts
  '.ttf': { format: 'TrueType Font', mime: 'font/ttf', category: 'Font' },
  '.otf': { format: 'OpenType Font', mime: 'font/otf', category: 'Font' },
  '.woff': { format: 'WOFF', mime: 'font/woff', category: 'Font' },
  '.woff2': { format: 'WOFF2', mime: 'font/woff2', category: 'Font' },

  // Database
  '.sqlite': { format: 'SQLite', mime: 'application/x-sqlite3', category: 'Database' },
  '.db': { format: 'Database', mime: 'application/octet-stream', category: 'Database' },
};

/**
 * Dangerous file extensions that warrant security warnings.
 */
export const DANGEROUS_EXTENSIONS = [
  '.exe', '.dll', '.bat', '.cmd', '.msi', '.ps1', '.vbs',
  '.scr', '.pif', '.com', '.hta', '.js', '.jse', '.wsf',
  '.wsh', '.reg', '.inf', '.apk', '.sh'
];

/**
 * Known potentially dangerous MIME types.
 */
export const DANGEROUS_MIMES = [
  'application/x-msdownload',
  'application/x-msi',
  'application/x-bat',
  'application/x-sh',
  'application/x-powershell',
  'application/vnd.android.package-archive'
];
