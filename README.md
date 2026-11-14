# 🎯 Chamuka FormIt - Modern Form Builder

[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

A modern form builder application built with Next.js 14, designed to create, manage, and collect responses for surveys and forms.

## ✨ Product Features

### 📋 Form Management
- Multi-page form creation and management
- Three question types supported:
  - Text input
  - Single choice (radio)
  - Multiple choice (checkbox)
- Draft, publish, and archive form states
- Public share links for form distribution
- Form analytics and submission tracking
- Context elements support (paragraphs, images, videos)

### 👤 User Management
- Secure authentication with email/password
- Role-based access control (User/Admin)
- Credit system for premium features
- Email verification and password reset

### 💼 Form Builder Features
- Drag-and-drop form builder interface
- Real-time form preview
- Required field validation
- Question context elements for additional information
- Form submission data export to CSV
- IP and user agent tracking for submissions

## 🛠️ Technical Stack

### Core Technologies
- **Frontend**: Next.js 14 with App Router and React 19
- **Backend**: tRPC for end-to-end type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React Query with tRPC

### Key Libraries & Tools
- **UI Components**: Custom Tailwind components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Date Handling**: Date-fns
- **Markdown Support**: React Markdown
- **Email**: Resend for transactional emails
- **Background Jobs**: Inngest

### Development & Quality
- TypeScript with strict mode
- ESLint & Prettier configuration
- Automated testing setup

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/chamuka-inc/chamuka-formit.git
cd chamuka-formit
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment:
- Copy `.env.example` to `.env`
- Configure the required variables:
  ```env
  # Database
  DATABASE_URL="postgresql://..."
  
  # Authentication
  NEXTAUTH_SECRET="your-secret-here"
  NEXTAUTH_URL="http://localhost:3000"
  
  # Email (Resend)
  RESEND_API_KEY="re_..."
  ```

4. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start using the application.

## 📦 Deployment

### Prerequisites
- PostgreSQL database (recommended: Supabase)
- Vercel account for hosting
- Resend account for transactional emails

### Deployment Steps

1. Push your code to GitHub

2. Deploy on Vercel:
   - Connect your repository on [vercel.com/new](https://vercel.com/new)
   - Configure environment variables from your `.env`
   - Enable the Vercel PostgreSQL integration (optional)
   - Deploy the project

3. Set up the database:
```bash
npx prisma migrate deploy
```

4. Configure additional services:
   - Set up Resend for transactional emails
   - Configure authentication settings
   - Set up background jobs with Inngest

### Production Checklist
- [ ] Configure custom domain and SSL certificates
- [ ] Set up rate limiting
- [ ] Configure monitoring
- [ ] Set up automated database backups
- [ ] Configure proper CORS settings
- [ ] Test all form submissions
- [ ] Verify email functionality
- [ ] Review security headers

---

Built with ❤️ using Next.js and modern web technologies. For support, please [open an issue](https://github.com/chamuka-inc/chamuka-formit/issues).

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

The original MIT notice from the template this project was derived from (Copyright (c) 2025 Kevin Leneway) is preserved in [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES).
