const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    subscription: {
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      stripePriceId: String,
      status: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'past_due', null],
        default: null,
      },
      currentPeriodEnd: Date,
      billingInterval: {
        type: String,
        enum: ['monthly', 'yearly', null],
        default: null,
      },
    },
    dailyConversions: {
      count: { type: Number, default: 0 },
      resetDate: { type: Date, default: Date.now },
    },
    totalConversions: { type: Number, default: 0 },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user can convert (free tier limit)
userSchema.methods.canConvert = function () {
  if (this.plan !== 'free') return true;

  const now = new Date();
  const resetDate = new Date(this.dailyConversions.resetDate);

  // Reset daily count if it's a new day
  if (now.toDateString() !== resetDate.toDateString()) {
    this.dailyConversions.count = 0;
    this.dailyConversions.resetDate = now;
    return true;
  }

  return this.dailyConversions.count < parseInt(process.env.FREE_CONVERSIONS_PER_DAY || 5);
};

// Increment conversion count
userSchema.methods.incrementConversions = async function () {
  const now = new Date();
  const resetDate = new Date(this.dailyConversions.resetDate);

  if (now.toDateString() !== resetDate.toDateString()) {
    this.dailyConversions.count = 1;
    this.dailyConversions.resetDate = now;
  } else {
    this.dailyConversions.count += 1;
  }

  this.totalConversions += 1;
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
