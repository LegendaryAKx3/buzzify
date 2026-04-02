# Buzzify

Transform your text into engaging buzzwords with AI! Buzzify is a modern web app that uses GenAI to transform regular text into an unrecognizable mess of corporate buzzwords!

![Buzzify Screenshot](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## Features

- Public Generation: Anyone can buzzify text without signing in
- Optional Accounts: Sign in only to unlock the local history sidebar on that device
- Local History Sidebar: Signed-in users can browse past generations stored in their browser
- AI-Powered Text Transformation: Uses OpenRouter with an env-configurable model
- Dark Theme with Green Accents: Modern, eye-friendly interface
- Real-time Processing: Instant text transformation with loading states
- Copy to Clipboard: Easy copying of buzzified text
- Responsive Design: Works seamlessly on desktop and mobile devices
- Keyboard Shortcuts: Cmd/Ctrl + Enter to quickly buzzify text

## Tech Stack

- Framework: Next.js 15 with App Router
- Language: TypeScript
- Styling: Tailwind CSS v4
- Authentication: Supabase Auth
- Storage: Browser localStorage for generation history
- Icons: Lucide React
- AI: OpenRouter (model set via env)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values you want to use:

```bash
cp .env.example .env.local
```

## License

This project is licensed under the MIT License.
