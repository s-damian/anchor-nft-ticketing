import "./globals.css";
import AppWalletProvider from "../src/components/AppWalletProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body>
                <AppWalletProvider>{children}</AppWalletProvider>
            </body>
        </html>
    );
}
