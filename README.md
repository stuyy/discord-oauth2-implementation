# Discord OAuth2 Implementation Tutorial

This is the code repository for my Discord OAuth2 Implementation Tutorial. You can find the tutorial [here](https://www.youtube.com/watch?v=RP0P_zGdvj8)

# Installation & Instructions

If you wish to use this code, please follow the instructions on how to set everything up.

Pre-requisites:

- Clone the repository
- Run `npm install` or `yarn install`

1. Create a Discord Application on the Discord Developer Portal
2. Create a `.env` file to store your environment variables. This is optional, you may choose to store them however you like. There are 4 environment variables that I have created and used in this project.

   - **_DISCORD_OAUTH_CLIENT_ID_** - The Client ID of the Discord Application.
   - **_DISCORD_OAUTH_SECRET_** - The Client Secret of the Discord Application
   - **_DISCORD_REDIRECT_URL_** - The Redirect Url Discord redirects to upon authorization (success, or fail).
   - **_PORT_** - The port the express server runs on

   Your variables in the .env file should look like this:

   ```
   DISCORD_OAUTH_CLIENT_ID=MY CLIENT ID
   DISCORD_OAUTH_SECRET=MY CLIENT SECRET
   DISCORD_REDIRECT_URL=http://myredirecturl/api/some/redirect/url
   PORT=8081
   ```

   *Be sure to place the .env file in the *root* directory, not inside the `src` folder, but outside of it.* Additionally, the environment variables stored in the `.env` file will not replace your Operating System's user or system variables. The environment variables will also return as undefined if you execute the code in a directory that does _not_ have the .env file. So if you have your `.env` file in `discord-oauth2-implementation`, but you're executing the `index.ts` file from `discord-oauth2-implementation/src`, the environment variables will not be loaded, thus, you should be executing the index file from the root directory.

3. To start the project in "Developer" mode, aka, using nodemon, you can run `yarn start:dev` or `npm run start:dev`. This will be handy for development. As you make changes, the running process will restart without you needing to manually exit & starting it each time.

4. To start the project in normal "production" mode, you should run the `build` command first before running the `start` command. Using the build command will compile all TypeScript files to JavaScript. This is recommended for production.
   - Running the build command will create a `dist` folder in the root directory with all the compiled JavaScript code.

# Routes

**GET** /api/auth/discord/redirect

- Redirects to this route once the user clicks the "Authorize" button on Discord's platform.

**GET** /api/auth/user

- Retrieves the authenticated user. Uses the `access_token` retrieved upon authorization to retrieve the information from Discord's /api/user/@me route.

**GET** /api/auth/revoke

- Revokes the access token. This unauthorizes the access token from further use on behalf of the authenticated user.

---

_Please note that this code is for educational purposes only and not intended to be for immediate usage for production environments. Additionally, the code does NOT persist any user's sessions or save & encrypt access & refresh tokens. If you wish to create persistence, you should install a database and save necessary data for your application._
