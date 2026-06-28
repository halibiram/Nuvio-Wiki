# Nuvio Wiki AI server

## Knowledge backend

The server uses Gemini File Search by default. File Search keeps the wiki index
without a token-hour storage charge and retrieves only relevant documentation
for each question.

Create or check the index manually:

```bash
npm run refresh-file-search
```

The server also checks lazily on the first request after 48 hours. It hashes the
English wiki and only re-indexes when content changed. New stores are fully
indexed before the server switches to them; the replaced store is then deleted.

## Roll back to explicit context caching

The previous cache implementation remains intact. Set this environment variable
and restart the server:

```env
KNOWLEDGE_MODE=cache
```

Then optionally prepare the cache immediately:

```bash
npm run refresh-cache
```

To switch back, set `KNOWLEDGE_MODE=file-search` and restart. The active backend
and resource name are visible at `GET /api/ai/health`.
