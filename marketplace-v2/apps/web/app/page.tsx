'use client'

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white selection:bg-brand-500 selection:text-white -mt-16 overflow-hidden">
       {/* Video Background */}
      <div className="absolute inset-0 z-0 h-screen [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Adjusted gradient to be lighter to show video more but still read text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 dark:from-black dark:via-black/60 dark:to-black/40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto pt-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 hover:bg-white/20 transition-colors cursor-default shadow-lg">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-white shadow-black drop-shadow-md">The Next Gen Crypto Marketplace</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[1.1] text-white drop-shadow-2xl">
            Buy & Sell Real World Assets <br className="hidden md:block" />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-emerald-300 relative inline-block py-2 pr-2 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              Crypto
              <span className="absolute -inset-1 bg-brand-500/20 blur-2xl -z-10 animate-pulse"></span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-lg">
            Experience the future of e-commerce. Decentralized payments, escrow protection, and instant settlements.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/listings">
              <Button className="h-14 px-8 text-lg rounded-full bg-brand-600 hover:bg-brand-500 shadow-xl shadow-brand-500/20 transition-all w-full sm:w-auto flex items-center gap-2 group border border-brand-400/20">
                Explore Products 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sell">
              <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                Start Selling
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 py-32 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">Why VartMarkt?</h2>
             <p className="text-neutral-500 dark:text-neutral-400 text-lg">Built for the future of digital commerce</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: ShieldCheck,
                title: "Escrow Protection",
                desc: "Funds held safely in smart contracts until delivery is confirmed."
              },
              {
                icon: Globe,
                title: "Global Marketplace",
                desc: "Trade across borders without banking restrictions or delays."
              },
              {
                icon: Lock,
                title: "Secure Payments",
                desc: "On-chain settlements ensure transparency and immutability."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-3xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-brand-500/30 transition-colors group shadow-sm hover:shadow-md"
              >
                <div className="w-14 h-14 bg-brand-100 dark:bg-brand-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Roadmap Section */}
       <section className="relative z-10 py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-emerald-600 dark:from-white dark:to-neutral-500">
               Strategic Roadmap
             </h2>
             <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
               Our vision to revolutionize e-commerce with blockchain and AI.
             </p>
          </div>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500 via-emerald-500 to-transparent opacity-30"></div>

            <div className="space-y-24">
              {[
                { 
                  phase: "Phase 1: The Foundation", 
                  status: "current",
                  title: "Trust & Transact (MVP)", 
                  desc: "A safe marketplace for crypto & fiat transactions.",
                  features: ["Basic Listings & Search", "Stablecoin Payments (USDC)", "Smart Contract Escrow", "On-chain Verified Reviews"]
                },
                { 
                  phase: "Phase 2: UX Revolution", 
                  status: "upcoming",
                  title: "Customization & AI", 
                  desc: "Making it feel state-of-the-art with hyper-personalization.",
                  features: ["Seller Studio (Custom Stores)", "AI Search Assistant (Gemini 3.0)", "Business Intelligence Suite", "Mobile App (iOS/Android)"]
                },
                { 
                  phase: "Phase 3: The Ecosystem", 
                  status: "future",
                  title: "Web3 Integration", 
                  desc: "Advanced features to lock in users and create a moat.",
                  features: ["Loyalty Tokens", "Digital Twins (Phygital)", "DAO Governance", "Global Logistics Partners"] 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                    <div className="flex-1 w-full md:text-right hidden md:block">
                       {i % 2 !== 0 && (
                          <div className="pr-12 text-right">
                             <div className={`inline-block px-3 py-1 mb-2 rounded-full text-xs font-mono border ${item.status === 'current' ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-neutral-300 text-neutral-500'}`}>
                                {item.phase}
                             </div>
                             <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                             <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                          </div>
                      )}
                    </div>

                    <div className="relative">
                        <div className={`w-8 h-8 rounded-full border-4 ${item.status === 'current' ? 'bg-brand-500 border-brand-200 dark:border-brand-900 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-neutral-800 border-neutral-700' } relative z-10 flex items-center justify-center`}>
                           {item.status === 'current' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                        </div>
                    </div>

                    <div className="flex-1 w-full pl-0 md:pl-12">
                      <div className="md:hidden mb-4">
                         <span className="text-sm font-mono text-brand-500">{item.phase}</span>
                         <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">{item.title}</h3>
                         <p className="text-neutral-500 dark:text-neutral-400 text-sm">{item.desc}</p>
                      </div>

                      {/* Content Card */}
                      <div className="glass p-8 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-brand-500/30 transition-all shadow-xl">
                          <h4 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                             <Zap className="w-4 h-4 text-brand-500" /> Key Features
                          </h4>
                          <ul className="space-y-3">
                              {item.features.map((feature, j) => (
                                  <li key={j} className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${item.status === 'current' ? 'bg-brand-500' : 'bg-neutral-400'}`}></div>
                                      <span>{feature}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>

                      {i % 2 !== 0 && (
                          <div className="hidden md:block">
                             {/* Placeholder for right side if needed */}
                          </div>
                      )}
                      {i % 2 === 0 && (
                         <div className="hidden md:block pl-12">
                             <div className={`inline-block px-3 py-1 mb-2 rounded-full text-xs font-mono border ${item.status === 'current' ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'border-neutral-300 dark:border-neutral-700 text-neutral-500'}`}>
                                {item.phase}
                             </div>
                             <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                             <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                         </div>
                      )}
                    </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
