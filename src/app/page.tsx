'use client'
import React from 'react';
import Image from 'next/image'
import StarField from '@/components/animations/starfield';
import Link from 'next/link';
import WalletConnector from '@/components/ui/connectWallet';
import Footer from '@/components/ui/footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <StarField />
      <nav className="px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-8 text-xl">
            <Link
              href="/calculators"
              className="text-gray-400 hover:text-white font-neuethin transition duration-300"
            >
              Calculators
            </Link>
            <Link
              href="mypositions"
              className="text-gray-400 hover:text-white font-neuethin transition duration-300"
            >
              My positions
            </Link>
          </div>
          <WalletConnector />
        </div>
      </nav>
      <main className="flex-1 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 flex justify-center">
              <div className="w-[430px] h-[430px] relative animate-float">
                <Image
                  src="/images/LumosLogo.png"
                  width={500}
                  height={500}
                  alt="Lumos app logo"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="lg:w-1/2 flex flex-col items-start space-y-12">
              <div className="space-y-6 text-2xl font-neuethin">
                <p>
                  Maximize your DeFi profits—smart liquidity, zero hassle.
                </p>
                <p>
                  Take control of your CLMM pools with precision and power.
                </p>
                <p>
                  Simplify liquidity management—earn more, stress less.
                </p>
              </div>

              <div className="flex gap-6">
                <Link
                  href="#"
                  className="px-8 py-4 rounded-md border border-white/20 bg-white/5 
                    hover:bg-white hover:text-black transition-all duration-300 
                    text-lg font-neuethin"
                >
                  Get started
                </Link>
                <Link
                  href="/knowmore"
                  className="px-8 py-4 rounded-md border border-white/20 bg-white/5 
                    hover:bg-white hover:text-black transition-all duration-300 
                    text-lg font-neuethin"
                >
                  Know more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
