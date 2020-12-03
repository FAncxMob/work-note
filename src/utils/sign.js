import sign from '@tdsdk/sign';
import Config from '../../app/config';

const { SignType, SignKey } = Config;

function uuid2(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (let i = 0; i < len; i++) {
      // tslint:disable-next-line: no-bitwise
      uuid[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        // tslint:disable-next-line: no-bitwise
        const r = 0 | (Math.random() * 16);
        // tslint:disable-next-line: no-bitwise
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

function generateSIGN(data) {
  if (!SignKey) return undefined;
  return sign(SignType, SignKey, data);
}

export function signHeader() {
  const headers = {};
  const NONCE = uuid2();
  const TIMESTAMP = new Date().valueOf();
  const TOKEN = window.User.getToken();

  headers['SIGN-TYPE'] = SignType.toUpperCase();
  headers.SIGN = generateSIGN({ TIMESTAMP, NONCE, TOKEN });
  headers.TIMESTAMP = TIMESTAMP;
  headers.NONCE = NONCE;
  headers.TOKEN = TOKEN;
  headers.traceId = new Date().valueOf().toString(32);

  return headers;
}
