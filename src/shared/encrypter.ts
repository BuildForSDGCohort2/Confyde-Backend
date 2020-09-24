import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Exception } from 'handlebars';

@Injectable()
export class Encrypter {
  key = '';
  algorithm = '';
  ivLength = 16;

  constructor(private configService: ConfigService) {
    this.key = configService.get('app.key');
    this.algorithm = 'aes-256-cbc';
    this.ivLength = 16;
  }

  /**
   * Create a new encryption key for the given cipher.
   *
   * @param  string  algorithm
   * @return string
   */
  public generateKey(algorithm?: string) {
    return crypto.randomBytes(
      algorithm.toUpperCase() === 'AES-128-CBC' ? 16 : 32,
    );
  }

  /**
   * Encrypt the given value.
   *
   * @param  mixed  value
   * @param  bool  serialize
   * @return string
   *
   */
  public encrypt(value: any, serialize = true) {
    const iv = crypto.randomBytes(this.ivLength);

    // First we will encrypt the value using OpenSSL. After this is encrypted we
    // will proceed to calculating a MAC for the encrypted value so that this
    // value can be verified later as not having been changed by the users.
    const cryptValue = this.open_encrypt(
      serialize ? JSON.stringify(value) : value,
      this.getKey(),
      iv,
    );

    if (!cryptValue) {
      throw new Error('Could not encrypt the data.');
    }

    // Once we get the encrypted value we'll go ahead and base64_encode the input
    // vector and create the MAC for the encrypted value so we can then verify
    // its authenticity. Then, we'll JSON the data into the "payload" array.

    const encIv = this.base64_encode(iv);

    const mac = this.hash(encIv, cryptValue);

    const json = JSON.stringify({ iv: encIv, value: cryptValue, mac });

    return this.base64_encode(json);
  }

  /**
   * Encrypt a string without serialization.
   *
   * @param  string  value
   * @return string
   */
  public encryptString(value: string) {
    return this.encrypt(value, false);
  }

  /**
   * Decrypt the given value.
   *
   * @param  string  payload
   * @param  bool  unserialize
   * @return any
   */
  public decrypt(payload: any, unserialize?: boolean) {
    const newPayload = this.getJsonPayload(payload);

    const iv = this.base64_decode(newPayload.iv, true);

    // Here we will decrypt the value. If we are able to successfully decrypt it
    // we will then unserialize it and return it out to the caller. If we are
    // unable to decrypt this value we will throw out an exception message.
    const decrypted = this.open_decrypt(newPayload.value, this.getKey(), iv);
    if (!decrypted) {
      throw new Error('Could not decrypt the data.');
    }

    return unserialize ? JSON.parse(decrypted) : decrypted;
  }

  /**
   * Decrypt the given string without unserialization.
   *
   * @param  string  payload
   * @return string
   */
  public decryptString(payload: any) {
    return this.decrypt(payload, false);
  }

  /**
   * Create a MAC for the given value.
   *
   * @param  any  iv
   * @param  any  value
   * @return string
   */
  protected hash(iv: any, value: any): string {
    const hmac = crypto.createHmac('sha256', this.key);

    hmac.update(`${iv}${value}`);

    return hmac.digest('hex');
  }

  /**
   * Get the JSON array from the given payload.
   *
   * @param  string  payload
   * @return array
   *
   * @throws \Illuminate\Contracts\Encryption\DecryptException
   */
  protected getJsonPayload(payload: string) {
    const newPayload = JSON.parse(this.base64_decode(payload));

    // If the payload is not valid JSON or does not have the proper keys set we will
    // assume it is invalid and bail out of the routine since we will not be able
    // to decrypt the given value. We'll also check the MAC for this encryption.
    if (!this.validPayload(newPayload)) {
      throw new Error('Decryption Error: The payload is invalid.');
    }

    if (!this.validMac(newPayload)) {
      throw new Error('Decryption Error: The MAC is invalid.');
    }

    return newPayload;
  }

  /**
   * Create a MAC for the given value.
   *
   * @param  any  iv
   * @param  any  value
   * @return string
   */
  public hash_hmac(algo: any, data: any, key?: any, rawOutput?: boolean): any {
    const hmac = crypto.createHmac(algo, key ? key : this.getKey());

    hmac.update(data);

    return rawOutput ? hmac.digest() : hmac.digest('hex');
  }

  /**
   * Timing attsach safe string compare
   *
   * @param known_string string
   * @param user_string string
   */
  public hash_equal(known_string: string, user_string: string): boolean {
    try {
      return crypto.timingSafeEqual(
        Buffer.from(known_string),
        Buffer.from(user_string),
      );
    } catch (ex) {
      return false;
    }
  }

  /**
   * Base64 encode
   *
   * @param value
   */
  public base64_encode(value: any): string {
    return Buffer.from(value).toString('base64');
  }

  /**
   * Base64 decode
   *
   * @param value
   */
  public base64_decode(value: any, bufferOnly?: boolean): any | string {
    const decoded = Buffer.from(value, 'base64');

    return bufferOnly ? decoded : decoded.toString('utf8');
  }

  public sha1(value: string, rawOutput?: boolean): any {
    const hash = crypto.createHash('sha1');
    hash.update(value);

    return rawOutput ? hash.digest() : hash.digest('hex');
  }

  /**
   * Verify that the encryption payload is valid.
   *
   * @param  mixed  payload
   * @return bool
   */
  protected validPayload(payload: any): boolean {
    return (
      this.isArray(payload) &&
      this.isSet(payload.iv, payload.value, payload.mac) &&
      Buffer.byteLength(this.base64_decode(payload.iv, true)) === this.ivLength
    );
  }

  /**
   * Determine if the MAC for the given payload is valid.
   *
   * @param  object  payload
   * @return bool
   */
  protected validMac(payload: any) {
    const bytes = crypto.randomBytes(this.ivLength);
    const calculated = this.calculateMac(payload, bytes);
    const hash = this.hash_hmac('sha256', payload.mac, bytes, true);

    return crypto.timingSafeEqual(hash, calculated);
  }

  /**
   * Calculate the hash of the given payload.
   *
   * @param  object  payload
   * @param  string  bytes
   * @return string
   */
  protected calculateMac(payload: any, bytes: any) {
    const hash = this.hash(payload.iv, payload.value);

    return this.hash_hmac('sha256', hash, bytes, true);
  }

  protected getKey(): Buffer {
    return Buffer.from(this.key, 'base64');
  }

  // algorithm = 'aes-256-cbc',
  //   cryptoIv = Buffer.from(crypto.randomBytes(8)).toString('hex');

  public open_encrypt(value: string, key: Buffer, iv: any): string {
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  }

  public open_decrypt(value: string, key: Buffer, iv: any): string {
    const cipher = crypto.createDecipheriv(this.algorithm, key, iv);
    let decrypted = cipher.update(value, 'hex', 'utf8');
    decrypted += cipher.final('utf8');

    return decrypted;
  }

  private isArray(...mixedVar: any[]) {
    if (!mixedVar.length) {
      throw new Error('Valid argument is required to check');
    }

    const isArray = (entry: any) => Array.isArray(entry);
    const isObject = (entry: any) => typeof entry === 'object';

    const invalids = mixedVar.filter(mVar => !isArray(mVar) && !isObject(mVar));

    return invalids.length === 0;
  }

  private isSet(...mixedVar: any[]): boolean {
    const invalids = mixedVar.filter(
      mVar =>
        mVar === null &&
        mVar === undefined &&
        mVar === 'undefined' &&
        mVar === null,
    );

    return invalids.length === 0;
  }
}
