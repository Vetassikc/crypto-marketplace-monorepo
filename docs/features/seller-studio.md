# Seller Studio

Status: In Development

## 1. Purpose
Seller Studio is the control center where sellers create, edit, and manage listings.

## 2. Current Capabilities
- Create new listing with title, description, price, category, and image URL.
- Edit existing listing (`/sell?edit=<id>`).
- Delete listings from "My Listings".
- AI-assisted draft generation ("Magic Write").

## 3. Current Technical Flow
1. Wallet-connected user is checked by `AuthGuard`.
2. Seller form submits to API:
   - `POST /listings` for create
   - `PATCH /listings/:id` for edit
3. User inventory is read from:
   - `GET /listings?sellerId=<userId>`

## 4. Gaps to Production
1. Strong ownership enforcement on backend (required).
2. Media pipeline beyond URL input (upload + virus scan + optimization).
3. Draft/publish states and moderation pipeline.
4. Seller analytics and conversion metrics.

## 5. Planned Enhancements
- Rich media uploads
- AI pricing assistant
- Conversion analytics dashboard
- Listing quality score and optimization hints
