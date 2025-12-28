# BulkMailer Pro - Frontend

A modern, responsive frontend for the Bulk Email Sender application built with SvelteKit and TypeScript.

## 🚀 Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Dashboard**: Live campaign monitoring and statistics
- **Email Campaigns**: Send bulk emails with Excel/CSV contact lists
- **SMTP Management**: Configure multiple email providers
- **Scheduling**: Queue and schedule email campaigns
- **Authentication**: Secure login and user management
- **File Upload**: Parse Excel/CSV files for contact lists
- **Rich Text Editor**: Compose emails with formatting

## 🛠️ Tech Stack

- **Framework**: SvelteKit 2.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Svelte 5 Runes
- **Build Tool**: Vite
- **Backend**: Hono (Node.js)

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   PUBLIC_BACKEND_URL=http://localhost:3000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── api.ts          # API client and endpoints
│   ├── components/     # Reusable Svelte components
│   └── types.ts        # TypeScript type definitions
├── routes/
│   ├── +layout.svelte  # Root layout
│   ├── +page.svelte    # Home page (redirects to login)
│   ├── login/          # Authentication pages
│   ├── register/
│   ├── logout/
│   └── dashboard/      # Protected dashboard routes
│       ├── +layout.svelte
│       ├── +page.svelte    # Overview dashboard
│       ├── send/           # Email campaign creation
│       ├── schedule/       # Campaign scheduling
│       ├── config/         # SMTP configuration
│       └── report/         # Campaign reports
└── app.html           # HTML template
```

## 🔧 Development

- **Linting**: `npm run lint`
- **Type Checking**: `npm run check`
- **Formatting**: `npm run format`

## 🌐 Backend Integration

This frontend communicates with the Hono backend API. Make sure the backend is running on the configured `PUBLIC_BACKEND_URL`.

### API Endpoints Used:
- `/auth/login` - User authentication
- `/campaign/*` - Campaign management
- `/report` - Email delivery reports
- `/config/*` - SMTP configuration
- `/parse-excel` - File parsing for contacts

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security

- Client-side validation
- Secure API communication with credentials
- Session-based authentication
- CSRF protection via cookies

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript strictly
3. Test on multiple screen sizes
4. Ensure accessibility compliance

## 📞 Support

For questions or issues, check the backend API documentation or create an issue in the repository.