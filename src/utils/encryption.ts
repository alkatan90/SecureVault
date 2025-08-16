export async function generateKey(password: string, salt?: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + (salt || 'password-manager-salt'));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function encryptData(data: string, key: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(key.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoder.encode(data)
    );

    const encrypted = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(iv.length + encrypted.length);
    combined.set(iv);
    combined.set(encrypted, iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

export async function decryptData(encryptedData: string, key: string): Promise<string> {
  try {
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(key.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}