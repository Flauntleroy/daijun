import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Sidebar, Header } from "@/components/layout";
import { SparklesBackground } from "@/components/ui/sparkles-background";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <SessionProvider session={session}>
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-white">
                <Sidebar />
                <SparklesBackground />
                {/* Responsive margin for different sidebar widths */}
                <div className="md:ml-20 lg:ml-64">
                    <Header />
                    <main className="px-4 pb-24 md:pb-6 md:px-6 lg:px-8">
                        {children}
                    </main>
                </div>
            </div>
        </SessionProvider>
    );
}
