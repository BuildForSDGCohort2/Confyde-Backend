import slug from 'limax';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import * as crypto from 'crypto';
import { Url, format as FormatUrl } from 'url';

const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const algorithm = 'aes-256-cbc';
const cryptoIv = Buffer.from(crypto.randomBytes(8)).toString('hex');

const generateKeys = (path: string, key: string) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: key,
    },
  });

  if (privateKey && publicKey) {
    writeFileSync(`${path}/jwt-private.key`, privateKey);
    writeFileSync(`${path}/jwt-public.key`, publicKey);
  }
};

const ensureKeys = (appKey?: string, force?: boolean) => {
  const path = `${process.cwd()}/.keys`;

  if (!existsSync(path)) {
    mkdirSync(path);
  }

  if (
    (!existsSync(`${path}/jwt-private.key`) &&
      !existsSync(`${path}/jwt-public.key`)) ||
    force
  ) {
    generateKeys(path, appKey);
  }
};

const getKey = (keyType: string): string => {
  ensureKeys();

  if (keyType === 'private') {
    return readFileSync(`${process.cwd()}/.keys/jwt-private.key`).toString();
  }

  if (keyType === 'public') {
    return readFileSync(`${process.cwd()}/.keys/jwt-public.key`).toString();
  }

  return null;
};

// const encryptData = (value: string, key: Buffer): string => {
//   const cipher = crypto.createCipheriv(algorithm, key, cryptoIv);
//   let encrypted = cipher.update(value, 'utf8', 'hex');
//   encrypted += cipher.final('hex');

//   return encrypted;
// };

// const decryptData = (value: string, key: Buffer): string => {
//   const cipher = crypto.createDecipheriv(algorithm, key, cryptoIv);
//   let decrypted = cipher.update(value, 'hex', 'utf8');
//   decrypted += cipher.final('utf8');

//   return decrypted;
// };

export const Helpers = {
  titleCase,
  getKey,
  ensureKeys,
};

export const slugify = slug;

export const cleanLicensePlate = (value: string): string => {
  return value
    .toUpperCase()
    .split(' ')
    .join('')
    .replace(' ', '')
    .replace('-', '')
    .replace('_', '');
};

/**
 * Return a timestamp, optionally passing in extra seconds to add to the timestamp.
 *
 * @param  {Number} ttl The extra seconds to add to the timestamp
 * @return {Number}     A timestamp in seconds
 */
export const now = (ttl?: number): number => {
  if (ttl === undefined || ttl === null) {
    ttl = 0;
  } else {
    ttl = ttl * 60;
  }

  return Math.floor(Date.now() / 1000) + ttl;
};

export const toBool = (value: any): boolean => {
  return (
    /true/i.test(value.toLowerCase()) ||
    value === 1 ||
    value === '1' ||
    value.toLowerCase() === 'yes'
  );
};

export const route = (params?: object) => {
  const root = (frontend?: boolean): string => {
    return FormatUrl(
      new URL(
        !frontend
          ? [process.env.APP_URL, process.env.APP_BASE_PATH].join('/')
          : process.env.APP_FRONTEND_URL,
      ),
    );
  };

  const toFullUrl = (path: string, frontend?: boolean, relative?: boolean) => {
    const urlChunks = [];
    if (!relative) urlChunks.push(root(frontend));

    urlChunks.push(path);

    return FormatUrl(new URL(urlChunks.join('/')));
  };

  return { root, toFullUrl };
};
