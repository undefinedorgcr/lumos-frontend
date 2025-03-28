'use client';
import React, { useState } from 'react';
import Footer from '@/components/ui/footer';
import LoginModal from '@/components/ui/modals/LoginModal';
import Navbar from '@/components/ui/navbar';
import Link from 'next/link';

const LandingPage = () => {
	const [openLogin, setOpenLogin] = useState<boolean>(false);

	return (
		<div className="flex flex-col">
			<Navbar />
			<div className="min-h-screen flex flex-col justify-center items-center p-4">
				<main className="text-center max-w-4xl mx-auto px-4">
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<div
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-[300px] h-[300px] md:w-[400px] md:h-[400px] 
            bg-gradient-to-r from-blue-500 via-teal-300 to-amber-300 
            rounded-t-full opacity-50 blur-[80px] md:blur-[100px]"
						></div>
					</div>

					<div className="relative z-10">
						<h1 className="text-3xl md:text-6xl font-gtamerica text-white mb-4 md:mb-8 leading-tight">
							USE DEFI TO POWER
							<br />
							YOUR FINANCES
						</h1>

						<div className="absolute md:bottom-[calc(43%-280px)] right-1/2 translate-x-1/2 md:right-[calc(10%-200px)] md:translate-x-0 z-20 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
							<Link href="/calculators" className="custom-button">
								Get Started
							</Link>
							<Link href="/knowmore" className="custom-button">
								Know More
							</Link>
						</div>
					</div>
				</main>
			</div>
			<Footer />
			<LoginModal isOpen={openLogin} onClose={setOpenLogin} />
		</div>
	);
};

export default LandingPage;
