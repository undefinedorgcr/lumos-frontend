'use client';
import React, { useEffect, useState } from 'react';
import Footer from '@/components/ui/footer';
import Navbar from '@/components/ui/navbar';
import ErrorModal from '@/components/ui/modals/ErrorModal';
import ProtocolSelector from '@/components/ui/ProtocolSelector';
import FeeSelector from '@/components/ui/FeeSelector';

// Import protocol components
import EkuboPoolsManager from '@/components/ui/EkuboPoolsManager';

export default function PoolOverview() {
	const [selectedProtocol, setSelectedProtocol] = useState<string>('Ekubo');
	const [selectedFee, setSelectedFee] = useState<null | string>(null);
	const [openError, setOpenError] = useState(false);

	const availableProtocols = ['Ekubo'];

	const protocolFees: Record<string, string[]> = {
		Ekubo: ['0.01%', '0.05%', '0.30%', '1.00%'],
	};

	// Obtener los componentes y datos necesarios del administrador de pools
	const ekuboManager = EkuboPoolsManager({
		onError: setOpenError,
		selectedFee,
	});

	useEffect(() => {
		if (selectedProtocol !== 'Ekubo') {
			setSelectedFee(null);
		}
	}, [selectedProtocol]);

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
								Total: {ekuboManager.favPoolsCount} pool(s)
							</span>
						</div>
					</div>
					<ProtocolSelector
						protocols={availableProtocols}
						selectedProtocol={selectedProtocol}
						onSelectProtocol={setSelectedProtocol}
					/>
					{/* Renderizar el componente de pools favoritos */}
					{ekuboManager.renderFavPoolsContent()}
				</div>

				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-xl">Top Pools</h2>
						<div className="flex items-center gap-4">
							<span className="text-gray-400">
								Total: {ekuboManager.poolsCount} pool(s)
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
					{/* Renderizar el componente de todos los pools */}
					{ekuboManager.renderPoolsContent()}
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
