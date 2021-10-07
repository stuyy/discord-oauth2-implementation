import { AxiosRequestConfig } from 'axios';
import url from 'url';
import {
  CreateUserParams,
  DiscordOAuth2CredentialsResponse,
  DiscordOAuth2UserResponse,
  EncryptedTokens,
  OAuth2ExchangeRequestParams,
} from './types';
import CryptoJS from 'crypto-js';

const {
  DISCORD_OAUTH_CLIENT_ID,
  DISCORD_OAUTH_SECRET,
  DISCORD_REDIRECT_URL,
  ENCRYPT_SECRET,
} = process.env;

export const encryptToken = (token: string) =>
  CryptoJS.AES.encrypt(token, ENCRYPT_SECRET!);

export const decryptToken = (encrypted: string) =>
  CryptoJS.AES.decrypt(encrypted, ENCRYPT_SECRET!);

export const buildOAuth2RequestPayload = (data: OAuth2ExchangeRequestParams) =>
  new url.URLSearchParams(data).toString();

export const authHeaders = (accessToken: string): AxiosRequestConfig => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const buildUser = (
  user: DiscordOAuth2UserResponse,
  credentials: EncryptedTokens
): CreateUserParams => ({
  discordId: user.id,
  username: user.username,
  discriminator: user.discriminator,
  avatar: user.avatar,
  tag: `${user.username}#${user.discriminator}`,
  accessToken: credentials.accessToken,
  refreshToken: credentials.refreshToken,
});

export const buildOAuth2CredentialsRequest = (code: string) => ({
  client_id: DISCORD_OAUTH_CLIENT_ID || '',
  client_secret: DISCORD_OAUTH_SECRET || '',
  grant_type: 'authorization_code',
  redirect_uri: DISCORD_REDIRECT_URL || '',
  code,
});
