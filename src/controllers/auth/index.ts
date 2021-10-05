import { Request, Response } from 'express';
import {
  createUser,
  exchangeAccessCodeForCredentials,
  getDiscordUserDetails,
} from '../../services/auth';
import { buildOAuth2CredentialsRequest, buildUser } from '../../utils/helpers';

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
  res.send(200);
}

export async function revokeAccessTokenController(req: Request, res: Response) {
  res.send(200);
}
