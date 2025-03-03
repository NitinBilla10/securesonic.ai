// components/Footer.jsx
const Footer = () => {
    return (
      <footer className="backdrop-blur-lg bg-gray-900/40 border border-gray-800/50 rounded-xl shadow-xl mt-12 py-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div>
              <h3 className="font-bold text-lg mb-4 text-cyan-400" style={{ textShadow: '0 0 8px rgba(0, 238, 255, 0.8)' }}>SecureSonic.Ai</h3>
              <p className="text-gray-400 text-sm">
                AI-driven Smart Contract Auditor & Deployer. Scan, optimize, and deploy your
                Solidity contracts with confidence.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-purple-400" style={{ textShadow: '0 0 8px rgba(180, 0, 255, 0.8)' }}>Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-cyan-400" style={{ textShadow: '0 0 8px rgba(0, 238, 255, 0.8)' }}>Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 px-4">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} SecureSonic.Ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;