# Feel The Meal - Premium Artisan Confections

A complete modern full-stack ecommerce website inspired by the visual style and layout of the Google Flow website. Built with Next.js App Router, Tailwind CSS, Framer Motion, and Supabase.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend/Database/Storage**: Supabase (Free Tier)
- **Deployment**: Vercel (Free Tier)

## Folder Structure & File Architecture

Here is a breakdown of the project structure and what each file does:

```
feel-the-meal/
├── public/                 # Static assets (Your 16 local images should be placed here)
│   ├── image1.jpg
│   └── ...
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── admin/          # Admin Dashboard & Login route
│   │   ├── checkout/       # Checkout page with delivery form
│   │   ├── products/       # Products listing & details pages
│   │   ├── globals.css     # Global styles, variables, and custom Tailwind classes
│   │   ├── layout.tsx      # Root layout with providers, Navbar, and Footer
│   │   └── page.tsx        # Homepage with Hero, Categories, and Featured sections
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-specific components (Dashboard, Login)
│   │   ├── CartDrawer.tsx  # Slide-in cart drawer
│   │   ├── CategoriesSection.tsx # Homepage categories grid
│   │   ├── FeaturedProducts.tsx  # Homepage featured products
│   │   ├── Footer.tsx      # Global footer
│   │   ├── HeroSection.tsx # Cinematic animated hero section
│   │   ├── Navbar.tsx      # Global navigation bar
│   │   ├── ProductCard.tsx # Reusable product card
│   │   └── ProductSkeleton.tsx # Loading state for products
│   ├── context/            # React Context providers
│   │   ├── AdminAuthContext.tsx # Manages admin login state
│   │   └── CartContext.tsx # Manages shopping cart state
│   └── lib/                # Utility functions and types
│       ├── supabase.ts     # Supabase client configuration
│       └── types.ts        # TypeScript definitions
├── .env.local              # Environment variables (Supabase URL/Key)
├── next.config.ts          # Next.js configuration (allows remote images)
└── tailwind.config.ts      # Tailwind configuration
```

## Setup & Running Locally

### 1. Install Dependencies
Run the following command in your terminal to install the necessary packages:
```bash
npm install
```

### 2. Environment Variables Setup
1. Create a `.env.local` file in the root of your project.
2. Add your Supabase project URL and Anon Key:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Setup (Supabase)

1. Go to [Supabase](https://supabase.com/) and create a free account/project.
2. Go to **SQL Editor** in your Supabase dashboard and run the following query to create the `products` table:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  available_all_states BOOLEAN DEFAULT true,
  available_states TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

3. Go to **Storage** and create a new public bucket named `product-images`.
4. Ensure your Row Level Security (RLS) policies allow public reads for the `products` table, and allow anonymous or authenticated inserts/updates if you aren't strictly enforcing RLS for the admin panel during development.

## How Admin Login Works

The admin panel is accessible at `/admin`.
- **Fixed Credentials**:
  - **Username**: `admin`
  - **Password**: `admin123`
- The authentication state is managed by `AdminAuthContext` and persisted using `localStorage`.

## How to Upload Products

1. Log in to the Admin Panel (`/admin`).
2. Click **"Add Product"**.
3. Fill in the product details: Name, Description, Price, and Category.
4. Upload an image. The image is uploaded directly to your Supabase `product-images` storage bucket, and the public URL is saved to the product record.
5. Toggle availability and select delivery states if applicable.
6. Click **"Create Product"**.

## Deployment (Free)

The easiest way to deploy this Next.js app for free is using [Vercel](https://vercel.com/):

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to Vercel and click **"Add New Project"**.
3. Import your repository.
4. **Environment Variables**: During the import process, add your Supabase variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **"Deploy"**.
6. Vercel will automatically build and deploy your application, providing you with a live URL.

## Image Optimization

Next.js `<Image>` component is used throughout the application to automatically serve correctly sized WebP images. The 16 local images are styled in a cinematic, continuously scrolling grid inside `HeroSection.tsx`, directly inspired by the Google Flow website's aesthetic. Remote images from Supabase are also permitted via `next.config.ts`.
