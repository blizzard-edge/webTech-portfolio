import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

/*
* Authors: Caitlin Hagler, John Morales
* IDE: VSCode
* Last Revision Date: November 20, 2026
*
* This is the root layout for the CineView application.
* It defines the HTML structure and metadata for the entire application.
*/

// Metadata for the application, including title and description.
export const metadata: Metadata = {
    title: {
        default: "CineView",
        template: "%s | CineView"
    },
    description: "Discover and explore movies and television shows."
};

// Navigation links shown in the site header.
const navLinks = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Search" }
];

// Wraps the entire application, which allows for consistent layout and styling across all pages.
export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
        <body className="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
        <header className="border-b border-neutral-200 bg-white">
            <nav
                aria-label="Main navigation"
                className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
            >
                <Link href="/" className="text-xl font-bold tracking-tight">
                    CineView
                </Link>
                <ul className="flex gap-6 text-sm font-medium">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-neutral-600 transition-colors hover:text-neutral-900"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
            {children}
        </main>

        <footer className="border-t border-neutral-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4 text-center text-sm text-neutral-500">
                Movie data provided by the{" "}
                <a
                    href="https://www.omdbapi.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-neutral-700"
                >
                    OMDb API
                </a>
                .
            </div>
        </footer>
        </body>
        </html>
    );
}
