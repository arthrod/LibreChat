# Cicero Assistant

Cicero Assistant is the chat component of the Cicero platform.  It provides a
multi‑model conversational interface and is available at
[chat.cicero.im](https://chat.cicero.im).

## Integration

1. Deploy the application and configure the following environment variables:
   - `DOMAIN_CLIENT=https://chat.cicero.im`
   - `DOMAIN_SERVER=https://chat.cicero.im`
   - `APP_TITLE=Cicero Assistant`
   - `HELP_AND_FAQ_URL=https://www.cicero.im/dashboard`
   - `EMAIL_FROM=talk-a-human@cicero.im`
   - `CLERK_PUBLISHABLE_KEY=<your publishable key>`
   - `CLERK_SECRET_KEY=<your secret key>`
   - `GOOGLE_CLIENT_ID=<your google client id>`
   - `GOOGLE_CLIENT_SECRET=<your google client secret>`

2. Set up [Clerk](https://www.cicero.im/dashboard) and enable Google OAuth.

3. Use Clerk's frontend SDK to authenticate users and redirect them to
   [www.cicero.im/dashboard](https://www.cicero.im/dashboard) after login.

Support requests can be sent to **talk-a-human@cicero.im**.

