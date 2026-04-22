import React from 'react';

const checks = [
  { 
    key: 'length', 
    label: 'At least 8 characters', 
    hint: '',
    test: (p) => p.length >= 8 
  },
  { 
    key: 'uppercase', 
    label: 'One uppercase letter', 
    hint: '(A–Z)',
    test: (p) => /[A-Z]/.test(p) 
  },
  { 
    key: 'lowercase', 
    label: 'One lowercase letter', 
    hint: '(a–z)',
    test: (p) => /[a-z]/.test(p) 
  },
  { 
    key: 'number', 
    label: 'One number', 
    hint: '(0–9)',
    test: (p) => /[0-9]/.test(p) 
  },
  { 
    key: 'special', 
    label: 'One special character', 
    hint: '(!@#$%^&*)',
    test: (p) => /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?]/.test(p) 
  },
];

function PasswordStrengthChecker({ password }) {
  if (!password) return null;

  const strengthScore = checks.filter(({ test }) => test(password)).length;

  const strengthConfig = {
    0: { label: '', color: '#e5e7eb', width: '0%' },
    1: { label: 'Very weak', color: '#ef4444', width: '20%' },
    2: { label: 'Weak', color: '#f97316', width: '40%' },
    3: { label: 'Fair', color: '#eab308', width: '60%' },
    4: { label: 'Good', color: '#84cc16', width: '80%' },
    5: { label: 'Strong', color: '#22c55e', width: '100%' },
  };

  const { label, color, width } = strengthConfig[strengthScore];
  
  return (
    <div style={{ 
      marginTop: '8px', 
      padding: '12px', 
      background: 'var(--color-bg-secondary, #f9fafb)', 
      borderRadius: '8px',
      border: '1px solid var(--color-border, #e5e7eb)'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary, #6b7280)' }}>Password strength</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color }}>{label}</span>
        </div>
        <div style={{ height: '4px', background: 'var(--color-border, #e5e7eb)', borderRadius: '2px' }}>
          <div style={{ 
            height: '100%', width, background: color, 
            borderRadius: '2px', transition: 'all 0.3s ease' 
          }} />
        </div>
      </div>
      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text, #374151)', marginBottom: '8px', marginTop: '12px' }}>
        Password requirements:
      </p>
      {checks.map(({ key, label, hint, test }) => {
        const met = test(password);
        return (
          <div key={key} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '4px' 
          }}>
            <span style={{ 
              width: '16px', height: '16px', 
              borderRadius: '50%',
              background: met ? '#16a34a' : '#d1d5db',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              {met && <span style={{ color: 'white', fontSize: '10px', fontWeight: 700 }}>✓</span>}
            </span>
            <span style={{ fontSize: '13px', color: met ? '#15803d' : 'var(--color-text-secondary, #6b7280)', flex: 1 }}>
              {label}
            </span>
            {hint && (
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{hint}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PasswordStrengthChecker;
