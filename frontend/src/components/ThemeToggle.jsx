import React from 'react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div style={{ display:'flex', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:8, padding:3, gap:2 }}>
      {[['light','☀️ Light'],['dark','🌙 Dark'],['system','💻 System']].map(([v,l]) => (
        <button key={v} onClick={() => setTheme(v)} style={{
          padding:'5px 12px', borderRadius:6, border:'none', cursor:'pointer', fontSize:13,
          background: theme===v ? 'var(--card)' : 'transparent',
          color: theme===v ? 'var(--text)' : 'var(--text-2)',
          fontWeight: theme===v ? 600 : 400,
          boxShadow: theme===v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
        }}>{l}</button>
      ))}
    </div>
  );
}
export default ThemeToggle;
