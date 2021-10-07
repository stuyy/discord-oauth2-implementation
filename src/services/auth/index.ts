import axios from 'axios';
import CryptoJS from 'crypto-js';
import url from 'url';
import { getRepository } from 'typeorm';
import { User } from '../../typeorm/entities/User';
import { axiosConfig } from '../../utils/constants';
import {
  authHeaders,
  buildOAuth2RequestPayload,
  decryptToken,
  encryptToken,
} from '../../utils/helpers';
import {
  CreateUserParams,
  DiscordOAuth2CredentialsResponse,
  DiscordOAuth2UserResponse,
  DISCORD_API_ROUTES,
  EncryptedTokens,
  OAuth2ExchangeRequestParams,
} from '../../utils/types';

const userRepository = getRepository(User);

export async function exchangeAccessCodeForCredentials(
  data: OAuth2ExchangeRequestParams
) {
  const payload = buildOAuth2RequestPayload(data);
  return axios.post<DiscordOAuth2CredentialsResponse>(
    DISCORD_API_ROUTES.OAUTH2_TOKEN,
    payload,
    axiosConfig
  );
}

export async function getDiscordUserDetails(accessToken: string) {
  return axios.get<DiscordOAuth2UserResponse>(
    DISCORD_API_ROUTES.OAUTH2_USER,
    authHeaders(accessToken)
  );
}

export async function createUser(params: CreateUserParams) {
  const userDB = await userRepository.findOne({ discordId: params.discordId });

  if (userDB) {
    const updatedUser = await updateUser(userDB, params);
    return updatedUser;
  }
  const newUser = userRepository.create(params);
  return userRepository.save(newUser);
}

export async function updateUser(user: User, params: CreateUserParams) {
  user.discriminator = params.discriminator;
  user.tag = params.tag;
  user.username = params.username;
  user.avatar = params.avatar;
  user.accessToken = params.accessToken;
  user.refreshToken = params.refreshToken;
  return userRepository.save(user);
}

export function encryptTokens(
  accessToken: string,
  refreshToken: string
): EncryptedTokens {
  return {
    accessToken: encryptToken(accessToken).toString(),
    refreshToken: encryptToken(refreshToken).toString(),
  };
}

export async function revokeToken(accessToken: string) {
  const decryptedToken = decryptToken(accessToken).toString(CryptoJS.enc.Utf8);
  console.log(decryptedToken);
  const formData = new url.URLSearchParams({
    client_id: process.env.DISCORD_OAUTH_CLIENT_ID!,
    client_secret: process.env.DISCORD_OAUTH_SECRET!,
    token: decryptedToken,
  });
  return axios.post(
    DISCORD_API_ROUTES.OAUTH2_TOKEN_REVOKE,
    formData.toString(),
    axiosConfig
  );
}
