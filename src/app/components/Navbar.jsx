'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { walletConnected, account, connectWallet } = useWallet();

  return (
    <nav className="backdrop-blur-lg bg-gray-900/40 border border-gray-800/50 rounded-xl shadow-xl px-4 py-3 mb-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2
            }}
            className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg flex items-center justify-center"
            style={{ boxShadow: '0 0 10px 1px #00eeff, 0 0 20px 0px rgba(0, 238, 255, 0.2)' }}
          >
            <span className="text-white font-bold">S</span>
          </motion.div>
          <span className="font-bold text-xl text-cyan-400" style={{ textShadow: '0 0 8px rgba(0, 238, 255, 0.8)' }}>SecureSonic.Ai</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-all duration-300">
            Home
          </Link>


          {walletConnected ? (
            <motion.div 
              className="bg-gray-800 text-green-400 font-medium py-2 px-6 rounded-lg shadow-lg flex items-center"
            >
              ✅ {account.slice(0, 6)}...{account.slice(-4)}
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-lg"
              style={{ boxShadow: '0 0 10px 1px #b400ff, 0 0 20px 0px rgba(180, 0, 255, 0.2)' }}
            >
              Connect Wallet
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden pt-4 pb-2 backdrop-blur-lg bg-gray-900/40 border border-gray-800/50 rounded-xl shadow-xl mt-2"
        >
          <div className="flex flex-col space-y-3 px-4">
            <Link href="/" className="text-gray-300 py-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>

            {walletConnected ? (
              <div className="bg-gray-800 text-green-400 font-medium py-2 px-6 rounded-lg shadow-lg text-center">
                ✅ {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            ) : (
              <button 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-lg w-full"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
