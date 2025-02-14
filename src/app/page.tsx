/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import StarField from '@/components/animations/starfield';
import Link from 'next/link';
import Footer from '@/components/ui/footer';
import LoginModal from '@/components/ui/modals/LoginModal';
import { activeUser } from '@/state/user';
import { useAtomValue } from 'jotai';
import Navbar from '@/components/ui/navbar';
import axios from 'axios';

const LandingPage = () => {
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>(undefined)
  const user = useAtomValue(activeUser);

  useEffect(() => {
    async function getUserDetails() {
      try {
        if (user !== undefined) {
          const { data } = (await axios.get(`/api/lumos/users`,
            { params: { "uId": user.uid } }
          ));
          setUserDetails(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    getUserDetails();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <StarField />
      <Navbar></Navbar>
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
                {user === undefined &&
                  <Link
                    href="/calculators"
                    className="custom-button"
                  >
                    Get started
                  </Link>
                }
                {user !== undefined && userDetails?.user_type === "FREE" &&
                  <Link
                    href="/calculators"
                    className="custom-button"
                  >
                    Get started
                  </Link>
                }
                {user !== undefined && userDetails?.user_type !== "FREE" &&
                  <Link
                    href="/calculators"
                    className="custom-button"
                  >
                    Get started
                  </Link>
                }
                <Link
                  href="/knowmore"
                  className="custom-button"
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
