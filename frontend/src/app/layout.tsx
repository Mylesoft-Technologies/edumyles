import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalLayout from "@/components/landing/ConditionalLayout";
import { ConvexClientProvider } from "./providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Force rebuild 2025-03-06 - All merge conflicts resolved

export const metadata: Metadata = {
    title: "EduMyles — School Management for East Africa",
    description:
        "Replace disconnected spreadsheets and messaging groups with one unified platform for admissions, billing, academics, HR, and communication across East Africa.",
    other: {
        "msapplication-TileColor": "#056C40",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-sans antialiased">
                <ErrorBoundary>
                    <ConvexClientProvider>
                        <ConditionalLayout>{children}</ConditionalLayout>
                    </ConvexClientProvider>
                </ErrorBoundary>
                <Toaster />
                <SpeedInsights />
            </body>
        </html>
    );
}

