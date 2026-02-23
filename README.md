# lemonO

**Unbothered, by design.**

A minimal, calm e-commerce website for oversized Gen-Z streetwear.

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** database

## Project Structure

```
lemono/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── ...config files
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── lib/            # Utilities
│   │   └── index.ts        # Server entry
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   └── ...config files
│
└── package.json            # Root scripts
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up the database:**
   
   Create a `.env` file in the `server/` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lemono"
   PORT=5000
   NODE_ENV=development
   ```

3. **Initialize the database:**
   ```bash
   cd server
   npx prisma db push
   npx prisma generate
   ```

4. **Seed the database (optional):**
   ```bash
   npx ts-node prisma/seed.ts
   ```

5. **Start development servers:**
   ```bash
   # From root directory
   npm run dev
   ```

   This starts:
   - Frontend at `http://localhost:3000`
   - Backend at `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/track/:orderNumber` - Track order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Contact
- `POST /api/contact` - Submit contact message
- `POST /api/contact/newsletter` - Subscribe to newsletter
- `GET /api/contact/messages` - Get all messages (admin)

## Design Principles

- Clean, minimal, breathable layout
- Neutral colour palette (white, cream, grey, soft earth tones)
- Generous whitespace
- Typography-led design
- Mobile-first approach
- No loud animations or aggressive CTAs

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Cream | `#FEFDFB` | Backgrounds |
| Charcoal | `#374151` | Primary text |
| Earth | `#B8A082` | Accent (sparingly) |

## License

MIT
