import axios from 'axios';
import { getRepository } from 'typeorm';
import { User } from '../../typeorm/entities/User';
import { axiosConfig } from '../../utils/constants';
import { authHeaders, buildOAuth2RequestPayload } from '../../utils/helpers';
import {
  CreateUserParams,
  DiscordOAuth2CredentialsResponse,
  DiscordOAuth2UserResponse,
  DISCORD_API_ROUTES,
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
  return userRepository.save(user);
}
