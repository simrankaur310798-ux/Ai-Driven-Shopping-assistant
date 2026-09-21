# SmartShop Backend

Standalone API for SmartShop lookbook generation and product enrichment.

## Local setup

```bash
cd backend
npm install
cp .env.example .env
```

Set `OPENAI_API_KEY` and `SERPAPI_KEY` in `backend/.env`, then run:

```bash
npm run dev
```

The API runs on `http://localhost:4000`.

- `GET /health`
- `POST /api/curate`

Example request:

```bash
curl -X POST http://localhost:4000/api/curate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Goa trip clothes for 3 days under INR 10000"}'
```

## Production

```bash
npm run build
npm start
```

For Railway, set the root directory to `backend`, configure the environment variables from `.env.example`, and use the start command `npm start`. Set the frontend's `NEXT_PUBLIC_API_URL` to the deployed backend URL.
