## Plant Inventory Backend

Backend API for Plant Inventory Management, built with Express and Supabase.

### Installation & Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with:

   ```bash
   NODE_ENV=development
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   CORS_ORIGIN=http://localhost:5173
   FRONTEND_URL=http://localhost:5173
   ```

3. Ensure a `logs` directory exists (it will be created automatically on first run if missing).

4. Development:

   ```bash
   npm run dev
   ```

5. Production:

   ```bash
   npm start
   ```

### Base URL

`http://localhost:5000/api/v1`

### Auth Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout` (auth)
- `GET /auth/profile` (auth)
- `PUT /auth/profile` (auth)
- `PUT /auth/change-password` (auth)
- `POST /auth/forgot-password`

### Plant Endpoints

- `GET /plants` – filters & pagination
- `GET /plants/statistics`
- `GET /plants/:id`
- `POST /plants`
- `PUT /plants/:id`
- `DELETE /plants/:id`

Query params for `GET /plants`:

- `page` (default: 1)
- `limit` (default: 10, max: 100)
- `plant_type` (`herba|semak|pohon|pemanjat|menjalar`)
- `status` (`hidup|mati|sakit|berbunga`)
- `search`
- `sort_by` (default: `created_at`)
- `sort_order` (`asc|desc`, default: `desc`)

### Image Endpoints

- `POST /images/plants/:plantId` – multipart form, field `images` (array)
- `GET /images/plants/:plantId`
- `PATCH /images/:id/primary`
- `PATCH /images/plants/:plantId/reorder`
- `PUT /images/:id`
- `DELETE /images/:id`

All image and plant routes require a valid `Authorization: Bearer <token>` header.

