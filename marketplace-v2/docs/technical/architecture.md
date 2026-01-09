# Технічна Архітектура Marketplace V2

## 1. Загальний Огляд
Marketplace V2 побудований на сучасній **Monorepo** архітектурі, використовуючи **TurboRepo** для керування пакетами та процесами. Це забезпечує єдиний стандарт коду, спільні типи (TypeScript interfaces) та швидкі білди.

## 2. Tech Stack

### Frontend (`apps/web`)
*   **Framework:** Next.js 14+ (App Router).
*   **Styling:** Tailwind CSS + Custom Design System ("Aurora Theme").
*   **State Management:** React Query (TanStack Query) — для серверного стану та кешування.
*   **Context API:** для локального UI стану (SearchContext).

### Backend (`apps/api`)
*   **Framework:** NestJS.
*   **Architecture:** Модульна (ListingsModule, OrdersModule).
*   **ORM:** Prisma.
*   **Database:** PostgreSQL.

### AI Integration
*   **SDK:** Vercel AI SDK (`ai`, `@ai-sdk/google`).
*   **Provider:** Google Gemini API.

## 3. Схема Даних (Prisma Schema)

Ключові моделі:
*   `Listing`: Товар (назва, опис, ціна, зв'язок з продавцем).
*   `User`: Користувач платформи.
*   `Order`: Замовлення (зв'язок Buyer <-> Listing).

## 4. Design System "Aurora"
Ми відходимо від стандартного Material Design або Bootstrap в сторону кастомного, преміального вигляду.
*   **Glassmorphism:** Активне використання `backdrop-blur` та напівпрозорих фонів.
*   **Gradients:** Використання складних градієнтів для акцентів (кнопки, активні стани).
*   **Dark Mode:** Інтерфейс оптимізований під темну тему за замовчуванням.
