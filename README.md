# sportista-chatbot

> Chatbot for sportista.fit

## Getting started

### Prerequisites

* Node version 14
* Local PostgreSQL database

### Setup

```bash
git clone https://github.com/zsevic/sportista-chatbot
cd sportista-chatbot
cp .env.sample .env # change values after copying
npm i
pg_ctl -D /usr/local/var/postgres restart
npm run dev
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

### Technologies used

- Node.js, TypeScript, NestJS, TypeORM, BootBot
