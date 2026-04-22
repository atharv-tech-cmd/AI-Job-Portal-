import React from 'react';

const CONDITIONS = [
  { key: 'len',  label: 'At least 8 characters',        hint: '(min 8)',    test: p => p.length >= 8 },
  { key: 'up',   label: 'At least 2 uppercase letters',  hint: '(A–Z)',      test: p => (p.match(/[A-Z]/g)||[]).length >= 2 },
  { key: 'low',  label: 'At least 2 lowercase letters',  hint: '(a–z)',      test: p => (p.match(/[a-z]/g)||[]).length >= 2 },
  { key: 'num',  label: 'At least 1 number',             hint: '(0–9)',      test: p => /[0-9]/.test(p) },
  { key: 'spl',  label: 'At least 1 special character',  hint: '(!@#$%^&*)', test: p => /[!@#$%^&*()\-_=+\[\]{};:"\\|,.<>\/?]/.test(p) },
];
const STRENGTH = [
  { label: '',          color: '#e5e7eb', w: '0%'   },
  { label: 'Very Weak', color: '#ef4444', w: '20%'  },
  { label: 'Weak',      color: '#f97316', w: '40%'  },
  { label: 'Fair',      color: '#eab308', w: '60%'  },
  { label: 'Good',      color: '#84cc16', w: '80%'  },
  { label: 'Strong ✓',  color: '#22c55e', w: '100%' },
];

export function PasswordPanel({ password }) {
  if (!password) return null;
  const results = CONDITIONS.map(c => ({ ...c, met: c.test(password) }));
  const s = STRENGTH[results.filter(r => r.met).length];
  return (
    <div style={{ marginTop:8, padding:'14px 16px', background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:12, color:'#6b7280' }}>Password strength</span>
        <span style={{ fontSize:12, fontWeight:600, color:s.color }}>{s.label}</span>
      </div>
      <div style={{ height:5, background:'#e5e7eb', borderRadius:3, marginBottom:12 }}>
        <div style={{ height:'100%', width:s.w, background:s.color, borderRadius:3, transition:'all 0.3s' }} />
      </div>
      {results.map(r => (
        <div key={r.key} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <div style={{ width:18, height:18, borderRadius:'50%', flexShrink:0, background:r.met?'#22c55e':'#d1d5db', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {r.met && <span style={{ color:'white', fontSize:11, fontWeight:700 }}>✓</span>}
          </div>
          <span style={{ flex:1, fontSize:13, color:r.met?'#15803d':'#6b7280' }}>{r.label}</span>
          <span style={{ fontSize:11, color:'#9ca3af' }}>{r.hint}</span>
        </div>
      ))}
    </div>
  );
}

export function isPasswordStrong(p) { return CONDITIONS.every(c => c.test(p)); }
