# SupaNuxt - Full Stack Nuxt Application with Cloudinary

A comprehensive SupaNuxt application featuring user authentication, admin panel, and Cloudinary integration for file uploads. Built with Nuxt 3, Supabase, and Cloudinary.

## 🚀 Features

### Core Application

- ✅ **Nuxt 3** - Modern Vue.js framework with SSR/SPA support
- ✅ **Supabase** - Backend-as-a-Service for authentication and database
- ✅ **Cloudinary** - File upload and media management
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Tailwind CSS** - Utility-first CSS framework via Nuxt UI

### Authentication & User Management

- 🔐 User registration and login
- 🔄 Password reset functionality
- 👤 User profiles and authentication state
- 🛡️ Protected routes and middleware
- 🔑 Supabase authentication integration

### Admin Panel

- 📊 Admin dashboard
- 👥 User management
- ⚙️ Settings management
- 🔒 Admin-only route protection

### Cloudinary Integration

- 📸 **Image Upload** - Single and batch image uploads
- 🎬 **Video Upload** - Video file handling
- 🎨 **Transformations** - Built-in transformation presets
- 📁 **Asset Management** - Search, organize, and delete assets
- 🌐 **Cloudflare Ready** - Optimized for Cloudflare Pages deployment

## 🛠️ Technology Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript, Tailwind CSS
- **Backend**: Nuxt Server (Nitro), Supabase
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Cloudinary
- **Deployment**: Cloudflare Pages (optimized)
- **UI Components**: Nuxt UI, Heroicons, Lucide Icons

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm, pnpm, yarn, or bun
- Supabase account
- Cloudinary account

### Setup

1. **Clone and install dependencies:**

   ```bash
   # npm
   npm install

   # pnpm
   pnpm install

   # yarn
   yarn install

   # bun
   bun install
   ```

2. **Environment Configuration:**

   Copy `.env.example` to `.env` and configure:

   ```bash
   # Supabase Configuration
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_KEY="your_anon_key"
   SUPABASE_SECRET_KEY="your_service_role_key"

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   CLOUDINARY_URL="cloudinary://your_api_key:your_api_secret@your_cloud_name"
   ```

3. **Database Setup:**

   Run the Supabase migrations and seed data:

   ```bash
   # Apply migrations
   supabase db push

   # Seed database
   supabase db seed
   ```

## 🚀 Development

Start the development server:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
supanuxt/
├── app/                    # Nuxt application directory
│   ├── components/         # Vue components
│   ├── composables/        # Vue composables (useAuth, etc.)
│   ├── layouts/           # Application layouts
│   ├── middleware/        # Route middleware
│   ├── pages/             # Application pages (auto-routing)
│   │   ├── admin/         # Admin panel pages
│   │   ├── login.vue      # Login page
│   │   ├── register.vue   # Registration page
│   │   └── ...
│   ├── server/            # Server-side code
│   │   └── api/           # API routes
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
│       ├── cloudinary.ts  # Cloudinary upload utility
│       └── cloudinary-examples.ts # Usage examples
├── supabase/              # Supabase configuration
│   ├── migrations/        # Database migrations
│   └── seed.sql          # Database seed data
├── public/               # Static assets
└── ...
```

## ☁️ Cloudinary Upload Utility

This project includes a comprehensive Cloudinary utility for server-side file uploads.

### Quick Start

```typescript
import { uploadImage, transformationPresets } from "~/utils/cloudinary";

// Upload with automatic transformation
const result = await uploadImage(
  "./path/to/image.jpg",
  transformationPresets.avatar,
  {
    folder: "avatars",
    public_id: "user_123",
    tags: ["profile"],
  }
);
```

### Core Functions

- **`uploadFile()`** - Generic file upload
- **`uploadImage()`** - Image upload with transformations
- **`uploadVideo()`** - Video upload with transformations
- **`uploadMultipleFiles()`** - Batch upload capability
- **`deleteAsset()`** - Delete assets from Cloudinary
- **`getAssetDetails()`** - Retrieve asset metadata
- **`searchAssets()`** - Search and filter assets
- **`generateTransformedUrl()`** - Generate transformation URLs

### Transformation Presets

```typescript
transformationPresets.thumbnail; // 200x200 face-cropped
transformationPresets.medium; // 500x500 limited size
transformationPresets.large; // 1000x1000 limited size
transformationPresets.avatar; // 150x150 circular avatar
transformationPresets.cover; // 1200x400 centered cover
```

### Usage Examples

#### Form Data Upload (Server-side)

```typescript
// server/api/upload.post.ts
import { uploadImage } from "~/utils/cloudinary";

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  const file = formData?.find((f) => f.name === "file");

  const result = await uploadImage(file!.data, transformationPresets.medium, {
    folder: "uploads",
    tags: ["form-upload"],
  });

  return result;
});
```

#### Batch Upload

```typescript
import { uploadMultipleFiles } from "~/utils/cloudinary";

const results = await uploadMultipleFiles(
  ["./image1.jpg", "./image2.png", "./image3.gif"],
  {
    folder: "gallery",
    tags: ["batch-upload"],
  }
);
```

## 🌩️ Cloudflare Deployment

### Zero Configuration Deployment

Cloudflare Pages supports **zero configuration** deployment for Nuxt applications.

1. **Connect Repository** to Cloudflare Pages
2. **Build Command**:
   - SSR: `nuxt build`
   - Static: `nuxt generate`
3. **Environment Variables**: Add in Cloudflare Pages dashboard

### Environment Variables on Cloudflare

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### Direct Upload with Wrangler

```bash
# Build for Cloudflare Pages
npx nuxi build --preset=cloudflare_pages

# Deploy
npx wrangler pages deploy dist/
```

### Cloudflare-Specific Optimizations

- **Edge Runtime** - Compatible with Cloudflare's edge infrastructure
- **Caching** - Leverage Cloudflare CDN for cached transformed images
- **Global Distribution** - Fast uploads and deliveries worldwide

## 🔧 API Routes

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/reset-password` - Password reset

### File Upload

- `POST /api/upload` - File upload endpoint
- `GET /api/assets` - List user assets
- `DELETE /api/assets/:id` - Delete asset

### Admin

- `GET /api/admin/users` - List all users (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## 🛡️ Security Features

- **Authentication** - Supabase Auth with JWT tokens
- **Authorization** - Role-based access control
- **File Upload Security** - Type validation and size limits
- **API Security** - Protected routes and middleware
- **Environment Variables** - Secure credential management

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📈 Production Build

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## 📚 Additional Resources

### Documentation

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

### Examples

- Check `app/utils/cloudinary-examples.ts` for comprehensive Cloudinary usage examples
- Review the TypeScript interfaces in `app/types/` for available options

### Support

- [Nuxt Community](https://nuxt.com/community)
- [Supabase Discord](https://discord.supabase.com/)
- [Cloudinary Support](https://support.cloudinary.com/)

---

**Built with ❤️ using Nuxt 3, Supabase, and Cloudinary**
