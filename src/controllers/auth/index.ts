import { Request, Response } from 'express';
import {
  createUser,
  encryptTokens,
  exchangeAccessCodeForCredentials,
  getDiscordUserDetails,
  revokeToken,
} from '../../services/auth';
import {
  buildOAuth2CredentialsRequest,
  buildUser,
  decryptToken,
  encryptToken,
} from '../../utils/helpers';
import { serializeSession } from '../../utils/session';
import CryptoJS from 'crypto-js';

export async function authDiscordRedirectController(
  req: Request,
  res: Response
) {
  const { code } = req.query;
  if (code) {
    try {
      const payload = buildOAuth2CredentialsRequest(code.toString());
      const { data: credentials } = await exchangeAccessCodeForCredentials(
        payload
      );
      const { access_token, refresh_token } = credentials;
      const { data: user } = await getDiscordUserDetails(access_token);
      const tokens = encryptTokens(access_token, refresh_token);
      const newUser = await createUser(buildUser(user, tokens));
      await serializeSession(req, newUser);
      res.send(newUser);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }
}

export async function getAuthenticatedUserController(
  req: Request,
  res: Response
) {
  return req.user ? res.send(req.user) : res.send(401);
}

export async function revokeAccessTokenController(req: Request, res: Response) {
  if (!req.user) return res.sendStatus(401);
  try {
    await revokeToken(req.user.accessToken);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}
