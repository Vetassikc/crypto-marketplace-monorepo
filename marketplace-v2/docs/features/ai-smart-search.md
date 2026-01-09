# AI Smart Search

**Status:** `Production Ready` 🟢
**Model:** `gemini-2.0-flash-exp`

## 1. Concept
Traditional search engines force users to think in keywords ("laptop price 500"). **Smart Search** allows communicating with the marketplace in natural language, just like with a store consultant.

*"Find me a gaming laptop under $1000, but not HP"*

## 2. How It Works (Under the Hood)

We do not use direct text matching. Instead, we use an LLM (Large Language Model) as a "translator" of user intent into a structured database query.

### Request Pipeline:
1.  **User Input:** User enters arbitrary text.
2.  **LLM Parsing:** The request is sent to a specialized agent based on Gemini 2.0.
3.  **Extraction:** AI extracts entities:
    *   `query`: Keywords for Full-text search (Fuzzy search).
    *   `minPrice` / `maxPrice`: Price range.
    *   `sortBy`: Sort criterion (price, date, popularity).
    *   `sortOrder`: Direction (asc/desc).
4.  **Backend Execution:** The received JSON is passed to `ListingsService`, which constructs the Prisma SQL query.
5.  **Feedback UI:** The user sees "chips" (active filters) that the AI has set for them.

## 3. Technical Implementation

### API Endpoint
`POST /api/smart-search`

**Request:**
```json
{
  "query": "cheap iphone under 500"
}
```

**Response (AI Generated):**
```json
{
  "query": "iphone",
  "maxPrice": 500,
  "sortBy": "price",
  "sortOrder": "asc"
}
```

### Key Code

**Frontend (`apps/web`):**
Visualization of AI state ("Analyzing...") and display of dynamic filters is implemented in `apps/web/app/listings/page.tsx`.

**Backend Service (`apps/api`):**
Filtering logic extended to support price ranges:
```typescript
// prisma query builder example
where: {
  price: {
    gte: minPrice,
    lte: maxPrice
  }
}
```
