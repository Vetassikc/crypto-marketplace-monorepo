# AI Smart Search (Розумний Пошук)

**Статус:** `Production Ready` 🟢
**Модель:** `gemini-2.0-flash-exp`

## 1. Концепція
Класичні пошукові системи змушують користувача думати ключовими словами ("ноутбук ціна 500"). **Smart Search** дозволяє спілкуватися з маркетплейсом природною мовою, як з консультантом у магазині.

*"Знайди мені ігровий ноутбук до 1000 доларів, але не HP"*

## 2. Як це працює (Under the Hood)

Ми не використовуємо прямий пошук по тексту. Замість цього ми використовуємо LLM (Large Language Model) як "перекладач" намірів користувача у структурований запит до бази даних.

### Процес обробки запиту (Pipeline):
1.  **User Input:** Користувач вводить довільний текст.
2.  **LLM Parsing:** Запит відправляється до спеціалізованого агента на базі Gemini 2.0.
3.  **Extraction:** AI витягує сутності:
    *   `query`: Ключові слова для Full-text search (Fuzzy search).
    *   `minPrice` / `maxPrice`: Ціновий діапазон.
    *   `sortBy`: Критерій сортування (ціна, новизна, популярність).
    *   `sortOrder`: Напрямок (зростання/спадання).
4.  **Backend Execution:** Отриманий JSON передається в `ListingsService`, який будує Prisma SQL запит.
5.  **Feedback UI:** Користувач бачить "чіпси" (активні фільтри), які AI встановив за нього.

## 3. Технічна Реалізація

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

### Ключовий код

**Frontend (`apps/web`):**
Візуалізація стану AI ("Analyzing...") та відображення динамічних фільтрів реалізована в `apps/web/app/listings/page.tsx`.

**Backend Service (`apps/api`):**
Логіка фільтрації розширена для підтримки діапазонів цін:
```typescript
// prisma query builder example
where: {
  price: {
    gte: minPrice,
    lte: maxPrice
  }
}
```
