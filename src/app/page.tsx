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
				<div className="absolute inset-0 w-full h-full overflow-hidden">
					<video
						className="absolute w-full h-full object-cover mix-blend-screen"
						autoPlay
						muted
						loop
						playsInline
					>
						<source
							src="/videos/LiquidMetal.mov"
							type="video/mp4"
						/>
						Your browser does not support the video tag.
					</video>
				</div>
				<main className="text-center max-w-4xl mx-auto px-4 relative">
					<div className="relative z-10">
						<h1 className="text-3xl md:text-6xl font-gtamerica text-white mb-4 md:mb-8">
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
