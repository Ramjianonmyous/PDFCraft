import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, ArrowRight, Star } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FEATURES = {
  free: [
    '5 conversions per day',
    'Max 50MB file size',
    'Merge, Split, Compress, Rotate',
    'JPG ↔ PDF conversion',
    'Standard processing speed',
  ],
  pro: [
    'Unlimited conversions',
    'Max 200MB file size',
    'All 20+ PDF tools unlocked',
    'PDF ↔ Word, Excel, PPT',
    'Password protect & watermark',
    'Priority processing speed',
    'Ad-free experience',
    'Email support',
  ],
};

export default function Pricing() {
  const [billing, setBilling] = useState('yearly');
  const [loading, setLoading] = useState(null);
  const { user, isPro } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (planType) => {
    if (!user) {
      navigate('/register?redirect=/pricing');
      return;
    }
    if (isPro) {
      toast('You already have a Pro plan!');
      return;
    }

    setLoading(planType);
    try {
      // Load Razorpay script
      const scriptLoaded = await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // Create order on backend
      const res = await API.post('/payment/create-order', { planType });
      
      if (!res.data.order) {
        throw new Error('Failed to create order');
      }

      const { order } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        amount: order.amount,
        currency: order.currency,
        name: 'Saas FileForge',
        description: `Upgrade to ${planType === 'pro_yearly' ? 'Pro Yearly' : 'Pro Monthly'}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planType
            });

            if (verifyRes.data.success) {
              toast.success('Payment successful! Welcome to Pro.');
              window.location.href = '/dashboard?payment=success';
            } else {
              toast.error('Verification failed');
            }
          } catch (err) {
            toast.error('Verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start payment');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'For occasional use',
      icon: Star,
      iconColor: '#94a3b8',
      cta: isPro ? 'Current Plan' : user ? 'Current Plan' : 'Get Started',
      planType: null,
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 1,
      yearlyPrice: 1,
      yearlyTotal: 12,
      description: 'For power users',
      icon: Crown,
      iconColor: '#fbbf24',
      cta: isPro ? '✓ Active Plan' : 'Upgrade to Pro',
      planType: billing === 'yearly' ? 'pro_yearly' : 'pro_monthly',
      popular: true,
    },
  ];

  return (
    <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '460px', margin: '0 auto 32px' }}>
            Start free. Upgrade when you need more power.
          </p>

          {/* Billing Toggle */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 100,
            padding: '4px',
            gap: '4px',
          }}>
            {[
              { val: 'monthly', label: 'Monthly' },
              { val: 'yearly', label: 'Yearly', badge: 'Save 33%' },
            ].map((opt) => (
              <button key={opt.val} onClick={() => setBilling(opt.val)} style={{
                padding: '8px 20px',
                borderRadius: 100,
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'var(--transition)',
                background: billing === opt.val ? 'var(--gradient-accent)' : 'transparent',
                color: billing === opt.val ? 'white' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                {opt.label}
                {opt.badge && (
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    padding: '2px 7px', borderRadius: 100,
                    background: billing === 'yearly' ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.15)',
                    color: billing === 'yearly' ? 'white' : '#10b981',
                  }}>
                    {opt.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '760px', margin: '0 auto 80px' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                position: 'relative',
                padding: '36px 32px',
                background: plan.popular
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.05))'
                  : 'var(--gradient-card)',
                border: plan.popular ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: plan.popular ? 'var(--shadow-hover)' : 'none',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: -14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--gradient-accent)',
                  color: 'white',
                  padding: '6px 20px',
                  borderRadius: 100,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
                }}>
                  MOST POPULAR
                </div>
              )}

              {/* Plan header */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${plan.iconColor}15`,
                    border: `1px solid ${plan.iconColor}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <plan.icon size={20} color={plan.iconColor} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800 }}>{plan.name}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{plan.description}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                    ₹{plan.id === 'free' ? '0' : billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  {plan.id !== 'free' && (
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>/month</div>
                      {billing === 'yearly' && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          billed ₹{plan.yearlyTotal}/year
                        </div>
                      )}
                    </div>
                  )}
                  {plan.id === 'free' && <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>forever</span>}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => plan.planType && handleSubscribe(plan.planType)}
                disabled={loading === plan.planType || isPro || (plan.id === 'free' && !user)}
                className={plan.popular ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  fontSize: '0.95rem',
                  marginBottom: '28px',
                  opacity: (isPro && plan.id !== 'pro') || loading === plan.planType ? 0.6 : 1,
                }}
              >
                {loading === plan.planType ? (
                  <><div className="spinner" /> Processing...</>
                ) : (
                  <>{plan.cta} {plan.popular && !isPro && <ArrowRight size={16} />}</>
                )}
              </button>

              {/* Features */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {FEATURES[plan.id].map((feature) => (
                  <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                      background: plan.popular ? 'rgba(59,130,246,0.15)' : 'rgba(148,163,184,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={11} color={plan.popular ? 'var(--accent-bright)' : 'var(--text-secondary)'} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '32px', letterSpacing: '-0.02em' }}>
            Common Questions
          </h2>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your dashboard at any time. Your Pro access continues until the end of the billing period.' },
            { q: 'Is my data secure?', a: 'Absolutely. All files are encrypted in transit and automatically deleted after 2 hours. We never access your documents.' },
            { q: 'What payment methods are accepted?', a: 'We accept all major credit cards (Visa, Mastercard, Amex) via Stripe — the world\'s most trusted payment platform.' },
            { q: 'Can I switch from monthly to yearly?', a: 'Yes. You can change your billing cycle from the dashboard at any time and save 33% with annual billing.' },
          ].map((faq, i) => (
            <div key={i} style={{
              padding: '20px 0',
              borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
              textAlign: 'left',
            }}>
              <h4 style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }}>{faq.q}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
