
import React from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Dashboard />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Crypto Strategy AI Trader. Data is for demonstration purposes only. Not financial advice.</p>
        <p>
          <a href="https://github.com/google/generative-ai-docs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">Powered by Gemini API</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
