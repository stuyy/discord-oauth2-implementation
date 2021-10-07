import { authHeaders, decryptToken } from '../../utils/helpers';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import {
  DiscordOAuth2UserResponse,
  DISCORD_API_ROUTES,
} from '../../utils/types';

export async function fetchDiscordUser(accessToken: string) {
  const decryptedToken = decryptToken(accessToken).toString(CryptoJS.enc.Utf8);
  return axios.get<DiscordOAuth2UserResponse>(
    DISCORD_API_ROUTES.OAUTH2_USER,
    authHeaders(decryptedToken)
  );
}
