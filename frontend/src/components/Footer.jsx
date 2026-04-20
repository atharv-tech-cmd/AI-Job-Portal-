import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="w-full bg-[var(--color-bg)] border-t border-[var(--color-border)] py-8 mt-auto transition-colors">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap items-center justify-between gap-6 text-sm font-medium text-[var(--color-text-secondary)]">
                    
                    {/* Left: Copyright and Location */}
                    <div className="flex items-center gap-4">
                        <span className="hover:text-[var(--color-text)] transition cursor-default">
                            Copyright © {currentYear} JobPortal
                        </span>
                        <div className="flex items-center gap-1 hover:text-[var(--color-text)] transition cursor-pointer">
                            <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="w-4 h-3 object-cover rounded-sm" />
                            <span>United States</span>
                        </div>
                    </div>

                    {/* Middle: Main Links */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <Link to="/help" className="hover:text-blue-500 transition">Help Center</Link>
                        <Link to="/assessment" className="hover:text-blue-500 transition">Assessment</Link>
                        <Link to="/bug-bounty" className="hover:text-blue-500 transition">Bug Bounty</Link>
                        <Link to="/terms" className="hover:text-blue-500 transition">Terms</Link>
                        <Link to="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link>
                    </div>

                    {/* Right: Download App */}
                    <div className="flex items-center gap-4">
                         <a href="#" className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <span className="text-lg">📱</span>
                            <span>Download App</span>
                         </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
