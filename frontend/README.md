# Catur Jaya Travel - Frontend

Frontend aplikasi web untuk Catur Jaya Travel yang dibangun dengan React, Vite, dan Tailwind CSS.

## 🚀 Fitur Utama

- **Single Page Application (SPA)** dengan React Router
- **Mobile-First Design** yang fully responsive
- **Lazy Loading** untuk optimasi performa
- **Animasi Smooth** dengan Framer Motion
- **State Management** dengan React Hooks
- **API Integration** dengan Axios
- **Form Validation** yang real-time
- **Error Handling** yang komprehensif
- **PWA Ready** (Progressive Web App)

## 📱 Halaman & Fitur

### Public Pages
- **Home** - Landing page dengan hero section, featured content, dan testimonials
- **Trips** - Daftar paket trip dengan filter dan pencarian
- **Trip Detail** - Detail paket trip dengan booking functionality
- **Travels** - Daftar travel antar kota
- **Travel Detail** - Detail travel dengan booking

### Auth Pages
- **Login** - Halaman masuk dengan validasi
- **Register** - Halaman daftar dengan validasi lengkap

### Payment Pages
- **Payment Success** - Konfirmasi pembayaran berhasil
- **Payment Pending** - Status pembayaran pending
- **Payment Failed** - Halaman pembayaran gagal

## 🛠️ Tech Stack

- **React 19** - UI Library
- **Vite** - Build Tool & Dev Server
- **React Router DOM** - Client-side Routing
- **Tailwind CSS** - Utility-first CSS Framework
- **DaisyUI** - Tailwind CSS Components
- **Framer Motion** - Animation Library
- **Axios** - HTTP Client
- **React Icons** - Icon Library

## 📦 Struktur Proyek

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Basic UI components
│   │   ├── cards/        # Card components
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components
│   │   └── navigation/   # Navigation components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── services/         # API services
│   └── assets/           # Images, fonts, etc.
├── .env                  # Environment variables
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies & scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=Catur Jaya Travel
   VITE_APP_VERSION=1.0.0
   VITE_WHATSAPP_NUMBER=6281234567890
   ```

4. **Start development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🎨 UI Components

### Basic Components
- **Button** - Berbagai variant dan size
- **Input** - Input field dengan validasi
- **Modal** - Modal dialog dengan animasi
- **Alert** - Notifikasi dengan berbagai tipe
- **Badge** - Label dengan berbagai variant

### Card Components
- **TripCard** - Card untuk paket trip
- **TravelCard** - Card untuk travel

### Form Components
- **LoginForm** - Form login dengan validasi
- **RegisterForm** - Form registrasi lengkap
- **SearchForm** - Form pencarian dengan filter

### Navigation Components
- **Breadcrumb** - Navigasi breadcrumb
- **Pagination** - Komponen pagination
- **Header** - Header dengan navigation
- **Footer** - Footer dengan links

## 🔗 API Integration

### Configuration
API dikonfigurasi di `src/config/api.js` dengan:
- Base URL dari environment variable
- Request/Response interceptors
- Authentication handling
- Error handling

### Endpoints
```javascript
// Auth
POST /auth/login
POST /auth/register
POST /auth/logout

// Trips
GET /trips
GET /trips/:id

// Travels  
GET /travels
GET /travels/:id

// Transactions
POST /transactions
GET /transactions/:id
```

## 📱 Responsive Design

### Breakpoints
- **SM**: 640px
- **MD**: 768px  
- **LG**: 1024px
- **XL**: 1280px
- **2XL**: 1536px

### Mobile-First Approach
- Semua komponen didesain mobile-first
- Touch-friendly UI elements
- Optimized untuk berbagai screen size
- Adaptive grid system

## ⚡ Performance Optimization

### Code Splitting
- Lazy loading untuk semua pages
- Dynamic imports dengan React.lazy()
- Suspense fallback components

### Bundle Optimization
- Vendor chunks terpisah
- Tree shaking untuk unused code
- Optimized build output

### Image Optimization
- Lazy loading images
- Responsive images
- WebP format support

## 🔒 Security Features

- **Input Validation** - Client-side validation
- **XSS Protection** - Sanitized inputs
- **CSRF Protection** - Token-based auth
- **Secure Headers** - Security headers setup

## 🧪 Testing

### Setup Testing (Optional)
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Test Structure
```
src/
├── __tests__/           # Test files
├── components/
│   └── __tests__/      # Component tests
└── utils/
    └── __tests__/      # Utility tests
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

## 🔧 Configuration

### Tailwind CSS
Konfigurasi di `tailwind.config.js`:
- Custom colors
- Custom fonts
- Custom animations
- DaisyUI integration

### Vite
Konfigurasi di `vite.config.js`:
- Dev server settings
- Build optimization
- Plugin configuration

## 📚 Development Guidelines

### Component Structure
```jsx
// Component template
import { useState } from 'react';
import { motion } from 'framer-motion';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="component-classes"
    >
      {/* Component content */}
    </motion.div>
  );
};

export default ComponentName;
```

### Naming Conventions
- **Components**: PascalCase (e.g., `TripCard.jsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useLocalStorage.js`)
- **Utils**: camelCase (e.g., `formatCurrency.js`)
- **Constants**: UPPER_SNAKE_CASE

### Code Style
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use TypeScript-style prop validation

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

Untuk bantuan dan pertanyaan:
- Email: support@caturjayatravel.com
- WhatsApp: +62 812-3456-7890

---

**Catur Jaya Travel Frontend** - Built with ❤️ using React & Tailwind CSS