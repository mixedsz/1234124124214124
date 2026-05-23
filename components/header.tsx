'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  basketCount?: number;
  storeName?: string;
  logo?: string;
}

export function Header({ basketCount = 0, storeName = 'Flake Development', logo }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/fd-logo.jpg"
              alt="Flake Development"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/subscription"
              className="text-sm font-medium text-neutral-300 hover:text-white transition"
            >
              Subscription
            </Link>
            <Link
              href="/store"
              className="text-sm font-medium text-neutral-300 hover:text-white transition"
            >
              Scripts
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-neutral-300 hover:text-white transition"
            >
              Docs
            </Link>
            <Link
              href="/support"
              className="text-sm font-medium text-neutral-300 hover:text-white transition"
            >
              Support
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-neutral-300 hover:text-white transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {basketCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-blue-500 text-white rounded-full">
                  {basketCount}
                </span>
              )}
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              Login with FiveM
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-800">
            <nav className="flex flex-col gap-4">
              <Link
                href="/subscription"
                className="text-sm font-medium text-neutral-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscription
              </Link>
              <Link
                href="/store"
                className="text-sm font-medium text-neutral-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Scripts
              </Link>
              <Link
                href="/docs"
                className="text-sm font-medium text-neutral-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Link
                href="/support"
                className="text-sm font-medium text-neutral-300 hover:text-white transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition w-fit"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                Login with FiveM
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
