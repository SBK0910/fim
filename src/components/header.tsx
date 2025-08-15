'use client'

import { Settings2, Sun, Moon, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();

    const isAuthPage = pathname === '/auth';

    return (
        <header className="fixed top-4 right-4 left-4 z-50 flex justify-between">
            {isAuthPage ? (
                // Back to home button on the left
                <Link href="/">
                    <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Back to Home"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 hover:text-primary transition-colors" />
                    </Button>
                </Link>
            ) : (
                // Empty placeholder to keep layout consistent
                <div />
            )}

            {!isAuthPage && (
                <div className="flex items-center gap-0 bg-accent rounded-md">
                    {/* Settings Icon */}
                    <Link href="/auth">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="hover:text-primary transition-colors cursor-pointer"
                            aria-label="Settings"
                        >
                            <Settings2 className="w-5 h-5 cursor-pointer" />
                        </Button>
                    </Link>

                    {/* Theme Toggle */}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label="Toggle Theme"
                        className="cursor-pointer"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                        ) : (
                            <Moon className="w-5 h-5 hover:text-primary transition-colors cursor-pointer" />
                        )}
                    </Button>
                </div>
            )}
        </header>
    );
}