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
        <header className="fixed top-0 left-4 right-4 z-50 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-background p-3">
            {/* Left side: Market & Orders links */}
            {!isAuthPage && (
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Button size="sm" variant="ghost" className='cursor-pointer'>
                            Market
                        </Button>
                    </Link>
                    <Link href="/orders">
                        <Button size="sm" variant="ghost" className='cursor-pointer'>
                            Orders
                        </Button>
                    </Link>
                </div>
            )}

            {/* Right side: Settings & Theme */}
            <div className="flex items-center gap-2">
                {!isAuthPage && (
                    <>
                        <Link href="/auth">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="hover:text-primary transition-colors"
                                aria-label="Settings"
                            >
                                <Settings2 className="w-5 h-5" />
                            </Button>
                        </Link>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            aria-label="Toggle Theme"
                            className="hover:text-primary transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                    </>
                )}
            </div>

            {isAuthPage && (
                <div className='mr-auto'>
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
                </div>
            )}
        </header>
    );
}