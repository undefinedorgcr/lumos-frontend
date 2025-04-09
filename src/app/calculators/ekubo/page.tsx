// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import {
// 	fetchLatestPairVolume,
// 	fetchTokens,
// 	TOP_TOKENS_SYMBOL,
// 	fetchLiquidityData,
// 	fetchLiquidityInRange,
// } from '@/app/api/ekuboApi';
// import Footer from '@/components/ui/footer';
// import Navbar from '@/components/ui/navbar';
// import { Token } from '@/types/Tokens';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { TokenSelectorModal } from '@/components/ui/modals/TokenSelector';
// import { ErrorModal } from '@/components/ui/modals/ErrorModal';
// import LiquidityChart from '@/components/ui/LiquidityChart';
// import LoadingSpinner from '@/components/ui/LoadingSpinner';
// import ILCalculator from '@/components/ui/modals/ILCalculator';
// import { calculateDepositAmounts, fetchCryptoPrice } from '@/lib/utils';
// import { ChevronDown, Info } from 'lucide-react';
// import Link from 'next/link';

// export default function EkuboCalculator() {
// 	const [tokens, setTokens] = useState<Token[]>([]);
// 	const [openTokenSelector, setOpenTokenSelector] = useState(false);
// 	const [openError, setOpenError] = useState(false);
// 	const [errorTitle, setErrorTitle] = useState('');
// 	const [errorDesc, setErrorDesc] = useState('');
// 	const [selectedToken, setSelectedToken] = useState(1);
// 	const [token0, setToken0] = useState<Token | undefined>(undefined);
// 	const [token1, setToken1] = useState<Token | undefined>(undefined);
// 	const [openIlCalculator, setOpenIlCalculator] = useState(false);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [liquidityData, setLiquidityData] = useState<any>([]);
// 	const [isSettingDropdownOpen, setIsSettingDropdownOpen] = useState(false);
// 	const [recommendedFee, setRecommendedFee] = useState(0.3);

// 	const [volume, setVolume] = useState<number | null>(null);
// 	const [depositAmount, setDepositAmount] = useState(0);
// 	const [fee, setFee] = useState(0.3);
// 	const [dailyFee, setDailyFee] = useState(0);
// 	const [apr, setApr] = useState(0);
// 	const [t0CurrentPrice, setT0CurrentPrice] = useState(0);
// 	const [t1CurrentPrice, setT1CurrentPrice] = useState(0);
// 	const [initialPrice, setInitialPrice] = useState(0);
// 	const [minPrice, setMinPrice] = useState(0);
// 	const [maxPrice, setMaxPrice] = useState(0);
// 	const [priceRangePercentage, setPriceRangePercentage] = useState(1);
// 	const [depositAmounts, setDepositAmounts] = useState([0, 0]);

// 	const feeOptions = [
// 		{ rate: 0.01, precision: 0.02, label: '0.01% fee and 0.02% precision' },
// 		{ rate: 0.05, precision: 0.1, label: '0.05% fee and 0.1% precision' },
// 		{ rate: 0.3, precision: 0.6, label: '0.3% fee and 0.6% precision' },
// 		{ rate: 1, precision: 2, label: '1% fee and 2% precision' },
// 		{ rate: 5, precision: 10, label: '5% fee and 10% precision' },
// 	];

// 	useEffect(() => {
// 		async function getTokens() {
// 			try {
// 				setTokens(await fetchTokens());
// 			} catch (err) {
// 				console.error(err);
// 			}
// 		}
// 		getTokens();
// 	}, [setTokens]);

// 	useEffect(() => {
// 		if (token0 && token1) {
// 			const isStablecoin =
// 				token0.symbol === 'USDC' ||
// 				token0.symbol === 'USDT' ||
// 				token1.symbol === 'USDC' ||
// 				token1.symbol === 'USDT';

// 			const newRecommendedFee = isStablecoin ? 0.05 : 0.3;
// 			setRecommendedFee(newRecommendedFee);
// 		}
// 	}, [token0, token1]);

// 	useEffect(() => {
// 		async function updateCalculations() {
// 			if (token0 && token1 && fee > 0) {
// 				try {
// 					setIsLoading(true);
// 					const t0price = Number(
// 						await fetchCryptoPrice(token0.symbol)
// 					);
// 					const t1price = Number(
// 						await fetchCryptoPrice(token1.symbol)
// 					);

// 					setT0CurrentPrice(t0price);
// 					setT1CurrentPrice(t1price);

// 					const currentPrice = t0price / t1price;
// 					setInitialPrice(currentPrice);

// 					const min = Number(
// 						(
// 							currentPrice -
// 							currentPrice * (priceRangePercentage / 100)
// 						).toFixed(6)
// 					);
// 					const max = Number(
// 						(
// 							currentPrice +
// 							currentPrice * (priceRangePercentage / 100)
// 						).toFixed(6)
// 					);
// 					setMinPrice(min);
// 					setMaxPrice(max);

// 					setVolume(
// 						await fetchLatestPairVolume(
// 							token0,
// 							token1,
// 							t0price,
// 							t1price
// 						)
// 					);

// 					const liquidityData = await fetchLiquidityData(
// 						token0,
// 						token1,
// 						min,
// 						max,
// 						fee
// 					);
// 					setLiquidityData(liquidityData);

// 					if (depositAmount > 0) {
// 						handlePricesChange(
// 							min,
// 							max,
// 							depositAmount,
// 							liquidityData
// 						);
// 					}

// 					setIsLoading(false);
// 				} catch (error) {
// 					console.error('Error updating calculations:', error);
// 					setIsLoading(false);
// 				}
// 			}
// 		}

// 		updateCalculations();
// 	}, [token0, token1, fee]);

// 	async function handlePricesChange(
// 		min: number,
// 		max: number,
// 		amount: number,
// 		data = liquidityData
// 	) {
// 		const currentLiquidity = await fetchLiquidityInRange(min, max, data);

// 		if (volume !== null && currentLiquidity != null) {
// 			if (
// 				amount <= 0 ||
// 				t0CurrentPrice <= 0 ||
// 				volume <= 0 ||
// 				min >= max ||
// 				currentLiquidity <= 0
// 			) {
// 				setDailyFee(0);
// 				setDepositAmounts([0, 0]);
// 				return;
// 			}

// 			const amounts = calculateDepositAmounts(
// 				min,
// 				max,
// 				t0CurrentPrice / t1CurrentPrice,
// 				amount
// 			);
// 			setDepositAmounts(amounts);

// 			if (token0 && token1) {
// 				const Pl = min / 10 ** (token0.decimals - token1.decimals);
// 				const Pu = max / 10 ** (token0.decimals - token1.decimals);
// 				const liquidityAmount0 =
// 					(amounts[0] *
// 						10 ** token0.decimals *
// 						(Math.sqrt(Pu) * Math.sqrt(Pl))) /
// 					(Math.sqrt(Pu) - Math.sqrt(Pl));
// 				const liquidityAmount1 =
// 					(amounts[1] * 10 ** token0.decimals) /
// 					(Math.sqrt(Pu) - Math.sqrt(Pl));
// 				const deltaL = Math.min(liquidityAmount0, liquidityAmount1);
// 				const dailyFeeAmount =
// 					(fee / 100) *
// 					volume *
// 					(deltaL / (currentLiquidity + deltaL));
// 				setDailyFee(dailyFeeAmount);

// 				if (amount > 0) {
// 					const annualFee = dailyFeeAmount * 365;
// 					const aprValue = (annualFee / amount) * 100;
// 					setApr(aprValue);
// 				} else {
// 					setApr(0);
// 				}
// 			}
// 		}
// 	}

// 	const handlePriceRangeChange = (value: number) => {
// 		setPriceRangePercentage(value);
// 		if (initialPrice) {
// 			const min = Number(
// 				(initialPrice - initialPrice * (value / 100)).toFixed(6)
// 			);
// 			const max = Number(
// 				(initialPrice + initialPrice * (value / 100)).toFixed(6)
// 			);
// 			setMinPrice(min);
// 			setMaxPrice(max);
// 			handlePricesChange(min, max, depositAmount);
// 		}
// 	};

// 	const handleDepositAmountChange = (value: number) => {
// 		setDepositAmount(value);
// 		handlePricesChange(minPrice, maxPrice, value);
// 	};

// 	const handlePriceChange = (
// 		type: 'current' | 'min' | 'max',
// 		value: number
// 	) => {
// 		if (isNaN(value) || value <= 0) return;

// 		if (type === 'current') {
// 			setInitialPrice(value);
// 			const min = Number(
// 				(value - value * (priceRangePercentage / 100)).toFixed(6)
// 			);
// 			const max = Number(
// 				(value + value * (priceRangePercentage / 100)).toFixed(6)
// 			);
// 			setMinPrice(min);
// 			setMaxPrice(max);
// 			handlePricesChange(min, max, depositAmount);
// 		} else if (type === 'min') {
// 			setMinPrice(value);
// 			if (value >= maxPrice) {
// 				setMaxPrice(value * 1.01);
// 			}
// 			handlePricesChange(value, maxPrice, depositAmount);
// 		} else if (type === 'max') {
// 			setMaxPrice(value);
// 			if (value <= minPrice) {
// 				setMinPrice(value * 0.99);
// 			}
// 			handlePricesChange(minPrice, value, depositAmount);
// 		}
// 	};

// 	const handleCreatePosition = () => {
// 		if (!token0 || !token1) {
// 			setOpenError(true);
// 			setErrorTitle('Tokens not selected');
// 			setErrorDesc('Please select both tokens to create a position');
// 			return;
// 		}

// 		if (token0 === token1) {
// 			setOpenError(true);
// 			setErrorTitle('Tokens cannot be the same');
// 			setErrorDesc('Please select different tokens to create a position');
// 			return;
// 		}

// 		if (depositAmount <= 0) {
// 			setOpenError(true);
// 			setErrorTitle('Invalid deposit amount');
// 			setErrorDesc('Please enter a deposit amount greater than zero');
// 			return;
// 		}
// 	};

// 	const getSelectedFeeLabel = () => {
// 		const selected = feeOptions.find((option) => option.rate === fee);
// 		return selected
// 			? `${selected.rate}% Fee - ${selected.precision}% Precision`
// 			: 'Select fee';
// 	};

// 	const EkuboDisclaimer = () => {
// 		return (
// 			<div className="bg-[#1B1C1B] border border-[#8B9E93] rounded-lg p-3 mb-4 mx-auto max-w-5xl">
// 				<div className="flex items-start gap-2">
// 					<Info className="h-5 w-5 text-[#8B9E93] flex-shrink-0 mt-0.5" />
// 					<div>
// 						<p className="text-sm">
// 							<span className="font-medium text-[#8B9E93]">
// 								Where to start?
// 							</span>{' '}
// 							To use this calculator, first select a token pair,
// 							we will recommend you a configuration. You can
// 							choose from the popular pairs available in the{' '}
// 							<Link className="underline" href="/pools">
// 								pools
// 							</Link>{' '}
// 							section or select custom tokens.
// 						</p>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	};

// 	return (
// 		<div className="min-h-screen pt-12">
// 			<Navbar />
// 			<main className="max-w-5xl mx-auto px-2 py-4">
// 				<EkuboDisclaimer />
// 				<div className="flex flex-col lg:flex-row gap-4">
// 					<div className="w-full lg:w-3/6 space-y-3">
// 						<div className="flex gap-2">
// 							{/* Pair & Fee Selector */}
// 							<div className="w-2/6 bg-[#212322] rounded-lg p-3 border border-[#8B9E93]">
// 								<div className="mb-1">
// 									<label className="text-xs text-gray-400 block">
// 										Pair
// 									</label>
// 								</div>
// 								<div className="grid grid-cols-2 gap-1 mb-2">
// 									{[token0, token1].map((token, idx) => (
// 										<button
// 											key={idx}
// 											onClick={() => {
// 												setSelectedToken(idx + 1);
// 												setOpenTokenSelector(true);
// 											}}
// 											className="flex items-center justify-center gap-1 p-2 rounded-md
//                         bg-[#1B1C1B] hover:bg-zinc-700 transition-colors text-xs"
// 										>
// 											{token ? (
// 												<div className="flex items-center gap-1">
// 													{token.logo_url && (
// 														<Image
// 															src={token.logo_url}
// 															width={12}
// 															height={12}
// 															alt={token.symbol}
// 															className="rounded-full"
// 														/>
// 													)}
// 													<span>{token.symbol}</span>
// 												</div>
// 											) : (
// 												'Select'
// 											)}
// 										</button>
// 									))}
// 								</div>
// 								<div className="mb-1">
// 									<label className="text-xs text-gray-400 block">
// 										Setting
// 									</label>
// 								</div>
// 								<div className="relative">
// 									<button
// 										onClick={() =>
// 											setIsSettingDropdownOpen(
// 												!isSettingDropdownOpen
// 											)
// 										}
// 										className={`w-full flex items-center justify-between p-2 rounded-md transition-colors text-xs ${
// 											fee === recommendedFee
// 												? 'bg-[#2A2B2A] border border-[#4DFF6F]'
// 												: 'bg-[#1B1C1B] hover:bg-zinc-700'
// 										}`}
// 									>
// 										<div className="flex-1 text-left truncate">
// 											{fee === recommendedFee && (
// 												<span className="text-xs text-[#4DFF6F] mr-1">
// 													★
// 												</span>
// 											)}
// 											{getSelectedFeeLabel()}
// 										</div>
// 										<ChevronDown className="w-3 h-3" />
// 									</button>

// 									{isSettingDropdownOpen && (
// 										<div className="absolute z-10 mt-1 w-full bg-[#1B1C1B] rounded-md shadow-lg">
// 											{feeOptions.map((option) => (
// 												<button
// 													key={option.rate}
// 													onClick={() => {
// 														setFee(option.rate);
// 														setIsSettingDropdownOpen(
// 															false
// 														);
// 													}}
// 													className="w-full text-left px-2 py-1 hover:bg-zinc-700 text-xs"
// 												>
// 													{option.rate ===
// 														recommendedFee && (
// 														<span className="text-xs text-[#4DFF6F] mr-1">
// 															★
// 														</span>
// 													)}
// 													{option.rate}% Fee -{' '}
// 													{option.precision}%
// 													Precision
// 												</button>
// 											))}
// 										</div>
// 									)}
// 								</div>
// 							</div>

// 							{/* Expected returns */}
// 							<div className="w-4/6 bg-[#212322] rounded-lg p-3 border border-[#8B9E93]">
// 								<div className="flex justify-between text-xs mb-2">
// 									<span>Expected Returns</span>
// 									<span className="text-gray-400 text-xs">
// 										24h
// 									</span>
// 								</div>
// 								<div className="grid grid-cols-3 gap-2 mb-2">
// 									<div className="bg-[#1B1C1B] rounded-md p-5 text-center">
// 										<div className="text-gray-400 text-xs">
// 											Daily
// 										</div>
// 										<div className="text-[#4DFF6F] text-xs font-semibold">
// 											${dailyFee.toFixed(2)}
// 										</div>
// 									</div>
// 									<div className="bg-[#1B1C1B] rounded-md p-5 text-center">
// 										<div className="text-gray-400 text-xs">
// 											Month
// 										</div>
// 										<div className="text-xs font-semibold">
// 											${(dailyFee * 30).toFixed(2)}
// 										</div>
// 									</div>
// 									<div className="bg-[#1B1C1B] rounded-md p-5 text-center">
// 										<div className="text-gray-400 text-xs">
// 											Year
// 										</div>
// 										<div className="text-xs font-semibold">
// 											${(dailyFee * 365).toFixed(2)}
// 										</div>
// 									</div>
// 								</div>
// 								<div className="text-xs flex items-center">
// 									<span className="mr-1">APR:</span>
// 									<span className="text-[#4DFF6F]">
// 										{apr.toFixed(2)}%
// 									</span>
// 								</div>
// 								<button
// 									onClick={() => {
// 										setOpenIlCalculator(true);
// 									}}
// 									className="w-full bg-white hover:bg-gray-200 text-black text-sm rounded-md p-1 transition-colors mt-2"
// 								>
// 									Simulate Position
// 								</button>
// 							</div>
// 						</div>

// 						{/* Deposit Amount */}
// 						<div className="bg-[#212322] rounded-lg p-3 border border-[#8B9E93]">
// 							<div className="mb-2">
// 								<label className="text-xs text-gray-400 mb-1 block">
// 									Deposit Amount
// 								</label>
// 								<div className="bg-[#1B1C1B] p-2 rounded-md mb-2 flex items-center">
// 									<span className="text-sm mr-1">$</span>
// 									<input
// 										type="number"
// 										value={depositAmount}
// 										onChange={(e) =>
// 											handleDepositAmountChange(
// 												Number(e.target.value)
// 											)
// 										}
// 										className="bg-transparent w-full outline-none text-sm"
// 										placeholder="0"
// 									/>
// 								</div>
// 								<div className="grid grid-cols-2 gap-2">
// 									<div className="bg-[#1B1C1B] p-2 rounded-md flex justify-between items-center">
// 										<div className="flex items-center">
// 											{token0 && token0.logo_url && (
// 												<Image
// 													src={token0.logo_url}
// 													width={12}
// 													height={12}
// 													alt={token0.symbol || ''}
// 													className="rounded-full mr-1"
// 												/>
// 											)}
// 											<span className="text-xs">
// 												{token0 ? token0.symbol : '-'}
// 											</span>
// 										</div>
// 										<div className="text-right">
// 											<div className="text-xs">
// 												{token0 && t0CurrentPrice
// 													? (
// 															depositAmounts[0] /
// 															t0CurrentPrice
// 														).toFixed(4)
// 													: '0.0000'}
// 											</div>
// 											<div className="text-xs text-gray-400">
// 												${depositAmounts[0].toFixed(2)}
// 											</div>
// 										</div>
// 									</div>
// 									<div className="bg-[#1B1C1B] p-2 rounded-md flex justify-between items-center">
// 										<div className="flex items-center">
// 											{token1 && token1.logo_url && (
// 												<Image
// 													src={token1.logo_url}
// 													width={12}
// 													height={12}
// 													alt={token1.symbol || ''}
// 													className="rounded-full mr-1"
// 												/>
// 											)}
// 											<span className="text-xs">
// 												{token1 ? token1.symbol : '-'}
// 											</span>
// 										</div>
// 										<div className="text-right">
// 											<div className="text-xs">
// 												{token1 && t1CurrentPrice
// 													? (
// 															depositAmounts[1] /
// 															t1CurrentPrice
// 														).toFixed(4)
// 													: '0.0000'}
// 											</div>
// 											<div className="text-xs text-gray-400">
// 												${depositAmounts[1].toFixed(2)}
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</div>

// 						{/* Current Price */}
// 						<div className="bg-[#212322] rounded-lg p-3 border border-[#8B9E93]">
// 							<div className="text-xs text-gray-400 mb-1">
// 								Current Price
// 							</div>
// 							<div className="bg-[#1B1C1B] p-2 rounded-md flex items-center">
// 								<input
// 									type="number"
// 									value={initialPrice}
// 									onChange={(e) =>
// 										handlePriceChange(
// 											'current',
// 											Number(e.target.value)
// 										)
// 									}
// 									className="bg-transparent w-full outline-none text-sm"
// 									step="0.000001"
// 									min="0.000001"
// 									disabled
// 								/>
// 								<span className="ml-1 text-xs">
// 									{token1 ? token1.symbol : '-'}/
// 									{token0 ? token0.symbol : '-'}
// 								</span>
// 							</div>
// 						</div>

// 						{/* Price Range */}
// 						<div className="bg-[#212322] rounded-lg p-3 border border-[#8B9E93]">
// 							<div className="flex justify-between text-xs mb-1">
// 								<span>Price Range</span>
// 								<span className="text-gray-400">
// 									{priceRangePercentage}% range
// 								</span>
// 							</div>
// 							<input
// 								type="range"
// 								value={priceRangePercentage}
// 								onChange={(e) =>
// 									handlePriceRangeChange(
// 										Number(e.target.value)
// 									)
// 								}
// 								min="1"
// 								max="20"
// 								step="1"
// 								className="w-full h-2 bg-[#8B9E93] rounded-lg appearance-none cursor-pointer mb-2"
// 							/>
// 							<div className="grid grid-cols-2 gap-2">
// 								<div className="bg-[#1B1C1B] p-2 rounded-md">
// 									<div className="text-gray-400 text-xs mb-1">
// 										Min Price
// 									</div>
// 									<input
// 										type="number"
// 										value={minPrice}
// 										onChange={(e) =>
// 											handlePriceChange(
// 												'min',
// 												Number(e.target.value)
// 											)
// 										}
// 										className="bg-transparent w-full outline-none text-sm mb-1"
// 										step="0.000001"
// 										min="0.000001"
// 										disabled
// 									/>
// 									<div className="text-xs text-gray-400">
// 										{token1 ? token1.symbol : '-'} per{' '}
// 										{token0 ? token0.symbol : '-'}
// 									</div>
// 								</div>
// 								<div className="bg-[#1B1C1B] p-2 rounded-md">
// 									<div className="text-gray-400 text-xs mb-1">
// 										Max Price
// 									</div>
// 									<input
// 										type="number"
// 										value={maxPrice}
// 										onChange={(e) =>
// 											handlePriceChange(
// 												'max',
// 												Number(e.target.value)
// 											)
// 										}
// 										className="bg-transparent w-full outline-none text-sm mb-1"
// 										step="0.000001"
// 										min="0.000001"
// 										disabled
// 									/>
// 									<div className="text-xs text-gray-400">
// 										{token1 ? token1.symbol : '-'} per{' '}
// 										{token0 ? token0.symbol : '-'}
// 									</div>
// 								</div>
// 							</div>
// 							<button
// 								onClick={handleCreatePosition}
// 								className="w-full bg-white hover:bg-gray-200 text-black text-sm rounded-md p-1 transition-colors mt-2"
// 							>
// 								Create Position
// 							</button>
// 						</div>
// 					</div>

// 					{/* Right Section - Liquidity Chart */}
// 					{!token0 || !token1 ? (
// 						<div className="w-full lg:w-3/6 bg-[#212322] rounded-lg p-3">
// 							<div className="flex items-center justify-center h-64">
// 								<p className="ml-2 text-sm">
// 									Please select a Pair
// 								</p>
// 							</div>
// 						</div>
// 					) : (
// 						<div className="w-full lg:w-3/6 bg-[#212322] rounded-lg p-3">
// 							{isLoading || !token0 || !token1 ? (
// 								<div className="flex items-center justify-center h-64">
// 									<LoadingSpinner />
// 									<p className="ml-2 text-sm">
// 										Loading Liquidity Chart
// 									</p>
// 								</div>
// 							) : (
// 								<div className="lg:col-span-3 h-full">
// 									<LiquidityChart
// 										liquidityData={liquidityData}
// 										minPrice={minPrice}
// 										maxPrice={maxPrice}
// 										currentPrice={initialPrice}
// 										token0={token0}
// 										token1={token1}
// 									/>
// 								</div>
// 							)}
// 						</div>
// 					)}
// 				</div>
// 			</main>

// 			<TokenSelectorModal
// 				isOpen={openTokenSelector}
// 				onClose={setOpenTokenSelector}
// 				onSelectToken={selectedToken == 1 ? setToken0 : setToken1}
// 				tokens={tokens}
// 				topTokens={TOP_TOKENS_SYMBOL}
// 			/>

// 			<ErrorModal
// 				isOpen={openError}
// 				onClose={setOpenError}
// 				title={errorTitle}
// 				message={errorDesc}
// 			/>

// 			{token0 && token1 && (
// 				<ILCalculator
// 					isOpen={openIlCalculator}
// 					onClose={() => setOpenIlCalculator(false)}
// 					feeRate={fee}
// 					depositAmount={depositAmount}
// 					token0={token0}
// 					token1={token1}
// 					t0Amount={depositAmounts[0] / t0CurrentPrice}
// 					t1Amount={depositAmounts[1] / t1CurrentPrice}
// 					fees={dailyFee}
// 					min={minPrice}
// 					max={maxPrice}
// 				/>
// 			)}

// 			<Footer />
// 		</div>
// 	);
// }

export default function EkuboCalculator() {
	return (
		<>
			<h1>what you doin here? {';)'}</h1>
		</>
	);
}
