'use client'
import React, { useState } from 'react';
import Image from 'next/image'
import StarField from '@/components/animations/starfield';
import Link from 'next/link';
import Footer from '@/components/ui/footer';
import LoginModal from '@/components/ui/modals/LoginModal';
import { activeUser } from '@/state/user';
import { useAtom } from 'jotai';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const LandingPage = () => {
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [user, setUser] = useAtom(activeUser);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(undefined);
  };

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
            <Link
              href="/pools"
              className="text-gray-400 hover:text-white font-neuethin transition duration-300"
            >
              Pools
            </Link>
          </div>
          {user !== undefined ? (
            <button className="px-8 py-2 rounded-md border border-white/20 bg-white/5 
                    hover:bg-white hover:text-black transition-all duration-500 
                    text-lg font-neuethin"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          ) : (
            <button className="px-8 py-2 rounded-md border border-white/20 bg-white/5 
                    hover:bg-white hover:text-black transition-all duration-500 
                    text-lg font-neuethin"
              onClick={() => setOpenLogin(true)}
            >
              Login
            </button>
          )}
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
                  className="px-8 py-3 rounded-md border border-white/20 bg-white/5 
                    hover:bg-white hover:text-black transition-all duration-500 
                    text-lg font-neuethin"
                >
                  Get started
                </Link>
                <Link
                  href="/knowmore"
                  className="px-8 py-3 rounded-md border border-white/20 bg-white/5 
                    hover:bg-white hover:text-black transition-all duration-500 
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
      <LoginModal isOpen={openLogin} onClose={setOpenLogin} />
    </div>
  );
};

export default LandingPage;
