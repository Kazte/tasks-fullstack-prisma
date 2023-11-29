# Tasks.

This is a [Next.js](https://nextjs.org/) task/todo fullstack project using [NextAuth](https://next-auth.js.org/), [DaisyUI](https://daisyui.com/) and [PostgreSQL](https://www.postgresql.org/)

## Getting Started

Complete the .env with the following variables:

```
# only for development purpose
DATABASE_URL="postgresql://kazte:V93xiyJYzP5HUYYF5@localhost:5433/tasks_db?schema=public"

# whatever port you use
NEXTAUTH_URL="http://localhost:3000"

NEXTAUTH_SECRET="ANY-SECRET-RANDOM-SUPERSECRET-WORD"
```

Build up the docker PostgreSQL server

```bash
docker compose up
```

Initialize the dev server

I prefer yarn but you can use whatever you want 👨🏻‍💻

```bash
yarn install

yarn migrate

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
