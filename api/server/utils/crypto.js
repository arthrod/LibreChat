const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const { webcrypto } = require('node:crypto');

// Generate default key and iv if not provided in env
const defaultKey = '0000000000000000000000000000000000000000000000000000000000000000';
const defaultIv = '00000000000000000000000000000000';

// Validate and create key buffer
let key;
try {
  const keyHex = process.env.CREDS_KEY || defaultKey;
  if (!/^[0-9a-fA-F]+$/.test(keyHex)) {
    throw new Error('CREDS_KEY must be a valid hex string');
  }
  key = Buffer.from(keyHex, 'hex');
} catch (error) {
  console.error('Error initializing encryption key:', error);
  key = Buffer.from(defaultKey, 'hex');
}

// Validate and create iv buffer
let iv;
try {
  const ivHex = process.env.CREDS_IV || defaultIv;
  if (!/^[0-9a-fA-F]+$/.test(ivHex)) {
    throw new Error('CREDS_IV must be a valid hex string');
  }
  iv = Buffer.from(ivHex, 'hex');
} catch (error) {
  console.error('Error initializing IV:', error);
  iv = Buffer.from(defaultIv, 'hex');
}

const algorithm = "AES-CBC";

async function encrypt(value) {
  if (!value) {
    throw new Error('Value to encrypt cannot be empty');
  }

  const cryptoKey = await webcrypto.subtle.importKey("raw", key, { name: algorithm }, false, [
    "encrypt",
  ]);

  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  const encryptedBuffer = await webcrypto.subtle.encrypt(
    {
      name: algorithm,
      iv: iv,
    },
    cryptoKey,
    data,
  );

  return Buffer.from(encryptedBuffer).toString("hex");
}

async function decrypt(encryptedValue) {
  if (!encryptedValue) {
    throw new Error('Value to decrypt cannot be empty');
  }

  const cryptoKey = await webcrypto.subtle.importKey("raw", key, { name: algorithm }, false, [
    "decrypt",
  ]);

  const encryptedBuffer = Buffer.from(encryptedValue, "hex");

  const decryptedBuffer = await webcrypto.subtle.decrypt(
    {
      name: algorithm,
      iv: iv,
    },
    cryptoKey,
    encryptedBuffer,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

async function encryptV2(value) {
  if (!value) {
    throw new Error('Value to encrypt cannot be empty');
  }

  const gen_iv = webcrypto.getRandomValues(new Uint8Array(16));

  const cryptoKey = await webcrypto.subtle.importKey("raw", key, { name: algorithm }, false, [
    "encrypt",
  ]);

  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  const encryptedBuffer = await webcrypto.subtle.encrypt(
    {
      name: algorithm,
      iv: gen_iv,
    },
    cryptoKey,
    data,
  );

  return Buffer.from(gen_iv).toString("hex") + ":" + Buffer.from(encryptedBuffer).toString("hex");
}

async function decryptV2(encryptedValue) {
  if (!encryptedValue) {
    throw new Error('Value to decrypt cannot be empty');
  }

  const parts = encryptedValue.split(":");
  // Already decrypted from an earlier invocation
  if (parts.length === 1) {
    return parts[0];
  }
  const gen_iv = Buffer.from(parts.shift(), "hex");
  const encrypted = parts.join(":");

  const cryptoKey = await webcrypto.subtle.importKey("raw", key, { name: algorithm }, false, [
    "decrypt",
  ]);

  const encryptedBuffer = Buffer.from(encrypted, "hex");

  const decryptedBuffer = await webcrypto.subtle.decrypt(
    {
      name: algorithm,
      iv: gen_iv,
    },
    cryptoKey,
    encryptedBuffer,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

async function hashToken(str) {
  if (!str) {
    throw new Error('String to hash cannot be empty');
  }

  const data = new TextEncoder().encode(str);
  const hashBuffer = await webcrypto.subtle.digest("SHA-256", data);
  return Buffer.from(hashBuffer).toString("hex");
}

async function generateRandomHex(length) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Length must be a positive integer");
  }

  const randomValues = new Uint8Array(length);
  webcrypto.getRandomValues(randomValues);
  return Buffer.from(randomValues).toString("hex");
}

module.exports = { encrypt, decrypt, encryptV2, decryptV2, hashToken, generateRandomHex };