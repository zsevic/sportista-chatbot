# sportista-chatbot

> Chatbot for sportista.fit

## Getting started

### Prerequisites

- Node version 14
- Local PostgreSQL database

### Setup

* Local setup

```bash
git clone https://github.com/zsevic/sportista-chatbot
cd sportista-chatbot
cp .env.sample .env # change values after copying
npm i
pg_ctl -D /usr/local/var/postgres restart
npm run start:dev
```

* Chatbot setup for local usage

```bash
ngrok http 3000
```
change `EXTENSIONS_URL` environment variable with the given ngrok Forwarding https value
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "domain_whitelisting",
  "whitelisted_domains" : [$EXTENSIONS_URL],
  "domain_action_type": "add"
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=$FB_PAGE_ACCESS_TOKEN"
```
```bash
npm run start:dev
```
Change webhook callback URL with the given ngrok Forwarding https value and validate it inside Messenger/Settings section - https://developers.facebook.com/apps/<FB_APP_ID>/messenger/settings/

### Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing

```bash
npm test
```

### Migrations

```bash
npm run migration:generate <MIGRATION_NAME>
npm run migrate
npm run migrate:down
```

### API documentation

Generated at `/api-docs` endpoint

### Technologies used

- Node.js, TypeScript, NestJS, TypeORM, BootBot
