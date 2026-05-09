# PDFCraft Frontend

Modern React SaaS frontend for PDFCraft - Professional PDF tools platform.

## Features

- ✅ Beautiful modern UI with Tailwind CSS
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time file upload & conversion
- ✅ User authentication (register/login)
- ✅ Stripe payment integration
- ✅ Conversion history dashboard
- ✅ Tool discovery & filtering
- ✅ Pricing & subscription management
- ✅ Smooth animations with Framer Motion

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Environment variables:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will start at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Output in `dist/` directory

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation
│   │   ├── Footer.jsx          # Footer
│   │   ├── ToolCard.jsx        # Tool card component
│   │   └── FileUploader.jsx    # Reusable file upload
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state & API
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Tools.jsx           # All tools listing
│   │   ├── Pricing.jsx         # Pricing plans
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   ├── ToolDetail.jsx      # Individual tool converter
│   │   ├── Dashboard.jsx       # User dashboard
│   │   └── Settings.jsx        # User settings
│   ├── utils/
│   │   └── tools.js            # Tools data configuration
│   ├── App.jsx                 # Main router
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── package.json
└── .env.example
```

## Pages Overview

### Home (/)
- Landing page with hero section
- Popular tools showcase
- Feature highlights
- Call-to-action buttons

### Tools (/tools)
- All tools grid with filtering
- Category-based filtering
- Search functionality
- Tool cards with descriptions

### Tool Detail (/tools/:toolId)
- Individual tool converter
- File upload interface
- Real-time conversion progress
- Download converted file

### Pricing (/pricing)
- Subscription plans
- Monthly/annual billing
- Feature comparison
- FAQ section

### Login (/login)
- Email/password authentication
- "Remember me" option
- Sign up link
- Password recovery link

### Register (/register)
- User registration form
- Email validation
- Password strength
- Terms acceptance

### Dashboard (/dashboard)
- User profile info
- Conversion history
- Subscription status
- Usage statistics

### Settings (/settings)
- Profile management
- Password change
- Billing management
- Account preferences

## Authentication Flow

1. User registers → JWT token created → Stored in localStorage
2. Token sent in Authorization header for authenticated requests
3. Token verified on every request
4. Expired token triggers logout
5. API interceptors handle auth errors

## API Integration

All API calls go through the AuthContext:

```javascript
import { useAuth } from '../context/AuthContext';

export default function MyComponent() {
  const { API, user } = useAuth();
  
  // Make authenticated API call
  const response = await API.get('/endpoint');
}
```

## Payment Integration

Stripe integration for Pro subscriptions:

1. User clicks "Upgrade" → Create Stripe checkout session
2. Checkout session created on backend
3. Redirected to Stripe checkout
4. After payment → Webhook updates subscription
5. User redirected to dashboard

## File Upload

Uses react-dropzone for file uploads:

```javascript
<FileUploader
  tool={tool}
  acceptedTypes={['.pdf']}
  multiFile={false}
  onConvertSuccess={(result) => console.log(result)}
  onConvertError={(error) => console.error(error)}
/>
```

## Styling System

Uses CSS custom properties for consistent theming:

```css
--bg-primary: Main background
--bg-secondary: Secondary background
--bg-card: Card backgrounds
--accent: Primary color (blue)
--success: Success color (green)
--error: Error color (red)
--text-primary: Primary text
--text-secondary: Secondary text
--border: Border color
```

## Component Examples

### Navbar
```jsx
<Navbar />
```

### ToolCard
```jsx
<ToolCard tool={toolObject} index={0} />
```

### FileUploader
```jsx
<FileUploader
  tool={tool}
  acceptedTypes={['.pdf']}
  multiFile={true}
  onConvertSuccess={handleSuccess}
  onConvertError={handleError}
/>
```

## State Management

Uses React Context API for global state:
- AuthContext: User auth & API client
- Other component state managed with useState

## Animations

Powered by Framer Motion:
- Page transitions
- Component entrance animations
- Hover effects
- Loading states
- Success animations

## Responsive Design

Mobile-first approach with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Performance Optimizations

- Code splitting by route
- Lazy component loading
- Image optimization
- CSS variable caching
- Minimized re-renders with proper dependencies

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR during development

### Browser DevTools
- React DevTools for component inspection
- Redux DevTools for state inspection
- Network tab for API debugging

### Debugging
```javascript
// Add console logs
console.log('Debug:', variable);

// Use debugger
debugger;
```

## Deployment

### Vercel (Recommended)
```bash
vercel login
vercel
```

### Netlify
```bash
netlify deploy
```

### AWS S3 + CloudFront
```bash
npm run build
# Upload dist/ to S3 bucket
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Environment Configuration

### Development
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Production
```env
VITE_API_URL=https://api.pdfcraft.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

## Troubleshooting

### CORS Errors
- Ensure backend API_URL is correct
- Check backend CORS configuration
- Verify API is running

### Authentication Issues
- Clear localStorage
- Check token expiration
- Verify JWT_SECRET matches backend

### File Upload Fails
- Check file size limits
- Verify accepted file types
- Check network connection

### Payment Issues
- Use Stripe test keys for development
- Check webhook configuration
- Verify API keys in .env

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Advanced search & filtering
- [ ] Bulk operations
- [ ] Custom integration webhooks
- [ ] Social sharing
- [ ] PDF preview
- [ ] Team collaboration
- [ ] Usage analytics
- [ ] Custom branding

## Support

For issues, open GitHub issues or email support@pdfcraft.com

## License

MIT License - See LICENSE.md for details
