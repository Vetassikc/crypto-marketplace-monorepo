# Magic Write

**Status:** `Production Ready` 🟢
**Model:** `gemini-2.0-flash-exp` (Multimodal Vision)

## 1. Overview
Writing product descriptions is routine and difficult work for sellers. **Magic Write** automates this process. The seller simply uploads a photo, and the AI creates a professional, SEO-optimized listing in seconds.

## 2. Capabilities
- **Image Analysis:** Recognizes product type, material, brand (if logo is visible), color, and condition.
- **Copywriting:** Generates "sales-oriented" text focused on the buyer.
- **Structuring:** Automatically breaks the description into logical blocks (Title, Description, Features).

## 3. Integration

### "Magic Write" Button
A button with a "magic wand" icon has been added to the product creation form (`/sell`). It is active only when the user has added an image link.

### Prompt Engineering
We use a specially tuned System Prompt to achieve consistency:

> "You are an expert e-commerce copywriter. Analyze this image and generate a professional listing. Output Format: Title, Description (max 3 sentences), Key Features (bullet points), Condition, Material."

This guarantees that all products on the marketplace will have a unified, professional description style, even if the seller is not a skilled copywriter.

## 4. Example Output

**Input:** Photo of an Orange iPhone.

**Result:**
*   **Title:** Sunset Glow iPhone 15 Pro - 256GB - Excellent Condition
*   **Description:** Experience the energy with this vibrant Sunset Glow iPhone. The device is in perfect condition, scratch-free, ready to be your reliable assistant.
*   **Features:**
    *   Exclusive Color
    *   Pro Camera System
    *   Ceramic Shield
