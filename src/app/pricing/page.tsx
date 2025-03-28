/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Footer from '@/components/ui/footer';
import Navbar from '@/components/ui/navbar';
import { Check } from 'lucide-react';
import WalletConnector from '@/components/ui/connectWallet';
import { useAtomValue } from 'jotai';
import { walletStarknetkitLatestAtom } from '@/state/connectedWallet';
import { activeUser } from '@/state/user';
import { useEffect, useState } from 'react';
import ErrorModal from '@/components/ui/modals/ErrorModal';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Pricing() {
	const router = useRouter();
	const [openError, setOpenError] = useState<boolean>(false);
	const [userDetails, setUserDetails] = useState<any>(undefined);
	const wallet = useAtomValue(walletStarknetkitLatestAtom);
	const user = useAtomValue(activeUser);
	const plans = [
		{
			name: 'Free',
			price: '0',
			description: 'Perfect for getting started with DeFi analytics',
			features: [
				'Track your positions',
				'Favorite pools',
				'Limited access to Lumos Agent',
				'10 requests/day',
				'Basic support assistance',
			],
		},
		{
			name: 'Pro',
			price: '20',
			description: 'Advanced tools for serious DeFi traders',
			features: [
				'Track your positions',
				'Favorite pools',
				'Limited access to Lumos Agent',
				'50 requests/day',
				'Personalized support assistance',
			],
		},
		{
			name: 'Degen',
			price: '50',
			description: 'Ultimate toolkit for DeFi power users',
			features: [
				'Track your positions',
				'Favorite pools',
				'Unlimited access to Lumos Agent',
				'Unlimited requests/day',
				'Support assistance 24/7',
			],
		},
	];

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
	}, [user]);

	function handleSubscribe(plan: string) {
		if (!user) {
			setOpenError(true);
			return;
		}
		router.push(`/pricing/checkout?plan=${plan.toLowerCase()}`);
	}

	return (
		<div>
			<Navbar />
			<main className="max-w-7xl mx-auto px-6 py-12">
				<div className="space-y-8">
					<div className="space-y-4">
						<header className="flex justify-between items-center">
							<h1 className="text-3xl ">Pricing Plans</h1>
							<WalletConnector />
						</header>
						<p className="text-gray-400">
							Choose the plan that best fits your trading style
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6">
						{plans.map((plan) => (
							<div
								key={plan.name}
								className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/20 space-y-6 hover:bg-white/10 transition-all duration-300"
							>
								<div className="space-y-2">
									<h2 className="text-2xl ">{plan.name}</h2>
									<div className="flex items-baseline gap-1">
										<span className="text-4xl ">
											${plan.price}
										</span>
										<span className="text-gray-400">
											/month
										</span>
									</div>
									<p className="text-gray-400">
										{plan.description}
									</p>
								</div>

								<div className="space-y-4">
									{plan.features.map((feature) => (
										<div
											key={feature}
											className="flex items-center gap-2"
										>
											<Check className="w-5 h-5 text-indigo-400 flex-shrink-0" />
											<span className="text-sm text-gray-300">
												{feature}
											</span>
										</div>
									))}
								</div>

								<button
									className={
										userDetails?.user_type.toLowerCase() ==
										plan.name.toLowerCase()
											? 'px-8 py-3 rounded-md border border-white bg-white hover:cursor-not-allowed text-black w-full'
											: wallet
												? `custom-button w-full`
												: 'px-8 py-3 rounded-md border border-white/5 bg-white/5 hover:cursor-not-allowed w-full'
									}
									disabled={
										!wallet ||
										userDetails?.user_type.toLowerCase() ==
											plan.name.toLowerCase()
									}
									onClick={() => handleSubscribe(plan.name)}
								>
									{userDetails?.user_type.toLowerCase() ==
									plan.name.toLowerCase()
										? `Active`
										: `Get ${plan.name}`}
								</button>
							</div>
						))}
					</div>

					{!wallet && (
						<p className="text-center text-gray-400">
							Connect your wallet to subscribe to a plan
						</p>
					)}
				</div>
			</main>
			<Footer />
			<ErrorModal
				isOpen={openError}
				onClose={() => setOpenError(false)}
				message={'You need to login/register to subscribe to a plan.'}
				title={'Error'}
			/>
		</div>
	);
}
