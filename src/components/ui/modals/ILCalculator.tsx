'use client';
import React, { useEffect, useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Token } from '@/types/Tokens';
import Image from 'next/image';
import { calculateDepositAmounts, fetchCryptoPrice } from '@/lib/utils';

interface ILCalculatorProps {
	isOpen: boolean;
	onClose: (value: boolean) => void;
	feeRate: number;
	depositAmount: number;
	token0: Token;
	token1: Token;
	t0Amount: number;
	t1Amount: number;
	fees: number;
	min: number;
	max: number;
}

export const ILCalculator = ({
	isOpen,
	onClose,
	depositAmount,
	token0,
	token1,
	t0Amount,
	t1Amount,
	fees,
	min,
	max,
}: ILCalculatorProps) => {
	const [daysActive, setDaysActive] = useState(0);
	const [currentPrices, setCurrentPrices] = useState({
		token0: 0,
		token1: 0,
	});
	const [futurePrices, setFuturePrices] = useState({ token0: 0, token1: 0 });
	const [holdWins, setHoldWins] = useState([0, 0]);
	const [poolWins, setPoolWins] = useState([0, 0]);

	useEffect(() => {
		async function getTokenPrices() {
			const t0Price = await fetchCryptoPrice(token0.symbol);
			const t1Price = await fetchCryptoPrice(token1.symbol);
			setCurrentPrices({ token0: t0Price, token1: t1Price });
			setFuturePrices({ token0: t0Price, token1: t1Price });
			setHoldWins([
				t0Amount * t0Price - t0Amount * t0Price,
				t1Amount * t1Price - t1Amount * t1Price,
			]);
		}
		getTokenPrices();
	}, [t0Amount, t1Amount, token0.symbol, token1.symbol]);

	if (!isOpen) return null;

	const handlePriceChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: 'current' | 'future',
		token: 'token0' | 'token1'
	) => {
		const newValue = parseFloat(e.target.value) || 0;
		if (type === 'current') {
			const newCurrentPrices = { ...currentPrices, [token]: newValue };
			setCurrentPrices(newCurrentPrices);
			const holdWin0 =
				t0Amount * futurePrices.token0 -
				t0Amount *
					(token === 'token0' ? newValue : currentPrices.token0);
			const holdWin1 =
				t1Amount * futurePrices.token1 -
				t1Amount *
					(token === 'token1' ? newValue : currentPrices.token1);
			setHoldWins([holdWin0, holdWin1]);
		} else {
			const newFuturePrices = { ...futurePrices, [token]: newValue };
			setFuturePrices(newFuturePrices);
			const holdWin0 =
				t0Amount *
					(token === 'token0' ? newValue : futurePrices.token0) -
				t0Amount * currentPrices.token0;
			const holdWin1 =
				t1Amount *
					(token === 'token1' ? newValue : futurePrices.token1) -
				t1Amount * currentPrices.token1;
			setHoldWins([holdWin0, holdWin1]);
		}
		const poolFees = fees * daysActive;
		const poolWinsAmounts = calculateDepositAmounts(
			min,
			max,
			futurePrices.token0 / futurePrices.token1,
			poolFees
		);
		setPoolWins(poolWinsAmounts);
	};

	const handleDaysChange = (value: number) => {
		const newValue = value;
		setDaysActive(newValue);
		const poolFees = fees * newValue;
		const poolWinsAmounts = calculateDepositAmounts(
			min,
			max,
			futurePrices.token1 / futurePrices.token0,
			poolFees
		);
		setPoolWins(poolWinsAmounts);
	};

	return (
		<div className="fixed inset-0 bg-[#111111]/50 backdrop-blur-sm flex items-center justify-center p-2 z-50">
			<div className="bg-[#111111] rounded-lg w-full max-w-md relative border border-zinc-800 p-3">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-medium text-white">
						Impermanent Loss Calculator
					</h2>
					<button
						onClick={() => onClose(false)}
						className="text-gray-500 hover:text-gray-400 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
				<div
					className={
						poolWins[0] + poolWins[1] < holdWins[1] + holdWins[0]
							? 'bg-zinc-900/50 rounded-lg p-3 mb-2 border border-green-500'
							: 'bg-zinc-900/50 rounded-lg p-3 mb-2'
					}
				>
					<div className="flex justify-between items-center mb-2">
						<div className="bg-zinc-800 rounded-full px-2 py-1 text-xs">
							Strategy A: HODL
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-green-500">
								{((holdWins[0] + holdWins[1]) * 100) /
									depositAmount >=
								0
									? '+'
									: ''}
								{(
									((holdWins[0] + holdWins[1]) * 100) /
									depositAmount
								).toFixed(2)}
								%
							</span>
							<span>
								${(holdWins[0] + holdWins[1]).toFixed(2)}
							</span>
						</div>
					</div>
					{[token0, token1].map((token, i) => (
						<div
							key={i}
							className="flex justify-between bg-zinc-800/50 rounded-lg p-2 text-sm"
						>
							<div className="flex items-center gap-2">
								<Image
									src={token.logo_url}
									width={20}
									height={20}
									alt={token.symbol}
									className="rounded-full"
								/>
								<span>{token.symbol}</span>
							</div>
							<div className="text-gray-400 flex gap-3">
								<span>
									{i == 0
										? (
												holdWins[i] /
												futurePrices.token0
											).toFixed(2)
										: (
												holdWins[i] /
												futurePrices.token1
											).toFixed(2)}
								</span>
								<span>${holdWins[i].toFixed(2)}</span>
							</div>
						</div>
					))}
				</div>

				<div
					className={
						poolWins[0] + poolWins[1] > holdWins[1] + holdWins[0]
							? 'bg-zinc-900/50 rounded-lg p-3 mb-2 border border-green-500'
							: 'bg-zinc-900/50 rounded-lg p-3 mb-2'
					}
				>
					<div className="flex justify-between items-center mb-2">
						<div className="bg-zinc-800 rounded-full px-2 py-1 text-xs">
							Strategy B: EKUBO
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-green-500">
								{((poolWins[0] + poolWins[1]) * 100) /
									depositAmount >=
								0
									? '+'
									: ''}
								{(
									((poolWins[0] + poolWins[1]) * 100) /
									depositAmount
								).toFixed(2)}
								%
							</span>
							<span>
								${(poolWins[0] + poolWins[1]).toFixed(2)}
							</span>
						</div>
					</div>
					{[token0, token1].map((token, i) => (
						<div
							key={i}
							className="flex justify-between bg-zinc-800/50 rounded-lg p-2 text-sm"
						>
							<div className="flex items-center gap-2">
								<Image
									src={token.logo_url}
									width={20}
									height={20}
									alt={token.symbol}
									className="rounded-full"
								/>
								<span>{token.symbol}</span>
							</div>
							<div className="text-gray-400 flex gap-3">
								<span>
									{i == 0
										? (
												poolWins[i] /
												futurePrices.token0
											).toFixed(2)
										: (
												poolWins[i] /
												futurePrices.token1
											).toFixed(2)}
								</span>
								<span>${poolWins[i].toFixed(2)}</span>
							</div>
						</div>
					))}
				</div>
				<div className="grid grid-cols-2 gap-2 mb-2 text-sm">
					{[
						{
							title: 'Current Price',
							prices: currentPrices,
							type: 'current',
						},
						{
							title: 'Future Price',
							prices: futurePrices,
							type: 'future',
						},
					].map(({ title, prices, type }, index) => (
						<div
							key={index}
							className="bg-zinc-900/50 rounded-lg p-3"
						>
							<h3 className="text-gray-400 mb-2">{title}</h3>
							{[token0, token1].map((token, i) => (
								<div key={i} className="mb-1">
									<div className="text-gray-400">
										{token.symbol} Price (USD)
									</div>
									<input
										type="number"
										step="0.0001"
										value={
											prices[
												i === 0 ? 'token0' : 'token1'
											]
										}
										onChange={(e) =>
											handlePriceChange(
												e,
												type as 'current' | 'future',
												i === 0 ? 'token0' : 'token1'
											)
										}
										className="bg-zinc-800 text-white rounded-md p-1 w-full text-sm text-center"
									/>
								</div>
							))}
						</div>
					))}
				</div>
				<div className="bg-zinc-900/50 rounded-lg p-3 flex flex-col items-center text-sm">
					<div className="flex justify-between items-center w-full">
						<button
							onClick={() => handleDaysChange(daysActive - 1)}
							className="text-gray-400 hover:text-white"
						>
							<Minus className="w-5 h-5" />
						</button>
						<input
							type="number"
							min="0"
							value={daysActive}
							onChange={(e) =>
								handleDaysChange(Number(e.target.value))
							}
							className="bg-zinc-800 text-white rounded-md p-1 w-16 text-center"
						/>
						<button
							onClick={() => handleDaysChange(daysActive + 1)}
							className="text-gray-400 hover:text-white"
						>
							<Plus className="w-5 h-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ILCalculator;
