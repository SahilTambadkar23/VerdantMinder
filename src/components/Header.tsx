import Link from 'next/link';
import { Sprout, Home } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold tracking-tight font-headline">Verdant Minder</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
