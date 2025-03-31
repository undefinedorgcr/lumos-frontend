'use client';
import {
	fetchLatestPairVolume,
	fetchTokens,
	TOP_TOKENS_SYMBOL,
} from '@/app/api/ekuboApi';
import Footer from '@/components/ui/footer';
import Navbar from '@/components/ui/navbar';
import { Token } from '@/types/Tokens';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TokenSelectorModal } from '@/components/ui/modals/TokenSelector';
import { ErrorModal } from '@/components/ui/modals/ErrorModal';
import Calculator from '@/components/ui/Calculator';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { fetchCryptoPrice } from '@/lib/utils';

export default function EkuboCalculator() {
	const [tokens, setTokens] = useState<Token[]>([]);
	const [fee, setFee] = useState(0);
	const [openTokenSelector, setOpenTokenSelector] = useState(false);
	const [openError, setOpenError] = useState(false);
	const [errorTitle, setErrorTitle] = useState('');
	const [errorDesc, setErrorDesc] = useState('');
	const [selectedToken, setSelectedToken] = useState(1);
	const [showCalculator, setShowCalculator] = useState(false);
	const [token0, setToken0] = useState<Token | undefined>(undefined);
	const [token1, setToken1] = useState<Token | undefined>(undefined);
	const [volume, setVolume] = useState<number | null>(null);
	const [initialPrice, setInitialPrice] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function getTokens() {
			try {
				setTokens(await fetchTokens());
			} catch (err) {
				console.error(err);
			}
		}
		getTokens();
	}, [setTokens]);

	const feeOptions = [
		{ rate: 0.01, precision: 0.02, label: '0.01% fee and 0.02% precision' },
		{ rate: 0.05, precision: 0.1, label: '0.05% fee and 0.1% precision' },
		{ rate: 0.3, precision: 0.6, label: '0.3% fee and 0.6% precision' },
		{ rate: 1, precision: 2, label: '1% fee and 2% precision' },
		{ rate: 5, precision: 10, label: '5% fee and 10% precision' },
	];

	async function handleContinue() {
		if (token0 == undefined || token1 == undefined) {
			setOpenError(true);
			setErrorTitle('Tokens not selected');
			setErrorDesc(
				'Please select both tokens to continue to IL calculator'
			);
		} else if (token0 == token1) {
			setOpenError(true);
			setErrorTitle('Tokens can not be the same');
			setErrorDesc(
				'Please select different tokens to continue to IL calculator'
			);
		} else if (fee == 0) {
			setOpenError(true);
			setErrorTitle('Fee not selected');
			setErrorDesc('Please select the fee to continue to IL calculator');
		} else {
			setIsLoading(true);
			const t0price = Number(await fetchCryptoPrice(token0.symbol));
			const t1price = Number(await fetchCryptoPrice(token1.symbol));
			setVolume(
				await fetchLatestPairVolume(token0, token1, t0price, t1price)
			);
			setInitialPrice(t0price / t1price);
			setShowCalculator(true);
			setIsLoading(false);
		}
	}

	return (
		<div>
			<Navbar />
			{!showCalculator && (
				<main className="max-w-4xl mx-auto px-6 py-20">
					{tokens != undefined && !isLoading ? (
						<div className="bg-white/5 rounded-2xl backdrop-blur-sm">
							<div className="p-8 space-y-8">
								<div className="flex items-center gap-4">
									<div className="w-16 h-16 rounded-full bg-white/10 p-3 flex items-center justify-center">
										<Image
											src="/images/EkuboLogo.png"
											alt="Ekubo logo"
											width={200}
											height={200}
											className="object-contain"
										/>
									</div>
									<div className="space-y-1">
										<h1 className="text-2xl ">
											Ekubo Protocol Calculator
										</h1>
										<p className="text-gray-400">
											Calculate impermanent loss and
											returns
										</p>
									</div>
								</div>

								{/* Token Selection */}
								<div className="space-y-4">
									<label className="text-lg text-gray-300">
										Select Pair
									</label>
									<div className="grid grid-cols-2 gap-4">
										{[token0, token1].map((token, idx) => (
											<button
												key={idx}
												onClick={() => {
													setSelectedToken(idx + 1);
													setOpenTokenSelector(true);
												}}
												className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                                                    bg-white/5 hover:bg-white/10 transition-colors
                                                    border border-white/10 hover:border-white/20"
											>
												{token
													? token.symbol
													: 'Select a token'}
											</button>
										))}
									</div>
								</div>
								<div className="space-y-4">
									<label className="text-lg text-gray-300">
										Select Fee
									</label>
									<div className="grid grid-cols-2 gap-4">
										{feeOptions.map((option) => (
											<button
												key={option.rate}
												onClick={() =>
													setFee(option.rate)
												}
												className={`px-6 py-4 rounded-xl text-center transition-all duration-300
                                                    ${
														fee === option.rate
															? 'bg-white/10 border-white'
															: 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
													}
                                                    border text-sm`}
											>
												{option.label}
											</button>
										))}
									</div>
								</div>
								<div className="pt-4">
									<button
										onClick={handleContinue}
										className="w-full border border-white px-7 py-3 rounded-md  
                                                   transition duration-500 hover:text-black hover:bg-white"
									>
										Calculate Returns
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="bg-white/5 rounded-2xl p-12 text-center space-y-4">
							<LoadingSpinner />
							<p className="text-gray-400">
								Loading calculator...
							</p>
						</div>
					)}
				</main>
			)}

			{showCalculator &&
				token0 !== undefined &&
				token1 !== undefined &&
				!isLoading && (
					<Calculator
						token0={token0}
						token1={token1}
						feeRate={fee}
						initialPrice={initialPrice}
						volume={volume}
						liquidity={1}
					/>
				)}

			<TokenSelectorModal
				isOpen={openTokenSelector}
				onClose={setOpenTokenSelector}
				onSelectToken={selectedToken == 1 ? setToken0 : setToken1}
				tokens={tokens}
				topTokens={TOP_TOKENS_SYMBOL}
			/>

			<ErrorModal
				isOpen={openError}
				onClose={setOpenError}
				title={errorTitle}
				message={errorDesc}
			/>

			<Footer />
		</div>
	);
}
