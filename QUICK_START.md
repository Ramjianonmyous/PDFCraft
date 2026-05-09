# 🚀 PDFCraft - Quick Start Guide

## 📦 What You've Got

Three zip files with a complete production-ready MERN SaaS platform:

1. **pdfcraft-backend.zip** (21KB) - Node.js/Express API
2. **pdfcraft-frontend.zip** (36KB) - React SPA
3. **pdfcraft-complete.zip** (63KB) - Everything in one

## ⚡ 5-Minute Setup

### 1️⃣ Extract Files

```bash
# Extract complete project
unzip pdfcraft-complete.zip
cd pdfcraft

# OR extract separately
unzip pdfcraft-backend.zip
unzip pdfcraft-frontend.zip
```

### 2️⃣ Setup MongoDB

**Option A: Local (Quick)**
```bash
# macOS
brew install mongodb-community && brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
# Sign up: https://www.mongodb.com/cloud/atlas
```

### 3️⃣ Setup Backend (Terminal 1)

```bash
cd backend
npm install

# Copy env file
cp .env.example .env

# Edit .env - add your Stripe keys
nano .env
```

Update these in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/pdfcraft
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_YEARLY=price_yyy
CLIENT_URL=http://localhost:5173
```

Start server:
```bash
npm run dev
```

✅ Should see: `🚀 PDFCraft Server running on port 5000`

### 4️⃣ Setup Frontend (Terminal 2)

```bash
cd frontend
npm install

# Copy env file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Add your Stripe key:
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
```

Start dev server:
```bash
npm run dev
```

✅ Should see: `➜  Local:   http://localhost:5173/`

### 5️⃣ Open Browser

Visit: **http://localhost:5173**

🎉 That's it! You're running PDFCraft

---

## 🔑 Get Stripe Keys (Free)

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Sign up (takes 2 minutes)
3. Click "Developers" → "API Keys"
4. Copy test keys to `.env` files

**Test Card (for testing payments):**
- Number: `4242 4242 4242 4242`
- Exp: Any future date
- CVC: Any 3 digits

---

## 📋 Features Included

### ✅ Free Tools
- ✨ Merge PDF
- ✨ Split PDF  
- ✨ Compress PDF
- ✨ Rotate PDF
- ✨ PDF to JPG
- ✨ JPG to PDF

### 👑 Premium Tools (needs Pro subscription)
- 🔐 PDF to Word
- 🔐 Watermark PDF
- 🔐 Protect PDF
- 🔐 + 8 more tools (with code ready)

### 🎯 Platform
- 👤 User authentication
- 💳 Stripe payment integration
- 📊 Dashboard & history
- 📱 Responsive design
- 🎨 Modern UI with animations
- 🚀 Production ready

---

## 🏗️ Architecture Overview

```
User Browser (Frontend - React)
         ↕ (HTTPS/API)
   Load Balancer (Optional)
         ↕
   Backend API (Express)
   ├─ Auth Routes (JWT)
   ├─ Conversion Routes (PDF tools)
   └─ Payment Routes (Stripe)
         ↕
   Database (MongoDB)
   ├─ Users
   └─ Conversion History
         ↕
   File Storage (Local or S3)
   ├─ Uploads/
   └─ Converted/
```

---

## 📚 Key Files

**Backend**
- `server.js` - Main server entry
- `routes/auth.js` - User authentication
- `routes/convert.js` - PDF conversion tools
- `routes/payment.js` - Stripe integration
- `models/User.js` - User data schema
- `utils/converters.js` - PDF manipulation logic
- `middleware/auth.js` - JWT authentication
- `middleware/upload.js` - File upload handling

**Frontend**
- `src/App.jsx` - Main router
- `src/main.jsx` - Entry point
- `src/pages/Home.jsx` - Landing page
- `src/pages/Tools.jsx` - Tools listing
- `src/pages/ToolDetail.jsx` - Individual tool converter
- `src/pages/Pricing.jsx` - Subscription plans
- `src/components/FileUploader.jsx` - Reusable upload UI
- `src/context/AuthContext.jsx` - Global auth state
- `src/index.css` - Global styles

---

## 🧪 Test the App

1. **Sign Up** → Register with email
2. **Try Free Tool** → Merge or compress a PDF
3. **Upgrade** → View pricing (test Stripe)
4. **Pay** → Use test card `4242 4242 4242 4242`
5. **Use Premium** → Unlock all features

---

## 🚀 Next Steps

### For Development
- [ ] Read `/backend/README.md` for API details
- [ ] Read `/frontend/README.md` for component structure
- [ ] Check `SETUP.md` for advanced configuration
- [ ] Explore `src/utils/tools.js` to add more tools

### For Production
- [ ] Get real Stripe live keys
- [ ] Use MongoDB Atlas (cloud)
- [ ] Deploy backend to Railway/Heroku/AWS
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Setup email notifications
- [ ] Enable HTTPS everywhere
- [ ] Setup CDN for files
- [ ] Add monitoring & logging

---

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
```bash
# Check if MongoDB is running
mongosh

# Or update MONGO_URI to use MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pdfcraft
```

**"CORS error"**
- Verify backend `CLIENT_URL` matches your frontend URL
- Check frontend `VITE_API_URL` matches backend URL

**"Stripe key invalid"**
- Use test keys (pk_test_ and sk_test_) for development
- Copy exact keys from Stripe dashboard
- Don't add spaces or quotes

**"File upload fails"**
- Check `uploads/` directory exists and has write permissions
- Check `MAX_FILE_SIZE` in .env isn't too small
- Ensure disk space available

**"Port already in use"**
```bash
# Change port in backend .env
PORT=5001

# Or find what's using port 5000
lsof -i :5000
kill -9 <PID>
```

---

## 📖 Documentation

- **Backend API**: See `backend/README.md`
- **Frontend UI**: See `frontend/README.md`
- **Full Setup**: See `SETUP.md`
- **API Reference**: See `backend/README.md` > API Endpoints

---

## 🎯 What's Ready to Use

✅ User authentication (register, login, logout)
✅ 6 free PDF tools (fully working)
✅ 4 premium tools (code ready)
✅ Stripe payment integration
✅ File upload with validation
✅ Conversion history dashboard
✅ Responsive mobile UI
✅ Modern animations
✅ Rate limiting
✅ Security headers
✅ Error handling
✅ Toast notifications

---

## 💡 Customization Ideas

1. **Add More Tools**
   - Edit `backend/utils/converters.js` add conversion function
   - Update `frontend/src/utils/tools.js` add tool definition
   - Add new route in `backend/routes/convert.js`

2. **Change Branding**
   - Update logo in `frontend/src/components/Navbar.jsx`
   - Change colors in `frontend/src/index.css`
   - Edit company name everywhere

3. **Add Email Notifications**
   - Install `nodemailer`
   - Update `backend/utils/` with email function
   - Send after conversion/payment

4. **Setup Webhooks**
   - For payment notifications
   - For conversion status updates
   - For user events

---

## 🌐 Deployment Checklist

- [ ] Setup production MongoDB database
- [ ] Get live Stripe keys
- [ ] Update `.env` with production values
- [ ] Build frontend: `npm run build`
- [ ] Test everything locally first
- [ ] Deploy backend (Railway/Heroku/AWS)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Setup custom domain
- [ ] Enable HTTPS
- [ ] Setup monitoring
- [ ] Create support email
- [ ] Write privacy policy
- [ ] Write terms of service

---

## 📞 Need Help?

1. Check the README files in each folder
2. Review the code comments
3. Check the SETUP.md file
4. Google the error message
5. Check Stack Overflow
6. Ask in the code comments

---

## 🎉 You're All Set!

```
                    PDFCraft
              Professional PDF Tools
                   MERN Stack
                  
        🚀 Ready for Development
        🔐 Production Ready
        💰 Stripe Integrated
        📱 Mobile Responsive
        ⚡ Super Fast
        
         Happy Building! 🎨
```

---

**Questions? Check the README files or SETUP.md**

**Want to add features? Edit the code and rebuild!**

**Ready to deploy? Follow the deployment guide in SETUP.md**
