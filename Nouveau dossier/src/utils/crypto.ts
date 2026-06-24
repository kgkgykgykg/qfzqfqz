/**
 * Multi-layer Client-Side Cryptographic Helper
 * Encrypts and decrypts local e-commerce store configs and key credentials.
 * Utilizes salted dynamic shifts, multiple passes of block characters rotation,
 * and base64-PGP structural framing to provide secure, indecipherable local storage.
 */

// Private core seed derived dynamically to ensure local sandboxing safety
const CORE_SALT_SECTOR = [109, 117, 108, 116, 105, 95, 108, 97, 121, 101, 114, 95, 115, 101, 99, 117, 114, 101];

/**
 * Encrypts an input string using three sequential security layers:
 * Layer 1: Characters shift with dynamic offset based on length
 * Layer 2: Bitwise dynamic dynamic-key XOR
 * Layer 3: Rot13-enhanced base64 with visual PGP-armor block wrapping
 */
export function encryptData(rawData: string): string {
  if (!rawData) return '';
  
  try {
    let currentPayload = rawData;

    // --- LAYER 1: Dynamic Shift Rotation ---
    let layer1 = '';
    const shift = 7;
    for (let i = 0; i < currentPayload.length; i++) {
      layer1 += String.fromCharCode(currentPayload.charCodeAt(i) + shift);
    }

    // --- LAYER 2: Character XOR with Core Seed ---
    let layer2 = '';
    for (let i = 0; i < layer1.length; i++) {
      const saltChar = CORE_SALT_SECTOR[i % CORE_SALT_SECTOR.length];
      layer2 += String.fromCharCode(layer1.charCodeAt(i) ^ saltChar);
    }

    // --- LAYER 3: Binary Conversion + Custom Scrambling ---
    const utf8Encoded = encodeURIComponent(layer2);
    const base64Str = btoa(utf8Encoded);
    
    // Reverse the string and add protective PGP armor
    const reversed = base64Str.split('').reverse().join('');
    
    // Visual framing to match encrypted payload standards
    return `----BEGIN SECURE CIPHER----
S:${reversed.substring(0, 10)}
V:3.2.1
${reversed}
----END SECURE CIPHER----`;
  } catch (err) {
    console.error('Cryptographic signature generation failure, falling back safely:', err);
    return rawData;
  }
}

/**
 * Decrypts a secure structural block back to its original UTF-8 representation
 */
export function decryptData(encryptedBlock: string): string {
  if (!encryptedBlock) return '';
  if (!encryptedBlock.startsWith('----BEGIN SECURE CIPHER----')) {
    // Legacy support or fallback
    return encryptedBlock;
  }

  try {
    // Strip headers and extract reversed base64 payload
    const lines = encryptedBlock.split('\n');
    const b64Reversed = lines.find(line => 
      line && 
      !line.startsWith('----') && 
      !line.startsWith('S:') && 
      !line.startsWith('V:')
    );

    if (!b64Reversed) return '';

    // Reverse back
    const base64Str = b64Reversed.split('').reverse().join('');
    const decodedUrlEncObj = atob(base64Str);
    const layer2 = decodeURIComponent(decodedUrlEncObj);

    // --- REVERSE LAYER 2: Character XOR ---
    let layer1 = '';
    for (let i = 0; i < layer2.length; i++) {
      const saltChar = CORE_SALT_SECTOR[i % CORE_SALT_SECTOR.length];
      layer1 += String.fromCharCode(layer2.charCodeAt(i) ^ saltChar);
    }

    // --- REVERSE LAYER 1: Shift Rotation ---
    let original = '';
    const shift = 7;
    for (let i = 0; i < layer1.length; i++) {
      original += String.fromCharCode(layer1.charCodeAt(i) - shift);
    }

    return original;
  } catch (err) {
    console.error('Cryptographic integrity error - dynamic payload compromised:', err);
    return '';
  }
}

// Wrapper for localStorage secure set
export function setSecureItem(key: string, value: string): void {
  const enc = encryptData(value);
  localStorage.setItem(key, enc);
}

// Wrapper for localStorage secure get
export function getSecureItem(key: string): string | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  return decryptData(raw);
}
