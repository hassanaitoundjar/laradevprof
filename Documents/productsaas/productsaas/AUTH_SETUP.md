# 🔐 Authentication System Setup Guide

This guide will help you set up the complete authentication system with Supabase.

## 🚀 Quick Start

### 1. Environment Variables

Copy the example environment file and add your Supabase credentials:

```bash
cp .env.example .env
```

Add your Supabase project details to `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Project Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Configure Authentication**
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable email confirmations (recommended)
   - Set up your site URL: `http://localhost:5173` (for development)

3. **Enable Social Providers** (Optional)
   - Go to Authentication > Providers
   - Enable Google OAuth:
     - Add your Google OAuth credentials
     - Set redirect URL: `https://your-project-id.supabase.co/auth/v1/callback`
   - Enable GitHub OAuth:
     - Add your GitHub OAuth app credentials
     - Set redirect URL: `https://your-project-id.supabase.co/auth/v1/callback`

### 3. Email Templates (Optional)

Customize your email templates in Supabase Dashboard > Authentication > Email Templates:
- Confirm signup
- Reset password
- Magic link

## 📱 Available Routes

| Route | Description | Access |
|-------|-------------|---------|
| `/` | Landing page | Public |
| `/signin` | Sign in page | Public |
| `/signup` | Sign up page | Public |
| `/forgot-password` | Password reset request | Public |
| `/reset-password` | Password reset form | Public |
| `/verify-email` | Email verification page | Public |
| `/dashboard` | Protected dashboard | Authenticated only |

## 🎨 Features Included

### ✅ Authentication Features
- [x] Email/Password authentication
- [x] Social logins (Google, GitHub)
- [x] Password reset flow
- [x] Email verification
- [x] Protected routes
- [x] Auto-redirect for authenticated users
- [x] Form validation with Zod
- [x] Loading states and error handling

### ✅ UI/UX Features
- [x] Modern, responsive design
- [x] Smooth animations with Framer Motion
- [x] Form validation feedback
- [x] Success/error alerts
- [x] Mobile-first design
- [x] Accessible components

## 🛠️ Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📂 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthLayout.tsx      # Auth page layout wrapper
│   │   ├── FormInput.tsx       # Reusable form input component
│   │   ├── AuthButton.tsx      # Styled button component
│   │   ├── Alert.tsx           # Alert/notification component
│   │   ├── SocialLogins.tsx    # Social login buttons
│   │   ├── SignUpPage.tsx      # Sign up form
│   │   ├── SignInPage.tsx      # Sign in form
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── EmailVerificationPage.tsx
│   │   └── ProtectedRoute.tsx  # Route protection wrapper
│   └── DashboardPage.tsx       # Example protected page
├── contexts/
│   └── AuthContext.tsx         # Authentication context provider
├── lib/
│   ├── supabase.ts            # Supabase client configuration
│   └── utils.ts               # Utility functions
└── pages/
    └── Index.tsx              # Landing page with auth redirect
```

## 🔧 Customization

### Styling
The components use Tailwind CSS with a modern design system:
- Primary colors: Blue to Purple gradient
- Secondary: Slate gray palette
- Rounded corners and soft shadows
- Responsive breakpoints

### Authentication Flow
The auth flow is handled by the `AuthContext` which provides:
- User state management
- Authentication methods
- Loading states
- Error handling

### Form Validation
Forms use `react-hook-form` with `zod` schemas for validation:
- Email format validation
- Password strength requirements
- Confirm password matching
- Real-time error feedback

## 🚨 Important Notes

1. **Environment Variables**: Never commit your `.env` file to version control
2. **Social OAuth**: You need to configure OAuth apps in Google/GitHub before enabling social logins
3. **Email Verification**: Users must verify their email before accessing protected routes
4. **CORS Settings**: Make sure your Supabase project allows your domain in CORS settings

## 🐛 Troubleshooting

### Common Issues

1. **"Unsupported provider" error**
   - Enable the OAuth provider in Supabase Dashboard > Authentication > Providers
   - Add your OAuth app credentials

2. **Email not sending**
   - Check your email templates in Supabase
   - Verify SMTP settings if using custom SMTP

3. **Redirect issues after login**
   - Check your site URL in Supabase settings
   - Ensure redirect URLs match your domain

4. **CORS errors**
   - Add your domain to allowed origins in Supabase

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Review Supabase logs in the dashboard
3. Verify your environment variables
4. Check the Supabase documentation

## 🎯 Next Steps

After setup, consider adding:
- User profile management
- Role-based access control
- Two-factor authentication
- Account deletion flow
- Admin dashboard
- User analytics

Happy coding! 🚀
