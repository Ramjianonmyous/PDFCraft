# PDFCraft Backend API

Professional PDF tools SaaS backend built with Node.js, Express, and MongoDB.

## Features

- ✅ User authentication (JWT)
- ✅ 15+ PDF conversion tools
- ✅ Stripe payment integration
- ✅ Daily conversion limits (free tier)
- ✅ File upload & storage management
- ✅ Conversion history tracking
- ✅ Email notifications
- ✅ Rate limiting & security

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `CLIENT_URL` - Frontend URL (for CORS & redirects)

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas:

```bash
# Local MongoDB
mongod

# Or update MONGO_URI in .env with your Atlas connection string
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### 5. Verify Installation

```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "PDFCraft API is running",
  "version": "1.0.0"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Conversions
- `POST /api/convert/merge-pdf` - Merge PDFs
- `POST /api/convert/split-pdf` - Split PDF
- `POST /api/convert/compress-pdf` - Compress PDF
- `POST /api/convert/rotate-pdf` - Rotate PDF
- `POST /api/convert/pdf-to-jpg` - PDF to image
- `POST /api/convert/jpg-to-pdf` - Image to PDF
- `POST /api/convert/pdf-to-word` - PDF to Word (Premium)
- `POST /api/convert/watermark-pdf` - Add watermark (Premium)
- `POST /api/convert/protect-pdf` - Password protect (Premium)
- `GET /api/convert/history` - Conversion history

### Payments
- `POST /api/payment/create-checkout` - Create Stripe session
- `POST /api/payment/create-portal` - Billing portal
- `GET /api/payment/subscription` - Get subscription status
- `POST /api/payment/cancel` - Cancel subscription
- `GET /api/payment/plans` - Available plans
- `POST /api/payment/webhook` - Stripe webhook handler

## File Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   └── Conversion.js        # Conversion history schema
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── upload.js            # File upload with multer
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── convert.js           # Conversion endpoints
│   └── payment.js           # Payment endpoints
├── utils/
│   └── converters.js        # PDF conversion utilities
├── uploads/                 # Temporary file storage
├── converted/               # Converted files storage
├── .env.example             # Environment variables template
├── server.js                # Main server file
└── package.json
```

## PDF Tools Implemented

### Free Tools
- ✅ Merge PDF - Combine multiple PDFs
- ✅ Split PDF - Extract pages or split PDFs
- ✅ Compress PDF - Reduce file size
- ✅ Rotate PDF - Rotate pages
- ✅ PDF to JPG - Convert pages to images
- ✅ JPG to PDF - Create PDF from images

### Premium Tools (require Pro subscription)
- ✅ PDF to Word - Extract text to Word document
- ⏳ Word to PDF - Convert Word to PDF
- ⏳ PDF to Excel - Extract tables to Excel
- ⏳ PDF to PowerPoint - Convert to presentation
- ✅ Protect PDF - Add password protection
- ✅ Watermark PDF - Add text/image watermark
- ⏳ Unlock PDF - Remove password protection
- ⏳ OCR PDF - Make scanned PDFs searchable
- ⏳ PDF to HTML - Convert to web format
- ⏳ PDF/A Conversion - Archive format
- ⏳ Repair PDF - Fix corrupted files

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  plan: 'free' | 'pro' | 'enterprise',
  subscription: {
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    stripePriceId: String,
    status: String,
    currentPeriodEnd: Date,
    billingInterval: 'monthly' | 'yearly'
  },
  dailyConversions: {
    count: Number,
    resetDate: Date
  },
  totalConversions: Number,
  isEmailVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Conversion Model
```javascript
{
  user: ObjectId (optional, null for guests),
  tool: String (tool identifier),
  inputFiles: Array,
  outputFiles: Array,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  errorMessage: String,
  processingTime: Number,
  options: Object,
  ipAddress: String,
  isPremiumTool: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- ✅ JWT authentication with expiration
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet.js for security headers
- ✅ File upload validation
- ✅ Automatic file cleanup (2-hour expiry)
- ✅ Stripe webhook signature verification

## Deployment

### Using Railway
```bash
# Connect your GitHub repo to Railway
# Set environment variables in Railway dashboard
# Deploy with: git push
```

### Using Heroku
```bash
heroku create pdfcraft-api
heroku addons:create mongolab:sandbox
heroku config:set STRIPE_SECRET_KEY=sk_...
git push heroku main
```

### Using AWS EC2
```bash
# Install Node.js & MongoDB
# Clone repository
# Set environment variables
# Run: npm start
# Use PM2 for process management
```

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running
- Check MONGO_URI in .env
- For MongoDB Atlas, whitelist your IP

### File Upload Issues
- Check file size limits
- Verify upload directory permissions
- Ensure disk space available

### Stripe Integration Issues
- Verify API keys are correct
- Check webhook endpoint is public
- Test with Stripe test keys first

## Future Enhancements

- [ ] PDF digital signature support
- [ ] Batch API for bulk conversions
- [ ] Advanced OCR with language support
- [ ] Custom watermark templates
- [ ] Form filling and field extraction
- [ ] API key support for developers
- [ ] Webhook notifications
- [ ] Enterprise SSO integration

## Support

For issues and questions, open an issue on GitHub or contact support@pdfcraft.com

## License

MIT License - See LICENSE.md for details
