require('dotenv').config();
import 'reflect-metadata';
import { Request, Response } from 'express';
import express from 'express';
import url from 'url';
import axios from 'axios';

const PORT = process.env.PORT || 3001;

let accessToken = '';
let refreshToken = '';

const { DISCORD_OAUTH_CLIENT_ID, DISCORD_OAUTH_SECRET, DISCORD_REDIRECT_URL } =
  process.env;

const app = express();

app.get('/api/auth/discord/redirect', async (req: Request, res: Response) => {
  const { code } = req.query;
  if (code) {
    try {
      const formData = new url.URLSearchParams({
        client_id: DISCORD_OAUTH_CLIENT_ID!,
        client_secret: DISCORD_OAUTH_SECRET!,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: DISCORD_REDIRECT_URL!,
      });
      const response = await axios.post(
        'https://discord.com/api/v8/oauth2/token',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const { access_token, refresh_token } = response.data;
      accessToken = access_token;
      refreshToken = refresh_token;
      console.log(accessToken, refresh_token);
      res.send(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }
});

app.get('/api/auth/user', async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://discord.com/api/v8/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.send(response.data);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.get('/api/auth/revoke', async (req: Request, res: Response) => {
  const formData = new url.URLSearchParams({
    client_id: DISCORD_OAUTH_CLIENT_ID!,
    client_secret: DISCORD_OAUTH_SECRET!,
    token: accessToken,
  });
  try {
    const response = await axios.post(
      'https://discord.com/api/v8/oauth2/token/revoke',
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    res.send(response.data);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.listen(PORT, () => console.log('Listening on Port:', PORT));
