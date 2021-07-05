import { JWE } from 'did-jwt';
import { JWS } from './JWS';

export interface IDIDCommAttachment {
  id: string;
  description?: string;
  filename?: string;
  mime_type?: string;
  lastmod_time?: string;
  byte_count?: number;
  data: {
    jws?: JWS;
    hash?: string;
    links?: string[];
    base64?: string;
    jwe?: JWE;
    json?: object;
  };
}
