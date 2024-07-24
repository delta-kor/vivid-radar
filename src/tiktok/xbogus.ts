import crypto from 'crypto';

export default class XBogus {
  private readonly byteArray: (number | null)[];
  private readonly character: string;
  private uaKey: Buffer;
  private readonly userAgent: string;

  constructor(userAgent: string) {
    // prettier-ignore
    this.byteArray = [
      null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null, null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, null, null, 10, 11, 12, 13, 14, 15
    ];
    this.character = 'Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe=';
    this.uaKey = Buffer.from([0x00, 0x01, 0x0c]);
    this.userAgent = userAgent;
  }

  private md5ToArray(md5: string): number[] {
    if (typeof md5 === 'string' && md5.length > 32) {
      return Array.from(md5).map(char => char.charCodeAt(0));
    } else {
      const array: number[] = [];
      let idx = 0;
      while (idx < md5.length) {
        array.push(
          (this.byteArray[md5.charCodeAt(idx)]! << 4) | this.byteArray[md5.charCodeAt(idx + 1)]!
        );
        idx += 2;
      }
      return array;
    }
  }

  private md5Encrypt(urlParams: string): number[] {
    const hashedUrlParams = this.md5ToArray(this.md5(this.md5ToArray(this.md5(urlParams))));
    return hashedUrlParams;
  }

  private md5(inputData: string | number[]): string {
    let array: number[];
    if (typeof inputData === 'string') {
      array = this.md5ToArray(inputData);
    } else if (Array.isArray(inputData)) {
      array = inputData;
    } else {
      throw new Error('Invalid input type. Expected string or array.');
    }

    const md5hash = crypto.createHash('md5');
    md5hash.update(Buffer.from(array));
    return md5hash.digest('hex');
  }

  private encodingConversion(
    a: number,
    b: number,
    c: number,
    e: number,
    d: number,
    t: number,
    f: number,
    r: number,
    n: number,
    o: number,
    i: number,
    _: number,
    x: number,
    u: number,
    s: number,
    l: number,
    v: number,
    h: number,
    p: number
  ): string {
    const segment: number[] = [a, i];
    segment.push(b, _, c, x, e, u, d, s, t, l, f, v, r, h, n, p, o);
    return Buffer.from(segment).toString('latin1');
  }

  private encodingConversionAlternative(a: number, b: number, c: string): string {
    return String.fromCharCode(a) + String.fromCharCode(b) + c;
  }

  private rc4Encrypt(key: string | Buffer, data: Buffer): Buffer {
    const S: number[] = Array.from({ length: 256 }, (_, i) => i);
    let j = 0;
    const encryptedData: number[] = [];

    for (let i = 0; i < 256; i++) {
      // @ts-ignore
      j = (j + S[i] + key[i % key.length]) % 256;
      [S[i], S[j]] = [S[j], S[i]];
    }

    let i = 0;
    j = 0;
    for (const byte of data) {
      i = (i + 1) % 256;
      j = (j + S[i]) % 256;
      [S[i], S[j]] = [S[j], S[i]];
      const encryptedByte = byte ^ S[(S[i] + S[j]) % 256];
      encryptedData.push(encryptedByte);
    }

    return Buffer.from(encryptedData);
  }

  private calculation(a1: number, a2: number, a3: number): string {
    const x1 = (a1 & 255) << 16;
    const x2 = (a2 & 255) << 8;
    const x3 = x1 | x2 | a3;
    return (
      this.character[(x3 & 16515072) >> 18] +
      this.character[(x3 & 258048) >> 12] +
      this.character[(x3 & 4032) >> 6] +
      this.character[x3 & 63]
    );
  }

  public getXBogus(urlParams: string): string {
    const array1 = this.md5ToArray(
      this.md5(
        Buffer.from(
          this.rc4Encrypt(this.uaKey, Buffer.from(this.userAgent, 'latin1')).toString('base64'),
          'utf-8'
        ).toString('latin1')
      )
    );

    const array2 = this.md5ToArray(this.md5(this.md5ToArray('d41d8cd98f00b204e9800998ecf8427e')));
    const urlParamsArray = this.md5Encrypt(urlParams);

    const timer = Math.floor(Date.now() / 1000);
    const ct = 536919696;
    const array3: number[] = [];
    const array4: number[] = [];
    let result = '';

    const newArray: (number | null)[] = [
      64,
      0.00390625,
      1,
      12,
      urlParamsArray[14],
      urlParamsArray[15],
      array2[14],
      array2[15],
      array1[14],
      array1[15],
      (timer >> 24) & 255,
      (timer >> 16) & 255,
      (timer >> 8) & 255,
      timer & 255,
      (ct >> 24) & 255,
      (ct >> 16) & 255,
      (ct >> 8) & 255,
      ct & 255,
    ];

    let xorResult = newArray[0] as number;
    for (let i = 1; i < newArray.length; i++) {
      let b = newArray[i];
      if (typeof b === 'number') {
        xorResult ^= b;
      }
    }

    newArray.push(xorResult);

    let idx = 0;
    while (idx < newArray.length) {
      array3.push(newArray[idx] as number);
      try {
        array4.push(newArray[idx + 1] as number);
      } catch (e) {
        // Ignore index error
      }
      idx += 2;
    }

    const mergedArray = array3.concat(array4);

    const garbledCode = this.encodingConversionAlternative(
      2,
      255,
      this.rc4Encrypt(
        Buffer.from('ÿ', 'latin1'),
        // @ts-ignore
        Buffer.from(this.encodingConversion(...mergedArray), 'latin1')
      ).toString('latin1')
    );

    idx = 0;
    while (idx < garbledCode.length) {
      result += this.calculation(
        garbledCode.charCodeAt(idx),
        garbledCode.charCodeAt(idx + 1),
        garbledCode.charCodeAt(idx + 2)
      );
      idx += 3;
    }

    return result;
  }
}
