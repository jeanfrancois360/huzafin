"use client";
import "../globals.css";
import "../data-tables-css.css";
import "../satoshi.css";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <div className="dark:bg-boxdark-2 dark:text-bodydark">
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="flex h-screen overflow-hidden">
                            {/* <!-- ===== Content Area Start ===== --> */}
                            <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">

                                {/* <!-- ===== Main Content Start ===== --> */}
                                <main>
                                    {children}
                                </main>
                                {/* <!-- ===== Main Content End ===== --> */}
                            </div>
                            {/* <!-- ===== Content Area End ===== --> */}
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}
