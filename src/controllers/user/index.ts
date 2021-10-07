import { Request, Response } from 'express';
import { fetchDiscordUser } from '../../services/user';

export async function getDiscordUser(req: Request, res: Response) {
  if (!req.user) return res.send(401);
  try {
    const { accessToken } = req.user;
    const { data: user } = await fetchDiscordUser(accessToken);
    res.send(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}
