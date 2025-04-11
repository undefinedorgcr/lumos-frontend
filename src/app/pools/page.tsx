// 'use client';
// import React, { useEffect, useState } from 'react';
// import Footer from '@/components/ui/footer';
// import Navbar from '@/components/ui/navbar';
// import ErrorModal from '@/components/ui/modals/ErrorModal';
// import ProtocolSelector from '@/components/ui/ProtocolSelector';
// import FeeSelector from '@/components/ui/FeeSelector';

// // Import protocol components
// import EkuboPoolsManager from '@/components/ui/pools/ekubo/EkuboPoolsManager';
// import VesuPoolsManager from '@/components/ui/pools/vesu/VesuPoolsManager';

// export default function PoolOverview() {
// 	const [selectedProtocol, setSelectedProtocol] = useState<string>('Ekubo');
// 	const [selectedFee, setSelectedFee] = useState<null | string>(null);
// 	const [openError, setOpenError] = useState(false);
// 	const [errorMessage, setErrorMessage] = useState(
// 		'Error updating favorite pools!'
// 	);

// 	const availableProtocols = ['Ekubo', 'Vesu'];

// 	const protocolFees: Record<string, string[]> = {
// 		Ekubo: ['0.01%', '0.05%', '0.30%', '1.00%'],
// 	};

// 	const handleError = (message: string) => {
// 		setErrorMessage(message);
// 		setOpenError(true);
// 	};

// 	const ekuboManager = EkuboPoolsManager({
// 		onError: () => handleError('Error processing Ekubo pools!'),
// 		selectedFee,
// 	});

// 	const vesuManager = VesuPoolsManager({
// 		onError: () => handleError('Error processing Ekubo pools!'),
// 	});

// 	useEffect(() => {
// 		setSelectedFee(null);
// 	}, [selectedProtocol]);

// 	const getActiveManager = () => {
// 		switch (selectedProtocol) {
// 			case 'Ekubo':
// 				return ekuboManager;
// 			case 'Vesu':
// 				return vesuManager;
// 			default:
// 				return ekuboManager;
// 		}
// 	};

// 	const activeManager = getActiveManager();

// 	return (
// 		<div>
// 			<Navbar />

// 			<main className="max-w-7xl mx-auto px-6 py-20">
// 				<div className="flex justify-between items-center mb-8">
// 					<h1 className="text-2xl">Pool Overview</h1>
// 				</div>

// 				<div className="space-y-6 mb-6">
// 					<div className="flex justify-between items-center">
// 						<h2 className="text-xl">Favorite Pools</h2>
// 						<div className="flex items-center gap-4">
// 							<span className="text-gray-400">
// 								Total: {activeManager.favPoolsCount} pool(s)
// 							</span>
// 						</div>
// 					</div>
// 					<ProtocolSelector
// 						protocols={availableProtocols}
// 						selectedProtocol={selectedProtocol}
// 						onSelectProtocol={setSelectedProtocol}
// 					/>
// 					{activeManager.renderFavPoolsContent()}
// 				</div>

// 				<div className="space-y-6">
// 					<div className="flex justify-between items-center">
// 						<h2 className="text-xl">Top Pools</h2>
// 						<div className="flex items-center gap-4">
// 							<span className="text-gray-400">
// 								Total: {activeManager.poolsCount} pool(s)
// 							</span>
// 						</div>
// 					</div>
// 					<ProtocolSelector
// 						protocols={availableProtocols}
// 						selectedProtocol={selectedProtocol}
// 						onSelectProtocol={setSelectedProtocol}
// 					/>
// 					{protocolFees[selectedProtocol] && (
// 						<FeeSelector
// 							fees={protocolFees[selectedProtocol]}
// 							selectedFee={selectedFee}
// 							onSelectFee={setSelectedFee}
// 						/>
// 					)}
// 					{activeManager.renderPoolsContent()}
// 				</div>
// 			</main>

// 			<Footer />
// 			<ErrorModal
// 				isOpen={openError}
// 				onClose={() => setOpenError(false)}
// 				title={'Oops!'}
// 				message={errorMessage}
// 			/>
// 		</div>
// 	);
// }
