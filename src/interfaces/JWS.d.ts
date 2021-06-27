export interface JWS {
  header: {
    typ: string;
    alg: string;
    kid: string;
  };
  payload: string;
  signature: string;
  protected?: string;
}
