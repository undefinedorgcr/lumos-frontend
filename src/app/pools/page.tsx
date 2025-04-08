'use client';
import React, { useEffect, useState } from 'react';
import Footer from '@/components/ui/footer';
import Navbar from '@/components/ui/navbar';
import ErrorModal from '@/components/ui/modals/ErrorModal';
import { ProtocolInterface } from '@/types/ProtocolInterface';
import ProtocolSelector from '@/components/ui/ProtocolSelector';
import FeeSelector from '@/components/ui/FeeSelector';

// Import protocol components
import EkuboPoolsComponent from '@/components/ui/EkuboPools';
// import UniswapPoolsComponent from '@/components/protocols/UniswapPoolsComponent';
// import SushiSwapPoolsComponent from '@/components/protocols/SushiSwapPoolsComponent';

export default function PoolOverview() {
	const [selectedProtocol, setSelectedProtocol] = useState<string>('Ekubo');
	const [selectedFee, setSelectedFee] = useState<null | string>(null);
	const [openError, setOpenError] = useState(false);

	// Define the available protocols
	const availableProtocols = ['Ekubo']; // Add more as you implement them: 'Uniswap', 'SushiSwap', etc.

	// Define the protocol-specific fee options
	const protocolFees: Record<string, string[]> = {
		Ekubo: ['0.01%', '0.05%', '0.30%', '1.00%'],
		// 'Uniswap': ['0.05%', '0.30%', '1.00%'],
		// 'SushiSwap': ['0.05%', '0.30%', '1.00%'],
	};

	// Use the protocol components based on the selected protocol
	const getProtocolComponent = (): ProtocolInterface => {
		switch (selectedProtocol) {
			case 'Ekubo':
				return EkuboPoolsComponent({
					onError: setOpenError,
					selectedFee,
				});
			// case 'Uniswap':
			//   return UniswapPoolsComponent({ onError: setOpenError, selectedFee });
			// case 'SushiSwap':
			//   return SushiSwapPoolsComponent({ onError: setOpenError, selectedFee });
			default:
				return EkuboPoolsComponent({
					onError: setOpenError,
					selectedFee,
				});
		}
	};

	useEffect(() => {
		if (selectedProtocol !== 'Ekubo') {
			setSelectedFee(null);
		}
	}, [selectedProtocol]);

	const protocolComponent = getProtocolComponent();

	return (
		<div>
			<Navbar />

			<main className="max-w-7xl mx-auto px-6 py-20">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-2xl">Pool Overview</h1>
				</div>

				<div className="space-y-6 mb-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl">Favorite Pools</h2>
						<div className="flex items-center gap-4">
							<span className="text-gray-400">
								Total: {protocolComponent.favPoolsCount} pool(s)
							</span>
						</div>
					</div>
					<ProtocolSelector
						protocols={availableProtocols}
						selectedProtocol={selectedProtocol}
						onSelectProtocol={setSelectedProtocol}
					/>
					{protocolComponent.renderFavPoolsContent()}
				</div>

				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl">Top Pools</h2>
						<div className="flex items-center gap-4">
							<span className="text-gray-400">
								Total: {protocolComponent.poolsCount} pool(s)
							</span>
						</div>
					</div>
					<ProtocolSelector
						protocols={availableProtocols}
						selectedProtocol={selectedProtocol}
						onSelectProtocol={setSelectedProtocol}
					/>
					{selectedProtocol === 'Ekubo' && (
						<FeeSelector
							fees={protocolFees[selectedProtocol] || []}
							selectedFee={selectedFee}
							onSelectFee={setSelectedFee}
						/>
					)}
					{protocolComponent.renderPoolsContent()}
				</div>
			</main>

			<Footer />
			<ErrorModal
				isOpen={openError}
				onClose={setOpenError}
				title={'Oops!'}
				message={'Error updating favorite pools!'}
			/>
		</div>
	);
}
