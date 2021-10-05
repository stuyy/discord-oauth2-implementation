import { Request, Response } from 'express';
import {
  createUser,
  exchangeAccessCodeForCredentials,
  getDiscordUserDetails,
} from '../../services/auth';
import { buildOAuth2CredentialsRequest, buildUser } from '../../utils/helpers';
import { serializeSession } from '../../utils/session';

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
      const { data: user } = await getDiscordUserDetails(
        credentials.access_token
      );
      const newUser = await createUser(buildUser(user, credentials));
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
  return req.user ? res.send(req.user) : res.send(401);
}
