const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const crypto = require('crypto');

// Initialize Razorpay
// Note: In production, store these in .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret',
});

const PLANS = {
  pro_monthly: {
    name: 'Pro Monthly',
    amount: 100, // 1 Rs in paise
    interval: 'monthly',
  },
  pro_yearly: {
    name: 'Pro Yearly',
    amount: 1200, // 12 Rs in paise
    interval: 'yearly',
  },
};

// @route   POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { planType } = req.body; // 'pro_monthly' or 'pro_yearly'
    const plan = PLANS[planType];

    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan type' });
    }

    const options = {
      amount: plan.amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Math.random().toString(36).substring(2, 15)}`,
      notes: {
        userId: req.user.id,
        planType: planType
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create order' });
  }
});

// @route   POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret');
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment verified
      const plan = PLANS[planType];
      const interval = planType === 'pro_yearly' ? 'yearly' : 'monthly';
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + (interval === 'yearly' ? 12 : 1));

      await User.findByIdAndUpdate(req.user.id, {
        plan: 'pro',
        'subscription.status': 'active',
        'subscription.billingInterval': interval,
        'subscription.currentPeriodEnd': currentPeriodEnd,
        'subscription.stripeCustomerId': razorpay_payment_id, // Reusing field for payment ID
      });

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// @route   GET /api/payment/subscription
router.get('/subscription', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const sub = user.subscription;

    if (!sub || user.plan === 'free') {
      return res.json({ success: true, subscription: null, plan: 'free' });
    }

    res.json({
      success: true,
      plan: user.plan,
      subscription: {
        status: sub.status,
        currentPeriodEnd: sub.currentPeriodEnd,
        billingInterval: sub.billingInterval,
      },
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscription' });
  }
});

// @route   GET /api/payment/plans
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: null,
        features: [
          '5 conversions per day',
          'Max 50MB file size',
          'Basic PDF tools',
          'Standard processing speed',
        ],
        limits: { dailyConversions: 5, maxFileSize: '50MB' },
      },
      {
        id: 'pro_monthly',
        name: 'Pro',
        price: 1,
        interval: 'month',
        features: [
          'Unlimited conversions',
          'Max 200MB file size',
          'All 20+ PDF tools',
          'Priority processing speed',
          'Batch conversion',
          'Premium tools (Word, Excel, PPT)',
          'Ad-free experience',
          'Email support',
        ],
        limits: { dailyConversions: -1, maxFileSize: '200MB' },
        popular: false,
      },
      {
        id: 'pro_yearly',
        name: 'Pro (Annual)',
        price: 12,
        interval: 'year',
        pricePerMonth: 1,
        savings: '0%',
        features: [
          'Everything in Pro Monthly',
          'Save 0% vs monthly',
          'Priority support',
        ],
        limits: { dailyConversions: -1, maxFileSize: '200MB' },
        popular: true,
      },
    ],
  });
});

module.exports = router;
