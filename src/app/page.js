'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, Clipboard, ArrowRight, Check, Copy, AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useWallet } from './context/WalletContext';
import OpenAI from 'openai';
import { ethers } from 'ethers';

export default function Home() {
  const { walletConnected, account } = useWallet();
  const [contract, setContract] = useState('');
  const [uploading, setUploading] = useState(false);
  const [auditResults, setAuditResults] = useState(null);
  const [securityScore, setSecurityScore] = useState(0);
  const [detailedIssues, setDetailedIssues] = useState([]);
  const [correctedCode, setCorrectedCode] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [contractABI, setContractABI] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedABI, setCopiedABI] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [currentChain,setCurrentChain] = useState();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
    dangerouslyAllowBrowser: true
  });



const SONIC_RPC_URL = "https://rpc.blaze.soniclabs.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(correctedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-cyan-400" />,
      title: "Security Auditing",
      description: "AI-powered vulnerability detection identifies critical security flaws in your smart contracts."
    },
    {
      icon: <Cpu className="h-8 w-8 text-purple-400" />,
      title: "Gas Optimization",
      description: "Automatically optimize your code to reduce gas consumption and transaction costs."
    },
    {
      icon: <Clipboard className="h-8 w-8 text-cyan-400" />,
      title: "Smart Suggestions",
      description: "Get AI-generated fixes and improvements for your Solidity code."
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-400" />,
      title: "One-Click Deployment",
      description: "Deploy your audited contracts directly to the Sonic blockchain with MetaMask."
    }
  ];

  const SONIC_CHAIN_ID = 57054; // Decimal format for internal logic
const SONIC_CHAIN_ID_HEX = "0xdede"; // Hex format for MetaMask switching


  const checkWalletConnection = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      console.log("🔹 Connected Network (Raw):", network.chainId); // Debugging
  
      setCurrentChain(Number(network.chainId)); // ✅ Convert BigInt to Number
  
      console.log("✅ Converted Chain ID:", Number(network.chainId));
  
      const accounts = await window.ethereum.request({ method: "eth_accounts" });

  
      // 🚨 Force users to be on Sonic 🚨
      if (Number(network.chainId) !== SONIC_CHAIN_ID) {
        alert("⚠️ You must be on Sonic Blockchain to use this application.");
        // ❌ Prevent further actions until they switch manually
      }
  
    } catch (error) {
      console.error("❌ Error checking wallet connection:", error);
    }
  };
  

  

  // const switchToSonicNetwork = async () => {
  //   if (!window.ethereum) {
  //     alert("❌ MetaMask is not installed! Please install MetaMask first.");
  //     return;
  //   }
  
  //   try {
  //     // ✅ Convert Chain ID to Hex (MetaMask requires hex format)
  //     const hexChainId = "0x" + SONIC_CHAIN_ID.toString(16); // Convert 57054 to 0xDEDE
  
  //     console.log("🔹 Trying to switch to Sonic:", hexChainId);
  
  //     await window.ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: hexChainId }],
  //     });
  
  //     console.log("✅ Switched to Sonic Blockchain");
  
  //   } catch (switchError) {
  //     console.error("❌ Error switching network:", switchError);
  
  //     if (switchError.code === 4902) {
  //       try {
  //         await window.ethereum.request({
  //           method: "wallet_addEthereumChain",
  //           params: [
  //             {
  //               chainId: hexChainId,
  //               chainName: "Sonic Blockchain",
  //               rpcUrls: ["https://rpc.soniclabs.com"],
  //               nativeCurrency: {
  //                 name: "Sonic Token",
  //                 symbol: "SONIC",
  //                 decimals: 18,
  //               },
  //               blockExplorerUrls: ["https://explorer.soniclabs.com/"],
  //             },
  //           ],
  //         });
  
  //         console.log("✅ Added and switched to Sonic Blockchain");
  
  //       } catch (addError) {
  //         console.error("❌ Failed to add Sonic Network:", addError);
  //         alert("❌ Failed to add Sonic Network. Please add it manually in MetaMask.");
  //       }
  //     }
  //   }
  // };
  
  
  

  const handleAudit = async () => {
    if (!walletConnected) {
      alert('Connect your wallet first!');
      return;
    }
    if (!contract.trim()) {
      alert('Paste your Solidity contract first!');
      return;
    }
  
    setUploading(true);
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert Solidity smart contract auditor. 
            Analyze the contract for vulnerabilities, gas optimizations, and best practices.
            Provide a structured JSON response containing:
            - security_score (1-10)
            - issues (array of objects with line_number, severity, and description)
            - gas_optimizations (array of objects with line_number and description)
            - improved_contract (optimized Solidity code)`
          },
          { role: "user", content: contract }
        ],
        response_format: { type: "json_object" },
      });
  
      const auditData = response.choices[0].message.content;
      const parsedData = JSON.parse(auditData);
      
      setSecurityScore(parsedData.security_score ||.0);
      setDetailedIssues([...parsedData.issues, ...(parsedData.gas_optimizations.map(opt => ({ ...opt, severity: "optimization" })))]);
      setCorrectedCode(parsedData.improved_contract || '');
      setAuditResults(auditData);
      setContractABI(JSON.stringify(parsedData.abi || []));
    } catch (error) {
      console.error("OpenAI Audit Error:", error);
    }
  
    setUploading(false);
  };

  const deployContract = async () => {
    if (!walletConnected) {
      alert("Connect your wallet first!");
      return;
    }
  
    if (!correctedCode.trim()) {
      alert("No contract code available for deployment.");
      return;
    }
  
    setDeploying(true);
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      // ✅ Check if user is on Sonic Network
      const network = await provider.getNetwork();
      console.log("Connected Network:", network.chainId);
  
      if (Number(network.chainId) !== SONIC_CHAIN_ID) {
        alert("⚠️ You must be on Sonic Blockchain to deploy.");
        setDeploying(false);
        return;
      }
  
      // ✅ Compile Solidity Code Using API
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: correctedCode }),
      });
  
      const compiled = await response.json();
      console.log("🔹 Compilation API Response:", compiled);
  
      if (!compiled || !compiled.bytecode || !compiled.abi) {
        throw new Error("❌ Compilation failed. ABI or Bytecode is missing.");
      }
  
      // ✅ Deploy the contract using ABI & Bytecode
      const factory = new ethers.ContractFactory(compiled.abi, compiled.bytecode, signer);
      const contract = await factory.deploy();
      await contract.waitForDeployment();
  
      console.log("✅ Contract Deployed at:", contract.target);
      setContractAddress(contract.target);
      setContractABI(compiled.abi);
      setDeployed(true);
  
    } catch (error) {
      console.error("❌ Deployment failed:", error);
      alert("Deployment failed! Check the console for details.");
    }
  
    setDeploying(false);
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 md:py-16"
        >
          <div className="relative mb-12">
            <div className=""></div>
            <h1 className="relative bg-opacity-80 rounded-xl py-6 text-4xl md:text-6xl font-bold mb-3">
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 text-transparent bg-clip-text">Smart Contract</span>{' '}
              <span className="bg-gradient-to-r from-purple-400 to-purple-300 text-transparent bg-clip-text">Audit & Deploy</span>
            </h1>
          </div>

          {walletConnected ? (
            <div className="flex items-center justify-center mb-8">
              <div className="bg-green-900/40 border border-green-500/30 rounded-full px-4 py-2 inline-flex items-center">
                <CheckCircle size={18} className="text-green-400 mr-2" />
                <p className="text-green-300 font-medium">
                  Wallet Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center mb-8">
              <div className="bg-red-900/40 border border-red-500/30 rounded-full px-4 py-2 inline-flex items-center">
                <XCircle size={18} className="text-red-400 mr-2" />
                <p className="text-red-300 font-medium">
                  Please connect your wallet
                </p>
              </div>
            </div>
          )}

          {!auditResults && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-2xl p-8 max-w-4xl mx-auto mb-16"
            >
              <div className="flex items-center mb-4">
                <Shield className="text-cyan-400 mr-2" size={24} />
                <label htmlFor="contract" className="block text-xl font-medium text-cyan-100">
                  Paste your Solidity contract:
                </label>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl blur-sm"></div>
                <textarea
                  id="contract"
                  value={contract}
                  onChange={(e) => setContract(e.target.value)}
                  className="relative w-full h-64 bg-gray-900/80 text-gray-100 p-4 rounded-xl resize-none border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="// Paste your Solidity contract here..."
                />
              </div>
              
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAudit}
                  disabled={uploading}
                  className="relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium py-3 px-8 rounded-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  <span className="relative flex items-center">
                    {uploading ? (
                      <>
                        <Cpu className="animate-spin mr-2" size={18} />
                        Auditing Contract...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2" size={18} />
                        Audit Contract
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
              <section className="py-16">
  <motion.h2 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="text-3xl font-bold text-center mb-16 text-cyan-400" 
    style={{ textShadow: '0 0 8px rgba(0, 238, 255, 0.8)' }}
  >
    Powerful AI Features
  </motion.h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {features.map((feature, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.2,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ 
          scale: 1.03,
          boxShadow: "0 0 15px rgba(0, 238, 255, 0.3)",
          borderColor: "rgba(0, 238, 255, 0.4)"
        }}
        className="backdrop-blur-lg bg-gray-900/40 border border-gray-800/50 rounded-xl shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300"
      >
        <motion.div 
          className="mb-4 p-3 rounded-full bg-gray-800/50"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.2 + 0.3,
            type: "spring"
          }}
          whileHover={{ 
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 }
          }}
        >
          {feature.icon}
        </motion.div>
        <motion.h3 
          className="text-xl font-semibold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
        >
          {feature.title}
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
        >
          {feature.description}
        </motion.p>
      </motion.div>
    ))}
  </div>
</section>
            </motion.div>
            
          )}

          {auditResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-px rounded-xl">
                  <div className="bg-gray-900/80 backdrop-blur-md rounded-xl px-6 py-4">
                    <h2 className="text-2xl font-bold mb-2">Security Score</h2>
                    <div className="flex items-center justify-center">
                      <div className={`text-5xl font-bold rounded-full w-24 h-24 flex items-center justify-center
                        ${securityScore >= 8 ? 'text-green-400 bg-green-900/30' : 
                        securityScore >= 5 ? 'text-yellow-400 bg-yellow-900/30' : 
                        'text-red-400 bg-red-900/30'}`}>
                        {securityScore}/10
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-xl p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="text-yellow-400 mr-2" size={24} />
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                    Audit Issues
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailedIssues.map((issue, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`p-4 rounded-lg 
                        ${issue.severity === "high" ? "bg-red-900/40 border border-red-700/50" : 
                        issue.severity === "medium" ? "bg-yellow-900/40 border border-yellow-700/50" : 
                        issue.severity === "optimization" ? "bg-purple-900/40 border border-purple-700/50" :
                        "bg-green-900/40 border border-green-700/50"}`}
                    >
                      <p className="text-lg font-bold flex items-center">
                        {issue.severity === "high" ? (
                          <XCircle size={18} className="text-red-400 mr-2" />
                        ) : issue.severity === "medium" ? (
                          <AlertTriangle size={18} className="text-yellow-400 mr-2" />
                        ) : issue.severity === "optimization" ? (
                          <Zap size={18} className="text-purple-400 mr-2" />
                        ) : (
                          <CheckCircle size={18} className="text-green-400 mr-2" />
                        )}
                        Line {issue.line_number}: 
                        <span className={`ml-2 
                          ${issue.severity === "high" ? "text-red-300" : 
                          issue.severity === "medium" ? "text-yellow-300" : 
                          issue.severity === "optimization" ? "text-purple-300" :
                          "text-green-300"}`}>
                          {issue.severity.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-gray-300 mt-2">{issue.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="backdrop-blur-lg bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-xl p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Clipboard className="text-cyan-400 mr-2" size={24} />
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                      Improved Contract
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 py-2 px-4 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-300" />}
                    <span>{copied ? "Copied!" : "Copy Code"}</span>
                  </motion.button>
                </h2>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-xl blur-sm"></div>
                  <pre className="relative bg-black/80 text-gray-100 p-6 text-start rounded-lg overflow-x-auto border border-gray-800/60">
                    {correctedCode}
                  </pre>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                {!deployed ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={deployContract}
                    disabled={deploying}
                    className="relative overflow-hidden group bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <span className="relative flex items-center">
                      {deploying ? (
                        <>
                          <Cpu className="animate-spin mr-2" size={18} />
                          Deploying to Sonic...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="mr-2" size={18} />
                          Deploy to Sonic
                        </>
                      )}
                    </span>
                  </motion.button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 p-px rounded-xl"
                  >
                    <div className="bg-gray-900/80 backdrop-blur-md rounded-xl px-6 py-4 text-center">
                      <CheckCircle size={48} className="text-green-400 mx-auto mb-2" />
                      <h3 className="text-xl font-bold text-green-300 mb-2">Contract Deployed Successfully!</h3>
                      <p className="text-cyan-100 mb-4">Contract Address: <span className="font-mono bg-black/40 py-1 px-2 rounded">{contractAddress}</span></p>
                      <div className="flex justify-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 py-2 px-4 rounded-md bg-cyan-800/50 hover:bg-cyan-700/50 transition-colors border border-cyan-700/50"
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(contractABI, null, 2));
                            setCopiedABI(true);
                            setTimeout(() => setCopiedABI(false), 2000);
                          }}
                        >
                          {copiedABI ? <Check size={16} className="text-green-400" /> : <FileText size={16} />}
                          <span>{copiedABI ? "Copied!" : "Copy ABI"}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 py-2 px-4 rounded-md bg-purple-800/50 hover:bg-purple-700/50 transition-colors border border-purple-700/50"
                          onClick={() => {
                            navigator.clipboard.writeText(contractAddress);
                            setCopiedAddress(true);
                            setTimeout(() => setCopiedAddress(false), 2000);
                          }}
                        >
                          {copiedAddress ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                          <span>{copiedAddress ? "Copied!" : "Copy Address"}</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
}