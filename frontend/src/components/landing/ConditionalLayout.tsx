"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

/** Route prefixes that belong to the app dashboards (no landing navbar/footer). */
const DASHBOARD_PREFIXES = ["/admin", "/platform", "/portal", "/dashboard"];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth");
    const isDashboard = DASHBOARD_PREFIXES.some((p) => pathname.startsWith(p));

    if (isAuthPage || isDashboard) {
        // Auth pages have their own layout; dashboard pages use AppShell/Header/Sidebar
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
