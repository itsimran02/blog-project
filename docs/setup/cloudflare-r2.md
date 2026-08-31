# Cloudflare R2 Storage Setup Guide

This guide walks you through setting up **Cloudflare R2 Storage** for hosting images, media, and files in your Next.js Blog CMS with **zero egress bandwidth fees**.

---

## Step 1: Create a Cloudflare R2 Bucket

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation bar, go to **R2**.
3. Click **Create bucket**.
4. Name your bucket (e.g., `blog-assets` or `nextjs-blog-media`).
5. Click **Create bucket**.

---

## Step 2: Create R2 API Tokens

1. In the R2 Dashboard, click **Manage R2 API Tokens** (on the right sidebar).
2. Click **Create API Token**.
3. Select **Edit** permissions (gives Object Read & Write access).
4. Select your bucket or apply to **All buckets**.
5. Click **Create API Token**.
6. Copy down the following keys immediately (they are only shown once):
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint URL** (Take note of your Account ID from `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`)

---

## Step 3: Enable Public Bucket Domain or Custom Domain

To serve uploaded files publicly on your website:

### Option A: Use Cloudflare R2 `r2.dev` Public Subdomain
1. Open your bucket settings in Cloudflare.
2. Go to **Settings** > **Public Access**.
3. Enable **r2.dev Subdomain**.
4. Copy the public URL (e.g., `https://pub-xxxxxxxx.r2.dev`).

### Option B: Connect a Custom Domain (Recommended for Production)
1. In your bucket **Settings** > **Public Access**, click **Connect Domain**.
2. Enter a domain/subdomain (e.g., `media.yourdomain.com`).
3. Click **Continue** to create the DNS CNAME record automatically.

---

## Step 4: Configure Environment Variables

Add the following keys to your `.env.local` (and your Vercel / hosting environment settings):

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID="your_account_id_here"
CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key_id_here"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_access_key_here"
CLOUDFLARE_R2_BUCKET_NAME="blog-assets"

# Public Access Base URL (r2.dev or your custom domain)
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL="https://pub-xxxxxxxx.r2.dev"
```

---

## Fallback Behavior

If the Cloudflare R2 environment variables above are **not** provided (e.g. during local testing), the application will automatically fall back to **Supabase Storage** without crashing or breaking file uploads.
