import { AxiosRequestConfig } from 'axios';
import url from 'url';
import {
  CreateUserParams,
  DiscordOAuth2CredentialsResponse,
  DiscordOAuth2UserResponse,
  OAuth2ExchangeRequestParams,
} from './types';

const { DISCORD_OAUTH_CLIENT_ID, DISCORD_OAUTH_SECRET, DISCORD_REDIRECT_URL } =
  process.env;

export const buildOAuth2RequestPayload = (data: OAuth2ExchangeRequestParams) =>
  new url.URLSearchParams(data).toString();

export const authHeaders = (accessToken: string): AxiosRequestConfig => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const buildUser = (
  user: DiscordOAuth2UserResponse,
  credentials: DiscordOAuth2CredentialsResponse
): CreateUserParams => ({
  discordId: user.id,
  username: user.username,
  discriminator: user.discriminator,
  avatar: user.avatar,
  tag: `${user.username}#${user.discriminator}`,
  accessToken: credentials.access_token,
  refreshToken: credentials.refresh_token,
});

export const buildOAuth2CredentialsRequest = (code: string) => ({
  client_id: DISCORD_OAUTH_CLIENT_ID || '',
  client_secret: DISCORD_OAUTH_SECRET || '',
  grant_type: 'authorization_code',
  redirect_uri: DISCORD_REDIRECT_URL || '',
  code,
});
