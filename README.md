# Buzzify

Transform your text into engaging buzzwords with AI! Buzzify is a modern web application that uses OpenAI's GPT models to transform regular text into professional, trendy, and buzzword-rich content.

![Buzzify Screenshot](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **AI-Powered Text Transformation**: Uses OpenAI's GPT models to intelligently transform text
- **Dark Theme with Green Accents**: Modern, eye-friendly interface
- **Real-time Processing**: Instant text transformation with loading states
- **Secure API Key Handling**: Your OpenAI API key is only used for the request and never stored
- **Copy to Clipboard**: Easy copying of buzzified text
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Keyboard Shortcuts**: Cmd/Ctrl + Enter to quickly buzzify text

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- An OpenAI API key (get one at [OpenAI Platform](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/buzzify.git
cd buzzify
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Enter your OpenAI API Key**: Paste your API key in the designated field
2. **Input your text**: Type or paste the text you want to transform
3. **Click "Buzzify Text"** or use Cmd/Ctrl + Enter
4. **Copy the result**: Use the copy button to copy the buzzified text

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **AI**: OpenAI GPT-3.5-turbo
- **Deployment**: Vercel (recommended)

## 🎨 Design Features

- **Dark Theme**: Modern dark interface that's easy on the eyes
- **Green Accents**: Professional green color scheme for highlights and CTAs
- **Clean Layout**: Minimalist design focused on functionality
- **Responsive Grid**: Two-column layout that adapts to different screen sizes
- **Loading States**: Smooth animations and feedback during processing

## 🔒 Privacy & Security

- Your OpenAI API key is only used for the current request
- No data is stored on our servers
- All processing happens in real-time
- Your text and API key are never logged or saved

## 📝 API Reference

The application includes a `/api/buzzify` endpoint that:
- Accepts POST requests with `text` and `apiKey` in the body
- Returns the buzzified text from OpenAI
- Handles errors gracefully with appropriate status codes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deploy on Vercel

The easiest way to deploy Buzzify is to use the [Vercel Platform](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/buzzify)

---

Built with ❤️ using Next.js, TypeScript, and OpenAI
