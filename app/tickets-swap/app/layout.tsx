import "./globals.css";
import AppWalletProvider from "../src/components/AppWalletProvider";
import ClientOnly from "../src/components/ClientOnly";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body>
                <title>Tickets Swap</title>
                <ClientOnly>
                    <AppWalletProvider>{children}</AppWalletProvider>
                </ClientOnly>
            </body>
        </html>
    );
}
