require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { User } from './typeorm/entities/User';

const PORT = process.env.PORT || 3001;

async function main() {
  const app = express();
  try {
    await createConnection({
      type: 'mysql',
      username: 'testuser',
      password: 'testuser123',
      database: 'discord_oauth2_db',
      host: 'localhost',
      port: 3306,
      entities: [User],
      synchronize: true,
    });
    console.log('Connected to the Database');
    const { default: routes } = await import('./routes');
    app.use('/api', routes);
    app.listen(PORT, () => console.log('Listening on Port:', PORT));
  } catch (err) {
    console.log(err);
  }
}

main();

// app.get('/api/auth/discord/redirect', async (req: Request, res: Response) => {
//   const { code } = req.query;
//   if (code) {
//     try {
//       const formData = new url.URLSearchParams({
//         client_id: DISCORD_OAUTH_CLIENT_ID!,
//         client_secret: DISCORD_OAUTH_SECRET!,
//         grant_type: 'authorization_code',
//         code: code.toString(),
//         redirect_uri: DISCORD_REDIRECT_URL!,
//       });
//       const response = await axios.post(
//         'https://discord.com/api/v8/oauth2/token',
//         formData.toString(),
//         {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         }
//       );
//       const { access_token, refresh_token } = response.data;
//       accessToken = access_token;
//       refreshToken = refresh_token;
//       console.log(accessToken, refresh_token);
//       res.send(200);
//     } catch (err) {
//       console.log(err);
//       res.sendStatus(400);
//     }
//   }
// });

// app.get('/api/auth/user', async (req: Request, res: Response) => {
//   try {
//     const response = await axios.get('https://discord.com/api/v8/users/@me', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res.send(response.data);
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(400);
//   }
// });

// app.get('/api/auth/revoke', async (req: Request, res: Response) => {
//   const formData = new url.URLSearchParams({
//     client_id: DISCORD_OAUTH_CLIENT_ID!,
//     client_secret: DISCORD_OAUTH_SECRET!,
//     token: accessToken,
//   });
//   try {
//     const response = await axios.post(
//       'https://discord.com/api/v8/oauth2/token/revoke',
//       formData.toString(),
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       }
//     );
//     res.send(response.data);
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(400);
//   }
// });
