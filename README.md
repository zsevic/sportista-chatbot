# nestjs-starter

> Minimal NestJS boilerplate

## Getting started

### Setup

```bash
git clone https://github.com/zsevic/nestjs-starter
cd nestjs-starter
cp .env.sample .env # change values after copying
npm i
npm run start:dev
```

### Build

```bash
npm run build
npm start
```

### Docker build

```bash
docker build -t nestjs-starter .
docker run -e PORT=8080 -d -p 8080:8080 nestjs-starter
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

### Seeders

```bash
npm run seed:generate <SEEDER_NAME>
npm run seed
npm run seed:down
```

### API documentation

API documentation is generated using [@nestjs/swagger](https://www.npmjs.com/package/@nestjs/swagger) module at `/api-docs` endpoint

### Technologies used

- Node.js, TypeScript, NestJS, TypeORM
