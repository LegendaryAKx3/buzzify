# Buzzify

Transform your text into engaging buzzwords with AI! Buzzify is a modern web application that uses OpenAI's GPT models to transform regular text into professional, trendy, and buzzword-rich content.

![Buzzify Screenshot](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## ✨ Features

- **🎯 User Authentication**: Secure email/password authentication with email verification
- **🆓 Free Requests**: 5 free buzzifications per user account
- **🔑 API Key Management**: Save your OpenAI API key securely in your profile
- **🤖 AI-Powered Text Transformation**: Uses OpenAI's GPT models to intelligently transform text
- **🌙 Dark Theme with Green Accents**: Modern, eye-friendly interface
- **⚡ Real-time Processing**: Instant text transformation with loading states
- **📋 Copy to Clipboard**: Easy copying of buzzified text
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⌨️ Keyboard Shortcuts**: Cmd/Ctrl + Enter to quickly buzzify text
- **📊 Usage Tracking**: Monitor your free request usage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- A Supabase account (free at [supabase.com](https://supabase.com))
- An OpenAI API key for your own requests after free ones are used

### 1. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization or create a new one
4. Name your project "buzzify"
5. Set a secure database password
6. Choose your region (closest to your users)
7. Click "Create new project"

#### Configure Authentication
1. Go to Authentication → Settings in your Supabase dashboard
2. Enable "Enable email confirmations"
3. Set Site URL to `http://localhost:3001` (for development)
4. Add redirect URLs: `http://localhost:3001/auth/callback`

#### Set Up Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Run the following SQL commands:

```sql
-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  api_key TEXT,
  free_requests_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles (users can only see/edit their own)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create requests table to track usage
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  output_text TEXT,
  used_free_request BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on requests
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Create policy for requests
CREATE POLICY "Users can view own requests" ON requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Get Your Supabase Credentials
1. Go to Settings → API in your Supabase dashboard
2. Copy the "Project URL"
3. Copy the "anon public" API key
4. Copy the "service_role" secret key (for server-side operations)

### 2. OpenAI Setup

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. This key will be used for the 5 free requests per user

### 3. Project Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/buzzify.git
cd buzzify
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
# Copy the example file
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration (for free requests)
OPENAI_API_KEY=your_openai_api_key_for_free_requests
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3001](http://localhost:3001) in your browser

### 4. Usage

1. **Sign Up**: Create a new account with email verification
2. **Free Requests**: Use your 5 free buzzifications
3. **Add API Key**: Save your own OpenAI API key in your profile for unlimited use
4. **Buzzify**: Transform your text into professional buzzwords!

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **AI**: OpenAI GPT-3.5-turbo
- **Deployment**: Vercel (recommended)

## 🎨 Design Features

- **Dark Theme**: Modern dark interface that's easy on the eyes
- **Green Accents**: Professional green color scheme for highlights and CTAs
- **Clean Layout**: Minimalist design focused on functionality
- **Responsive Grid**: Two-column layout that adapts to different screen sizes
- **Loading States**: Smooth animations and feedback during processing
- **Authentication Flow**: Seamless sign up/sign in modals

## 🔒 Privacy & Security

- Email verification required for account creation
- Row Level Security (RLS) enabled on all database tables
- API keys are encrypted and stored securely
- Users can only access their own data
- No text or API keys are logged or shared

## � User Management

- **Free Tier**: 5 free requests per user
- **API Key Storage**: Users can save their own OpenAI API key
- **Usage Tracking**: Monitor free request consumption
- **Profile Management**: Update API keys and view account info

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase Site URL to your production domain
5. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Next.js, TypeScript, Supabase, and OpenAI
