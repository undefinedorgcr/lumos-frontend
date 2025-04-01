/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBestVesuPool, getVesuTokens } from '@/app/api/vesuApi';
import { getNodeUrl, getProvider } from '@/constants';
import { fetchCryptoPrice } from '@/lib/utils';
import { walletStarknetkitLatestAtom } from '@/state/connectedWallet';
import { ProcessedAsset, VesuPool } from '@/types/VesuPools';
import { useAtomValue } from 'jotai';
import { X, ArrowRight, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CallData, cairo } from 'starknet';

interface CreatePositionModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type TokenOption = {
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	price?: number; // Added price field
};

type TransactionStatus = 'idle' | 'loading' | 'success' | 'error';

export const CreatePositionModal = ({
	isOpen,
	onClose,
}: CreatePositionModalProps) => {
	const [usdAmount, setUsdAmount] = useState<string>('');
	const [selectedToken, setSelectedToken] = useState<string>('');
	const [selectedPool, setSelectedPool] = useState<VesuPool | undefined>(undefined);
	const [tokenOptions, setTokenOptions] = useState<TokenOption[]>([]);
	const [isLoadingPool, setIsLoadingPool] = useState<boolean>(true);
	const [currentAsset, setCurrentAsset] = useState<ProcessedAsset | undefined>(undefined);
	const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');
	const [transactionMessage, setTransactionMessage] = useState<string>('');
	const [tokenAmount, setTokenAmount] = useState<string>('0');
	const [tokenPrice, setTokenPrice] = useState<number>(0);

	const wallet = useAtomValue(walletStarknetkitLatestAtom);
	const node_url = getNodeUrl(wallet?.chainId);
	const provider = getProvider(node_url);

	useEffect(() => {
		async function fetchTokens() {
			const tokens = await getVesuTokens();
			const tokenPrice = await fetchCryptoPrice(tokens[0].symbol)
			setTokenOptions(tokens);
			setSelectedToken(tokens[0].symbol);
			setTokenPrice(tokenPrice || 0);
			setIsLoadingPool(true);
			const bestPool = await getBestVesuPool(tokens[0].symbol);
			setSelectedPool(bestPool);
			if (bestPool) {
				setCurrentAsset(
					bestPool.assets.find(
						(asset: any) => asset.symbol === tokens[0].symbol
					)
				);
			}
			setIsLoadingPool(false);
		}
		fetchTokens();
	}, []);

	useEffect(() => {
		if (tokenPrice && usdAmount) {
			const calculatedAmount = (Number(usdAmount) / tokenPrice).toFixed(6);
			setTokenAmount(calculatedAmount);
		} else {
			setTokenAmount('0');
		}
	}, [usdAmount, tokenPrice]);

	async function handleTokenChange(token: string) {
		setSelectedToken(token);
		const tokenPrice = await fetchCryptoPrice(token)
		setTokenPrice(tokenPrice || 0);
		
		setIsLoadingPool(true);
		const bestPool = await getBestVesuPool(token);
		if (bestPool) {
			setCurrentAsset(
				bestPool.assets.find((asset: any) => asset.symbol === token)
			);
		}
		setSelectedPool(bestPool);
		setIsLoadingPool(false);
	}

	const waitForTransaction = async (hash: string) => {
		try {
			await provider.waitForTransaction(hash);
			return true;
		} catch (error) {
			console.error('Error waiting for transaction:', error);
			return false;
		}
	};

	async function handleConfirm() {
		if (!currentAsset) return;

		setTransactionStatus('loading');
		setTransactionMessage('Creating position...');

		try {
			let amount = Number(Math.floor(Number(tokenAmount) * 10 ** 18));
			let feeAmount = Number(amount) * 0.05;
			if((feeAmount/10**18) * tokenPrice > 5) {
				feeAmount = Math.floor((5 / tokenPrice) * 10 ** 18);
			}
			amount = amount - feeAmount;
			const tx = await wallet?.account.execute([
				{
					contractAddress: currentAsset?.address,
					entrypoint: 'approve',
					calldata: CallData.compile({
						spender: wallet.account.address,
						amount: cairo.uint256(feeAmount)
					}),
				},
				{
					contractAddress: currentAsset?.address,
					entrypoint: 'transfer',
					calldata: CallData.compile({
						recipient: process.env.NEXT_PUBLIC_RECEIVER_ADDR || "",
						amount: cairo.uint256(feeAmount)
					}),
				},
				{
					contractAddress: currentAsset?.address,
					entrypoint: 'approve',
					calldata: CallData.compile({
						spender: currentAsset?.vTokenAddress,
						amount: cairo.uint256(amount),
					}),
				},
				{
					contractAddress: currentAsset?.vTokenAddress,
					entrypoint: 'deposit',
					calldata: CallData.compile({
						assets: cairo.uint256(amount),
						receiver: wallet.account.address,
					}),
				},
			]);

			if (tx) {
				const isConfirmed = await waitForTransaction(tx.transaction_hash);

				if (isConfirmed) {
					setTransactionStatus('success');
					setTransactionMessage('Position created successfully!');

					setTimeout(() => {
						onClose();
						setTransactionStatus('idle');
						setTransactionMessage('');
					}, 2000);
				} else {
					setTransactionStatus('error');
					setTransactionMessage('Transaction failed to confirm. Please try again.');
				}
			}
		} catch (error: any) {
			setTransactionStatus('error');
			setTransactionMessage(error.message || 'Error creating position. Please try again.');
		}
	}

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="absolute inset-0 backdrop-blur-sm" onClick={onClose}></div>

			<div className="relative bg-[#212322] rounded-xl p-5 w-full max-w-md z-10">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 text-gray-500 hover:text-gray-400 transition-colors"
					disabled={transactionStatus === 'loading'}
				>
					<X className="w-5 h-5" />
				</button>

				<div className="space-y-4">
					<h2 className="text-xl text-white">Create Position</h2>
					
					<div>
						<label className="block text-sm text-gray-400 mb-1">Pool</label>
						<div className="bg-[#1B1C1B] rounded-lg px-3 py-2 text-white">
							{isLoadingPool ? 'Loading...' : selectedPool ? selectedPool.name : 'No pool found'}
						</div>
					</div>

					<div>
						<label className="block text-sm text-gray-400 mb-1">Deposit Amount (USD)</label>
						<div className="flex items-center gap-2 mb-1">
							<div className="flex-1 relative">
								<span className="absolute left-3 top-2 text-gray-400">$</span>
								<input
									type="number"
									value={usdAmount}
									onChange={(e) => setUsdAmount(e.target.value)}
									className="w-full bg-[#1B1C1B] rounded-lg pl-7 pr-3 py-2 text-white focus:outline-none"
									placeholder="0"
									min="0"
									step="0.01"
									disabled={transactionStatus === 'loading'}
								/>
							</div>

							<select
								value={selectedToken}
								onChange={(e) => handleTokenChange(e.target.value)}
								className="bg-[#1B1C1B] text-white rounded-lg px-3 py-2"
								disabled={transactionStatus === 'loading'}
							>
								{tokenOptions.map((token) => (
									<option key={token.address} value={token.symbol}>
										{token.symbol}
									</option>
								))}
							</select>
						</div>
						
						<div className="text-sm text-gray-400 mb-2">
							≈ {tokenAmount} {selectedToken} 
							{tokenPrice ? ` (1 ${selectedToken} = $${tokenPrice})` : ''}
						</div>
						
						<p className="text-xs text-[#8B9E93] mb-2">
							A 0.5% platform fee will be deducted from your position with a max of $5
						</p>
					</div>

					<div>
						<div className="flex justify-between mb-1">
							<span className="text-sm text-gray-400">Returns</span>
							<div className="flex space-x-2 text-xs">
								{isLoadingPool ? (
									<span className="text-gray-400 animate-pulse">Calculating returns...</span>
								) : (
									<>
										<span className="text-gray-400">Fee APY: {currentAsset?.apy.toFixed(2)}%</span>
										<span className="text-gray-400">DeFi Spring: {currentAsset?.defiSpringApy.toFixed(2)}%</span>
									</>
								)}
							</div>
						</div>
						
						<div className="grid grid-cols-3 gap-2 mb-2">
							<div className="bg-[#1B1C1B] rounded-lg p-2 text-center">
								<p className="text-xs text-gray-400">Daily</p>
								{isLoadingPool ? (
									<p className="text-green-400 text-sm animate-pulse">Calculating...</p>
								) : (
									<p className="text-green-400 text-sm">
										${currentAsset && usdAmount
											? ((Number(usdAmount) * ((currentAsset.apy + currentAsset.defiSpringApy) / 100)) / 365).toFixed(2)
											: '0.00'}
									</p>
								)}
							</div>
							<div className="bg-[#1B1C1B] rounded-lg p-2 text-center">
								<p className="text-xs text-gray-400">Monthly</p>
								{isLoadingPool ? (
									<p className="text-green-400 text-sm animate-pulse">Calculating...</p>
								) : (
									<p className="text-green-400 text-sm">
										${currentAsset && usdAmount
											? ((Number(usdAmount) * ((currentAsset.apy + currentAsset.defiSpringApy) / 100)) / 12).toFixed(2)
											: '0.00'}
									</p>
								)}
							</div>
							<div className="bg-[#1B1C1B] rounded-lg p-2 text-center">
								<p className="text-xs text-gray-400">Yearly</p>
								{isLoadingPool ? (
									<p className="text-green-400 text-sm animate-pulse">Calculating...</p>
								) : (
									<p className="text-green-400 text-sm">
										${currentAsset && usdAmount
											? (Number(usdAmount) * ((currentAsset.apy + currentAsset.defiSpringApy) / 100)).toFixed(2)
											: '0.00'}
									</p>
								)}
							</div>
						</div>
					</div>

					{transactionStatus !== 'idle' && (
						<div className={`py-2 flex items-center justify-center space-x-2 
							${transactionStatus === 'loading' ? 'text-white' : 
							transactionStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
							{transactionStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
							{transactionStatus === 'success' && <CheckCircle className="w-4 h-4" />}
							{transactionStatus === 'error' && <AlertTriangle className="w-4 h-4" />}
							<span className="text-sm">{transactionMessage}</span>
						</div>
					)}

					<button
						onClick={handleConfirm}
						disabled={transactionStatus === 'loading' || !usdAmount || Number(usdAmount) <= 0}
						className={`w-full flex items-center justify-center space-x-2 border border-[#F0FFF6] text-white py-2 px-4 rounded-lg transition-all duration-500 ${
							transactionStatus === 'loading' || !usdAmount || Number(usdAmount) <= 0
								? 'opacity-50 cursor-not-allowed'
								: 'hover:text-black hover:bg-[#F0FFF6]'
						}`}
					>
						<span>Create Position</span>
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
};
