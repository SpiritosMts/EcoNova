import React from 'react';
import NavBar from './NavBar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
