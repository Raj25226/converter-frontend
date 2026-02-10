# File Converter - Free Online File Conversion Tool

A modern, secure, and user-friendly web application for converting various file formats. Built with Next.js, React, and TypeScript.

## 🚀 Features

### File Conversion Support
- **PDF Converters**
  - PDF to Word (.docx)
  - PDF to Excel (.xlsx)
  - PDF to Image (JPG/PNG)
  - Word to PDF
  - Excel to PDF
  - PowerPoint to PDF

- **Image Converters**
  - JPG to PNG
  - PNG to JPG
  - HEIC to JPG
  - WebP to PNG/JPG
  - Image Resize & Compress

- **Video/Audio Converters**
  - MP4 to MP3
  - MOV to MP4
  - AVI to MP4
  - Video Compress

- **Document Converters**
  - DOCX to PDF
  - XLSX to PDF
  - PPTX to PDF
  - TXT to PDF

### Core Features
- ✅ **Google OAuth Authentication** - Sign in with Google
- ✅ **Email/Password Authentication** - Traditional login/signup
- ✅ **Analytics Dashboard** - Track website visits and conversions
- ✅ **Drag & Drop Upload** - Easy file uploading
- ✅ **Auto-Delete Security** - Files deleted after 30 minutes
- ✅ **Progress Tracking** - Real-time conversion progress
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Password Strength Indicator** - Secure password creation
- ✅ **User Dashboard** - View conversion history

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: Google OAuth 2.0, JWT

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API server (running on port 8080)
- Google OAuth credentials

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Raj25226/converter-frontend
cd file-converter-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# App Configuration
NEXT_PUBLIC_APP_NAME=File Converter
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
7. Add authorized redirect URIs:
   - `http://localhost:3000/login`
   - `https://yourdomain.com/login`
8. Copy the Client ID to your `.env.local` file

## 📁 Project Structure

```
file-converter-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Home page
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── signup/
│   │   │   └── page.tsx             # Signup page
│   │   ├── pdf-to-word/
│   │   │   └── page.tsx             # PDF to Word converter
│   │   ├── word-to-pdf/
│   │   │   └── page.tsx             # Word to PDF converter
│   │   ├── excel-to-pdf/
│   │   │   └── page.tsx             # Excel to PDF converter
│   │   └── [other converters]/
│   │       └── page.tsx
│   └── components/
│       ├── FileConverter.tsx        # Main converter component
│       ├── GoogleSignIn.tsx         # Google OAuth button
│       └── Analytics.tsx            # Analytics display
├── public/
│   └── [static assets]
├── .env.local                       # Environment variables
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies
```

## 🎨 Available Converters

### PDF Converters
- `/pdf-to-word` - PDF to Word
- `/pdf-to-excel` - PDF to Excel
- `/pdf-to-image` - PDF to Image
- `/word-to-pdf` - Word to PDF
- `/excel-to-pdf` - Excel to PDF
- `/ppt-to-pdf` - PowerPoint to PDF

### Image Converters
- `/jpg-to-png` - JPG to PNG
- `/png-to-jpg` - PNG to JPG
- `/heic-to-jpg` - HEIC to JPG
- `/webp-to-png` - WebP to PNG
- `/image-resize` - Image Resize

### Video/Audio Converters
- `/mp4-to-mp3` - MP4 to MP3
- `/mov-to-mp4` - MOV to MP4
- `/avi-to-mp4` - AVI to MP4

## 📊 Analytics Implementation

The application tracks:
- **Total Website Visits** - Unique and total page views
- **Total Conversions** - Number of successful file conversions
- **Conversion by Type** - Stats per converter type
- **User Activity** - Registered vs anonymous users

Analytics are displayed on the home page and stored in the backend.

## 🔒 Security Features

- **Auto-Delete**: All uploaded files are automatically deleted after 30 minutes
- **SSL Encryption**: All data transmission is encrypted
- **No Permanent Storage**: Files are never stored permanently
- **Secure Authentication**: JWT tokens with HTTP-only cookies
- **Password Hashing**: Bcrypt for password security
- **Rate Limiting**: API rate limiting to prevent abuse

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Docker

```bash
# Build the image
docker build -t file-converter-frontend .

# Run the container
docker run -p 3000:3000 file-converter-frontend
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 API Endpoints Required

Your backend should provide these endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login

### Conversion
- `POST /api/convert/pdf-to-word` - Convert PDF to Word
- `POST /api/convert/word-to-pdf` - Convert Word to PDF
- `POST /api/convert/excel-to-pdf` - Convert Excel to PDF
- `POST /api/convert/jpg-to-png` - Convert JPG to PNG
- `POST /api/convert/mp4-to-mp3` - Convert MP4 to MP3
- [Additional conversion endpoints]

### Analytics
- `GET /api/analytics/visits` - Get visit count
- `GET /api/analytics/conversions` - Get conversion count
- `POST /api/analytics/track-visit` - Track a visit
- `POST /api/analytics/track-conversion` - Track a conversion

### Files
- `GET /api/download/:fileId` - Download converted file

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Bug Reports

If you find a bug, please open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 💡 Feature Requests

We welcome feature requests! Please open an issue with:
- Feature description
- Use case
- Any implementation ideas

## 📞 Support

For support, email support@fileconverter.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Lucide React for beautiful icons
- All contributors and users

---

Made with ❤️ by the File Converter Team
