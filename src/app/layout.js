// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { WalletProvider } from './context/WalletContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SecureSonic.Ai - AI-Powered Smart Contract Auditor & Deployer',
  description: 'Audit and deploy smart contracts to Sonic blockchain with AI assistance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950`}>
      <WalletProvider>
        <Providers>
        
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
         
        </Providers>
        </WalletProvider>
      </body>
    </html>
  );
}