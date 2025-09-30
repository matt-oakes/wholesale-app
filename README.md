# Wholesale App

## Requirements

- NodeJS
- pnpm
- Docker Compose

## Installation

```
pnpm install
```

## Development

Start the database locally with:

```
docker-compose up -d
```

When this is running add the tables with:

```
node ace migration:run
```

Start the dev server with:

```
pnpm run dev
```

## Building for production

Build the app with:

```
pnpm run build
```

Follow the instructions after the build is complete.
