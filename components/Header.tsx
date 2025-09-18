import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226 1.28-.502 2.62.214 2.88 1.485.09.436-.06.884-.38 1.19l-2.92 2.92c-.32.32-.86.1-.86-.36V3.94z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5a3 3 0 01-3-3V4.5a3 3 0 013-3h7.5a3 3 0 013 3v6a3 3 0 01-3 3h-2.5m-5 0v1.5a3 3 0 003 3h2.5a3 3 0 003-3V13.5" />
            </svg>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight">Crypto Strategy AI Trader</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;