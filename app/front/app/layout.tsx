import "./globals.css";
import Head from "next/head";
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
                <Head>
                    <title>Anchor NFT Ticketing</title>
                    <meta name="description" content="Plateforme de billetterie NFT basée sur Solana" />
                </Head>
                <ClientOnly>
                    <AppWalletProvider>{children}</AppWalletProvider>
                </ClientOnly>
            </body>
        </html>
    );
}
