'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X,
  Film,
  Star,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/movies', label: 'Movies', icon: Film },
    { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
    { href: '/mood-tracker', label: 'Mood Tracker', icon: Heart },
    { href: '/recommendations', label: 'Recommendations', icon: Star },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">VibeVault</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/profile" 
              className="flex items-center space-x-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">
                {user?.name || user?.email || 'User'}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-white/20">
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-3 mb-4 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white text-sm">
                    {user?.name || user?.email || 'User'}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full text-white/80 hover:text-white hover:bg-white/10 justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
