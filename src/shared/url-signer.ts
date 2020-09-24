import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { route, now } from './helpers';
import { Url, parse, format as FormatUrl } from 'url';
import { Encrypter } from './encrypter';

interface ISignerOptions {
  ttl?: number;
  method?: string;
  expire?: number;
}

@Injectable()
export class UrlSigner {
  ENC_CHARS = {
    '+': '-',
    '/': '_',
    '=': '',
  };

  DEC_CHARS = {
    '-': '+',
    _: '/',
    // '.': '=',
  };

  sigKey = 'sig';
  expKey = 'expires';
  expiry = 3600;

  constructor(public encrypter: Encrypter) {}

  public hash(url: URL) {
    url.searchParams.delete(this.sigKey);

    url.searchParams.sort();

    const hmac: string = this.encrypter.hash_hmac('sha256', FormatUrl(url));

    return hmac;
  }

  public sign(url: string, options?: ISignerOptions, params?: any) {
    const ttl: number = (options && options.ttl) ?? null;
    const expire: number = ttl && now(ttl);

    if (params.length) {
      url += `/${params.join('/')}`;
    }

    const uri = new URL(url);

    uri.searchParams.delete(this.expKey);

    if (expire) uri.searchParams.append(this.expKey, expire.toString());

    uri.searchParams.set(this.sigKey, this.hash(uri));
    return FormatUrl(uri);
  }

  public verify(url: string, options?: ISignerOptions) {
    if (!this.signatureNotExpired(url)) {
      throw new HttpException(
        'The requested Url has expired',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.validSignature(url);
  }

  public validSignature(url: string) {
    const uri = new URL(url);
    const signature = uri.searchParams.get(this.sigKey);
    uri.searchParams.sort();

    return this.encrypter.hash_equal(this.hash(uri), signature);
  }

  public signatureNotExpired(url: string) {
    const uri = new URL(url);

    let expire: any = uri.searchParams.get(this.expKey);
    expire = expire ? parseInt(uri.searchParams.get(this.expKey), 10) : null;

    return expire ? expire > Date.now() / 1000 : true;
  }

  /**
   * encode base64 string url safe
   * @param {String} base64 - base64 encoded string
   * @return {String} url-safe-base64 encoded
   */
  private encodeUrlSafe(base64: string): string {
    return base64.replace(/[+/=]/g, m => this.ENC_CHARS[m]);
  }

  /**
   * decode url-safe-base64 string to base64
   * @param {String} safe - url-safe-base64 string
   * @return {String} base64 encoded
   */
  private decodeUrlSafe(safe: string): string {
    return safe.replace(/[-_.]/g, m => this.DEC_CHARS[m]);
  }
}
