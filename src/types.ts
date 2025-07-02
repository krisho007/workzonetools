export interface WzToolsConfig {
  clientId: string;
  clientSecret: string;
  userId: string;
  password: string;
  xsuaaUrl: string;
  workzoneHost: string;
  subdomain: string;
  subaccountId: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  jti: string;
}

export interface ClearCacheRequest {
  providerId: string;
  contentAdditionMode: string;
  subdomain: string;
  subaccountId: string;
}

export interface InitOptions {
  clientId?: string;
  clientSecret?: string;
  userId?: string;
  password?: string;
  xsuaaUrl?: string;
  workzoneHost?: string;
  subdomain?: string;
  subaccountId?: string;
} 