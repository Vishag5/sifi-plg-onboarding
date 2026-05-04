import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, Fingerprint, Building, Gift, Sparkles, MoveRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const COLORS = [
  { id: 'emerald', value: '#10b981', label: 'Emerald' },
  { id: 'midnight', value: '#0f172a', label: 'Midnight' },
  { id: 'sapphire', value: '#1e3a8a', label: 'Sapphire' },
  { id: 'gold', value: '#d4af37', label: 'Gold' },
  { id: 'rose', value: '#be123c', label: 'Rose' },
  { id: 'amethyst', value: '#6d28d9', label: 'Amethyst' },
  { id: 'ocean', value: '#0369a1', label: 'Ocean' },
  { id: 'obsidian', value: '#09090b', label: 'Obsidian' }
];

const REWARDS = [
  { title: 'SAR 300 Cash Credit', desc: 'Added to your first statement' },
  { title: 'SAR 500 Cash Credit', desc: 'For spending >10k in month 1' },
  { title: '4,500 AlFursan Miles', desc: 'Fly sooner with Saudia' },
  { title: '1 Month Free', desc: 'No platform fees for 30 days' }
];

const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

const playSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch(e) {}
};

const playSuccessSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e) {}
};

function App() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [cardData, setCardData] = useState({
    color: '#0f172a',
    name: 'Marketing',
    limit: 5000,
    employee: ''
  });
  const [reward, setReward] = useState(REWARDS[0]);
  const [flipAnim, setFlipAnim] = useState(false);

  const nextStep = () => {
    triggerHaptic();
    setStep(s => s + 1);
  };

  const prevStep = () => {
    triggerHaptic();
    setStep(s => s - 1);
  };

  const updateCard = (key, val) => {
    setCardData(prev => ({ ...prev, [key]: val }));
  };

  const handleColorChange = (color) => {
    updateCard('color', color);
    triggerHaptic();
    playSound();
    setFlipAnim(true);
    setTimeout(() => setFlipAnim(false), 600);
  };

  const triggerConfetti = () => {
    playSuccessSound();
    triggerHaptic();
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#10b981', '#d4af37', '#ffffff']
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#10b981', '#d4af37', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    if (step === 3) {
      setReward(REWARDS[Math.floor(Math.random() * REWARDS.length)]);
    }
    if (step === 4) {
      setTimeout(triggerConfetti, 400); // Wait a bit for the burst animation
    }
  }, [step]);

  return (
    <div className="website-container">
      
      {/* LEFT PANE - Visuals */}
      <div className="left-pane">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        
        <div className="card-presentation">
          <div className={`virtual-card ${flipAnim ? 'flip-anim' : ''} ${step === 3 ? 'glowing' : ''}`} style={{ background: cardData.color }}>
            <div className="card-bg-overlay"></div>
            <div className="card-content">
              <div className="card-top">
                <div className="card-chip"></div>
                <div className="card-logo">SiFi</div>
              </div>
              <div className="card-middle-content">
                <div className="card-label">Card Name</div>
                <div className="card-title">{cardData.name || 'Virtual Card'}</div>
                <div className="card-number">•••• •••• •••• 4092</div>
              </div>
              <div className="card-bottom">
                <div className="card-holder-info">
                  {cardData.employee && <div className="card-label">Cardholder</div>}
                  <div className="card-name">{cardData.employee}</div>
                </div>
                <div className="card-limit-display">
                  <div className="card-label">Monthly Limit</div>
                  <div className="card-limit-val">SAR {cardData.limit.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE - Interactive Forms & Steps */}
      <div className="right-pane">
        <div className="logo-header">SiFi <span>.</span></div>

        {/* STEP 1: Landing */}
        {step === 1 && (
          <div className="step-content">
            <h1 className="headline">Build Your First Corporate Card</h1>
            <p className="subheadline">It only takes 60 seconds to set up powerful spend controls.</p>
            
            <div className="mb-6">
              <input 
                type="email" 
                className="input-field" 
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={nextStep}>
              Start Designing My Card <ArrowRight className="ml-2" size={24} style={{ marginLeft: '12px' }}/>
            </button>
          </div>
        )}

        {/* STEP 2: Card Studio */}
        {step === 2 && (
          <div className="step-content">
            <button className="btn-back" onClick={prevStep}>
              <ArrowLeft size={20} /> Back
            </button>
            <h2 className="headline" style={{ fontSize: '2.5rem' }}>Design Your Card</h2>
            <p className="subheadline">Customize limits, colors, and owners instantly.</p>
            
            <div className="control-group">
              <label className="control-label">Card Color</label>
              <div className="color-picker">
                {COLORS.map(c => (
                  <div 
                    key={c.id} 
                    className={`color-swatch ${cardData.color === c.value ? 'active' : ''}`}
                    style={{ background: c.value }}
                    onClick={() => handleColorChange(c.value)}
                  />
                ))}
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Card Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Marketing, Travel, Operations"
                value={cardData.name}
                onChange={(e) => updateCard('name', e.target.value)}
              />
            </div>

            <div className="control-group">
              <label className="control-label">Monthly Limit (SAR)</label>
              <div className="slider-container">
                <input 
                  type="range" 
                  className="slider"
                  min="1000" max="50000" step="1000"
                  value={cardData.limit}
                  onChange={(e) => {
                    updateCard('limit', parseInt(e.target.value));
                    if (e.target.value % 5000 === 0) triggerHaptic();
                  }}
                />
                <div className="limit-labels">
                  <span>1k</span>
                  <span>SAR {cardData.limit.toLocaleString()}</span>
                  <span>50k</span>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Employee Name (Optional)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Ahmed Al-Saud"
                value={cardData.employee}
                onChange={(e) => updateCard('employee', e.target.value)}
              />
            </div>
            
            <button className="btn btn-primary mt-4" onClick={nextStep}>
              Review Card <MoveRight className="ml-2" size={24} style={{ marginLeft: '12px' }}/>
            </button>
          </div>
        )}

        {/* STEP 3: Review & Activate */}
        {step === 3 && (
          <div className="step-content">
            <button className="btn-back" onClick={prevStep}>
              <ArrowLeft size={20} /> Back
            </button>
            <h2 className="headline">Review Your Card</h2>
            <p className="subheadline">Your card is perfectly designed and ready to go.</p>

            <button className="btn btn-primary animate-pulse-btn mt-8" onClick={nextStep}>
              <Sparkles size={24} style={{ marginRight: '12px' }}/> Activate This Card Now
            </button>
          </div>
        )}

        {/* STEP 4: Variable Reward */}
        {step === 4 && (
          <div className="step-content text-center">
            <h2 className="headline" style={{ color: 'var(--gold)' }}>Amazing Choice!</h2>
            <p className="subheadline">Here's your exclusive welcome reward.</p>

            <div className="reward-burst-container">
              <div className="reward-box burst-anim">
                <Gift className="reward-icon" style={{ color: 'var(--gold)' }} />
                <div className="reward-value">{reward.title}</div>
                <div className="reward-desc">{reward.desc}</div>
              </div>
            </div>

            <button className="btn btn-gold mt-8" onClick={nextStep}>
              Claim My Reward & Activate Card
            </button>
          </div>
        )}

        {/* STEP 5: Verification Flow */}
        {step === 5 && (
          <div className="step-content">
            <h2 className="headline">Almost Done</h2>
            <p className="subheadline">Let's quickly verify your business to issue the card.</p>

            <div className="w-full mb-8 mt-4">
              <div className="verify-step active">
                <div className="verify-icon-wrapper">
                  <Fingerprint size={32} />
                </div>
                <div className="verify-content">
                  <h3>Nafath Verification</h3>
                  <p>Secure identity approval via Nafath</p>
                </div>
              </div>

              <div className="verify-step">
                <div className="verify-icon-wrapper" style={{ color: 'var(--text-muted)' }}>
                  <Building size={32} />
                </div>
                <div className="verify-content">
                  <h3 style={{ color: 'var(--text-muted)' }}>Commercial Registration</h3>
                  <p>Enter your 10-digit CR number</p>
                </div>
              </div>
            </div>

            <div className="text-center" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--emerald)', borderRadius: '12px' }}>
              <p style={{ color: 'var(--emerald)', fontWeight: '600', display: 'flex', alignItems: 'center', justify: 'center', gap: '8px', fontSize: '1.1rem' }}>
                <CheckCircle2 size={24} /> Your reward is secured!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
