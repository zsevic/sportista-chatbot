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
npx ngrok http 3000
export EXTENSIONS_URL=<URL>
npm run messenger-profile:set
echo "Y" | npm run messenger-webhook:set <URL>/webhooks/messenger
```

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

- Node.js, TypeScript, NestJS, TypeORM, Bottender
