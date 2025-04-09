'use client';
import React, { useState, useRef } from 'react';
import Footer from '@/components/ui/footer';
import LoginModal from '@/components/ui/modals/LoginModal';
import Navbar from '@/components/ui/navbar';
import axios from 'axios';
// import Link from 'next/link';

const LandingPage = () => {
	const [openLogin, setOpenLogin] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [submitted, setSubmitted] = useState<boolean>(false);
	const waitlistRef = useRef<HTMLDivElement>(null);

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await axios.post(`/api/lumos/waitlist`, {
			email,
		});
		setSubmitted(true);
		setEmail('');
		setTimeout(() => {
			setSubmitted(false);
		}, 3000);
	};

	const scrollToWaitlist = () => {
		waitlistRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

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
							src="/videos/LiquidMetal.mp4"
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

						{/* <div className="absolute md:bottom-[calc(43%-280px)] right-1/2 translate-x-1/2 md:right-[calc(10%-200px)] md:translate-x-0 z-20 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
							<Link href="/calculators" className="custom-button">
								Get Started
							</Link>
							<Link href="/knowmore" className="custom-button">
								Know More
							</Link>
						</div> */}

						<div className="absolute md:bottom-[calc(43%-280px)] right-1/2 translate-x-1/2 md:right-[calc(10%-200px)] md:translate-x-0 z-20 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
							<button
								onClick={scrollToWaitlist}
								className="custom-button"
							>
								<span>Join Waitlist {'>'}</span>
							</button>
						</div>
					</div>
				</main>
			</div>

			<div ref={waitlistRef} className="text-white py-16 px-4 w-full">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-2xl md:text-4xl mb-6 text-center">
						Join Our Waitlist
					</h2>
					<p className="text-lg md:text-xl mb-8 text-center max-w-2xl mx-auto">
						Be among the first to access our DeFi tools and
						revolutionize your financial strategy. Enter your email
						below to secure your spot.
					</p>

					<form onSubmit={handleSubmit} className="max-w-lg mx-auto">
						<div className="flex flex-col md:flex-row gap-4">
							<input
								type="email"
								value={email}
								onChange={handleEmailChange}
								placeholder="Enter your email address"
								required
								className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg 
                                         text-white placeholder-gray-400 focus:outline-none focus:border-gray-500
                                         transition-colors"
							/>
							<button
								type="submit"
								className="custom-button whitespace-nowrap"
							>
								Join Waitlist
							</button>
						</div>
						{submitted && (
							<p className="text-green-400 mt-3 text-center">
								Thank you! You've been added to our waitlist.
							</p>
						)}
					</form>

					<p className="text-sm text-gray-400 mt-6 text-center">
						We respect your privacy and will never share your
						information.
					</p>
				</div>
			</div>

			<Footer />
			<LoginModal isOpen={openLogin} onClose={setOpenLogin} />
		</div>
	);
};

export default LandingPage;
