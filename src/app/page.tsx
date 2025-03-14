/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
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
	const [userDetails, setUserDetails] = useState<any>(undefined);
	const [currentProtocolIndex, setCurrentProtocolIndex] = useState(0);
	const protocolsRef = useRef(null);
	const user = useAtomValue(activeUser);

	const protocols = ['Ekubo', 'Vesu', 'Nostra', 'Haiko'];

	const nextProtocol = () => {
		setCurrentProtocolIndex((prevIndex) =>
			prevIndex === protocols.length - 1 ? 0 : prevIndex + 1
		);
	};

	const prevProtocol = () => {
		setCurrentProtocolIndex((prevIndex) =>
			prevIndex === 0 ? protocols.length - 1 : prevIndex - 1
		);
	};

	useEffect(() => {
		async function getUserDetails() {
			try {
				if (user !== undefined) {
					const { data } = await axios.get(`/api/lumos/users`, {
						params: { uId: user.uid },
					});
					setUserDetails(data.data);
				}
			} catch (err) {
				console.error(err);
			}
		}
		getUserDetails();
		const interval = setInterval(() => {
			nextProtocol();
		}, 3000);

		return () => clearInterval(interval);
	}, [user]);

	const getVisibleProtocols = () => {
		const visibleProtocols = [];
		for (let i = 0; i < 3; i++) {
			const index = (currentProtocolIndex + i) % protocols.length;
			visibleProtocols.push(protocols[index]);
		}
		return visibleProtocols;
	};

	return (
		<div className="min-h-screen flex flex-col">
			<StarField />
			<Navbar />
			<section className="flex-1 flex items-center px-6 pt-8 pb-16">
				<div className="max-w-7xl mx-auto w-full">
					<div className="flex flex-col items-center text-center">
						<div className="mb-12 w-[430px] h-[430px] relative animate-float">
							<Image
								src="/images/LumosLogo.png"
								width={500}
								height={500}
								alt="Lumos app logo"
								className="object-contain"
								priority
							/>
						</div>
						<div className="max-w-3xl">
							<h1 className="text-4xl lg:text-5xl font-neuethin mb-8">
								Making DeFi Simple
							</h1>
							<div className="text-xl lg:text-2xl font-neuethin mb-10">
								<p>
									Maximize your CLMM yields with intelligent
									position optimization
								</p>
							</div>
							<div className="flex flex-wrap justify-center gap-6 mb-10">
								{(user === undefined ||
									userDetails?.user_type === 'FREE' ||
									userDetails?.user_type !== 'FREE') && (
									<Link
										href="/calculators"
										className="custom-button"
									>
										Get started
									</Link>
								)}
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
			</section>
			<section className="py-12 px-6 border-t border-gray-800">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl font-neuethin mb-10 text-center">
						Supported Protocols
					</h2>
					<div className="relative" ref={protocolsRef}>
						<button
							onClick={prevProtocol}
							className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900 bg-opacity-50 p-3 rounded-full"
							aria-label="Previous protocol"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>
						<div className="flex justify-center items-center gap-8 px-16 overflow-hidden">
							{getVisibleProtocols().map((protocol, index) => (
								<div
									key={`${protocol}-${index}`}
									className="flex flex-col items-center transition-all duration-500 ease-in-out opacity-0 translate-x-10 animate-slide-in"
									style={{
										animationDelay: `${index * 0.1}s`,
									}}
								>
									<div className="w-36 h-36 rounded-full border border-gray-700 flex items-center justify-center mb-3">
										<span className="text-3xl font-bold">
											<Image
												width={100}
												height={100}
												src={`/images/${protocol}Logo.png`}
												alt={''}
											></Image>
										</span>
									</div>
								</div>
							))}
						</div>
						<button
							onClick={nextProtocol}
							className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900 bg-opacity-50 p-3 rounded-full"
							aria-label="Next protocol"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>
			</section>
			<section className="py-16 px-6 border-t border-gray-800">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl font-neuethin mb-12 text-center">
						Why choose Lumos for CLMM management?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<div className="p-6 border border-gray-800 rounded-lg">
							<div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-700 mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-neuethin mb-3">
								Optimal Position Sizing
							</h3>
							<p className="font-neuethin">
								Advanced algorithms determine ideal position
								sizes based on market conditions and price
								volatility.
							</p>
						</div>
						<div className="p-6 border border-gray-800 rounded-lg">
							<div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-700 mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-neuethin mb-3">
								Real-time Rebalancing
							</h3>
							<p className="font-neuethin">
								Stay in optimal range with automated position
								rebalancing as market conditions change.
							</p>
						</div>
						<div className="p-6 border border-gray-800 rounded-lg">
							<div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-700 mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2vquot10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-neuethin mb-3">
								Performance Analytics
							</h3>
							<p className="font-neuethin">
								Comprehensive data visualizations and
								performance metrics to maximize your returns.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className="py-16 px-6">
				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-3xl font-neuethin mb-6">
						Ready to transform your DeFi liquidity strategy?
					</h2>
					<p className="font-neuethin text-xl mb-8">
						Join thousands of traders who have already increased
						their yields with Lumos.
					</p>
					<div className="flex flex-wrap justify-center gap-6">
						<Link href="/calculators" className="custom-button">
							Start optimizing now
						</Link>
						<Link href="/knowmore" className="custom-button">
							Learn how it works
						</Link>
					</div>
				</div>
			</section>
			<Footer />
			<LoginModal isOpen={openLogin} onClose={setOpenLogin} />
		</div>
	);
};

export default LandingPage;
