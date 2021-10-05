import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Session } from '../typeorm/entities/Session';
import { User } from '../typeorm/entities/User';
import cookieParser from 'cookie-parser';
const sessionRepository = getRepository(Session);

export async function serializeSession(req: Request, user: User) {
  req.session.user = user;
  req.user = user;
  const session = sessionRepository.create({
    sessionId: req.sessionID,
    expiresAt: req.session.cookie.expires,
    data: JSON.stringify(user),
  });
  return sessionRepository.save(session);
}

export async function deserializeSession(
  req: Request,
  res: Response,
  next: Function
) {
  const { DISCORD_OAUTH2_SESSION_ID } = req.cookies;
  if (!DISCORD_OAUTH2_SESSION_ID) return next();

  const sessionId = cookieParser
    .signedCookie(DISCORD_OAUTH2_SESSION_ID, 'ASDSAJHDGASJDHASDABSDHJASGDAJHD')
    .toString();
  const sessionDB = await sessionRepository.findOne({
    sessionId: sessionId,
  });
  if (!sessionDB) {
    console.log('No Session');
    return next();
  }
  const currentTime = new Date();
  if (sessionDB.expiresAt < currentTime) {
    console.log('Session Expired');
    await sessionRepository.delete(sessionDB);
    console.log('Session Deleted');
  } else {
    console.log('Session Not Expired');
    const data = JSON.parse(sessionDB.data);
    req.user = data;
  }
  next();
}
