/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Footer from '@/components/ui/footer';
import Navbar from '@/components/ui/navbar';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import WalletConnector from '@/components/ui/connectWallet';
import { useAtomValue } from 'jotai';
import { walletStarknetkitLatestAtom } from '@/state/connectedWallet';
import { cairo, CallData } from 'starknet';
import { activeUser } from '@/state/user';
import axios from 'axios';
import InfoModal from '@/components/ui/modals/InfoModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorModal from '@/components/ui/modals/ErrorModal';
import { getAddresses, getNodeUrl, getProvider } from '@/constants';

const Checkout = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const user = useAtomValue(activeUser);
	const wallet = useAtomValue(walletStarknetkitLatestAtom);
	const [plan, setPlan] = useState<{
		name: string;
		price: number;
		description: string;
	} | null>(null);
	const [openInfo, setOpenInfo] = useState<boolean>(false);
	const [openError, setOpenError] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const chainId = wallet?.chainId;
	const USDC_CONTRACT_ADDRESS = getAddresses(chainId);
	const NODE_URL = getNodeUrl(chainId);
	const provider = getProvider(NODE_URL);
	const plans = {
		free: {
			name: 'FREE',
			price: 0,
			description: 'Perfect for getting started with DeFi analytics',
		},
		pro: {
			name: 'PRO',
			price: 20,
			description: 'Advanced tools for serious DeFi traders',
		},
		degen: {
			name: 'DEGEN',
			price: 50,
			description: 'Ultimate toolkit for DeFi power users',
		},
	};

	useEffect(() => {
		const planType = searchParams.get('plan')?.toLowerCase();
		if (planType && planType in plans) {
			setPlan(plans[planType as keyof typeof plans]);
		}
	}, [searchParams]);

	const waitForTransaction = async (hash: string) => {
		try {
			await provider.waitForTransaction(hash);
			return true;
		} catch (error) {
			console.error('Error waiting for transaction:', error);
			return false;
		}
	};

	const handlePayment = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			if (plan !== null) {
				const tx = await wallet?.account.execute([
					{
						contractAddress: USDC_CONTRACT_ADDRESS,
						entrypoint: 'transfer',
						calldata: CallData.compile({
							recipient:
								process.env.NEXT_PUBLIC_RECEIVER_ADDR || '',
							amount: cairo.uint256(plan.price * 10 ** 6),
						}),
					},
				]);

				if (tx) {
					setLoading(true);
					const isConfirmed = await waitForTransaction(
						tx.transaction_hash
					);
					setLoading(false);
					if (isConfirmed) {
						const res = await axios.put('/api/lumos/users', {
							uId: user?.uid,
							newUserType: plan?.name,
						});
						if (res.status == 200) {
							setOpenInfo(true);
						} else {
							setOpenError(true);
						}
					} else {
						setOpenError(true);
					}
				}
			}
		} catch (error: any) {
			console.log(error);
		}
	};

	function handleSuccessClose() {
		setOpenInfo(false);
		router.push('/');
	}

	if (!plan) {
		return (
			<div>
				<Navbar />
				<main className="max-w-7xl mx-auto px-6 py-12">
					<div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
						<p className="text-xl font-light text-gray-400">
							Invalid plan selected
						</p>
						<Link
							href="/pricing"
							className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							Return to pricing
						</Link>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	const calculateTotals = () => {
		const subtotal = plan.price;
		const serviceFee = subtotal * 0.03; // 3% service fee
		const total = subtotal + serviceFee;

		return {
			subtotal: subtotal.toFixed(2),
			serviceFee: serviceFee.toFixed(2),
			total: total.toFixed(2),
		};
	};

	const totals = calculateTotals();

	return (
		<div>
			<Navbar />
			<main className="max-w-7xl mx-auto px-6 py-12">
				<div className="space-y-8">
					<div className="space-y-4">
						<header className="flex items-center gap-4">
							<Link
								href="/pricing"
								className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all ring-1 ring-white/20"
							>
								<ArrowLeft className="w-5 h-5" />
							</Link>
							<h1 className="text-3xl font-light">Checkout</h1>
							<WalletConnector />
						</header>
						<p className="text-gray-400">
							Complete your subscription purchase
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						<div className="space-y-6">
							<div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/20">
								<h2 className="text-xl font-light mb-4">
									Payment Method
								</h2>
								{/* TODO: implement */}
								{/* <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 ring-1 ring-white/20">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                    <div>
                      <p className="font-light">Credit Card</p>
                      <p className="text-sm text-gray-400">Powered by Stripe</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Card Number"
                      className="col-span-2 p-3 rounded-lg bg-white/5 ring-1 ring-white/20 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="p-3 rounded-lg bg-white/5 ring-1 ring-white/20 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                    <input 
                      type="text" 
                      placeholder="CVC"
                      className="p-3 rounded-lg bg-white/5 ring-1 ring-white/20 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div> */}
								<div className="space-y-4">
									<div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 ring-1 ring-white/20">
										<div>
											<p className="font-light">
												Crypto Deposit
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/20">
								<h2 className="text-xl font-light mb-4">
									Billing Information
								</h2>
								<div className="space-y-4">
									<input
										type="email"
										placeholder="Email"
										className="w-full p-3 rounded-lg bg-white/5 ring-1 ring-white/20 focus:ring-indigo-500 focus:outline-none transition-all"
									/>
								</div>
							</div>
						</div>
						<div className="space-y-6">
							<div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm ring-1 ring-white/20">
								<h2 className="text-xl font-light mb-4">
									Order Summary
								</h2>
								<div className="space-y-4">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-light">
												{plan.name} Plan
											</h3>
											<p className="text-sm text-gray-400">
												{plan.description}
											</p>
										</div>
										<span>${plan.price}/month</span>
									</div>

									<hr className="border-white/10" />

									<TooltipProvider>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-gray-400">
													Subtotal
												</span>
												<span>${totals.subtotal}</span>
											</div>
											<div className="flex justify-between items-center">
												<div className="flex items-center gap-2">
													<span className="text-gray-400">
														Service Fee
													</span>
													<Tooltip>
														<TooltipTrigger>
															<Info className="w-4 h-4 text-gray-500" />
														</TooltipTrigger>
														<TooltipContent>
															<p className="text-sm">
																3% processing
																fee for payment
																handling
															</p>
														</TooltipContent>
													</Tooltip>
												</div>
												<span>
													${totals.serviceFee}
												</span>
											</div>
											<div className="flex justify-between text-lg">
												<span>Total</span>
												<span className="font-medium">
													${totals.total}
												</span>
											</div>
										</div>
									</TooltipProvider>
								</div>
							</div>

							<button
								className="custom-button w-full"
								onClick={handlePayment}
							>
								{loading ? (
									<>
										<LoadingSpinner></LoadingSpinner>
									</>
								) : (
									<p>Complete Purchase</p>
								)}
							</button>

							<p className="text-sm text-gray-400 text-center">
								By completing this purchase, you agree to our
								Terms of Service and Privacy Policy
							</p>
						</div>
					</div>
				</div>
			</main>
			<InfoModal
				isOpen={openInfo}
				onClose={() => {
					handleSuccessClose();
				}}
				title={'Success!'}
				message={`You have subscribed to ${plan.name}, you can now use your new features!`}
			></InfoModal>
			<ErrorModal
				isOpen={openError}
				onClose={() => {
					setOpenError(false);
				}}
				title={'Oops!'}
				message={
					'Something went wrong, if the issue persists please contact lumosapplication@gmail.com.'
				}
			></ErrorModal>
			<Footer />
		</div>
	);
};

const Page = () => {
	return (
		<Suspense>
			<Checkout />
		</Suspense>
	);
};

export default Page;
