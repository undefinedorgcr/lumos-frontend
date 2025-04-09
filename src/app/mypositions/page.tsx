// 'use client';

// import Footer from '@/components/ui/footer';
// import Navbar from '@/components/ui/navbar';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import { EkuboPosition } from '@/types/Position';
// import { fetchPosition } from '@/app/api/ekuboApi';
// import { useAtomValue } from 'jotai';
// import { walletStarknetkitLatestAtom } from '@/state/connectedWallet';
// import EkuboPositionTable from '@/components/ui/EkuboPositionsTable';
// import { getEarnPositions } from '../api/vesuApi';
// import { VesuEarnPosition } from '@/types/VesuPositions';
// import VesuPositionTable from '@/components/ui/VesuPositionsTable';

// export default function MyPositions() {
// 	const protocols = ['Ekubo', 'Vesu'];
// 	const [protocol, setProtocol] = useState('Ekubo');
// 	const [ekuboPositions, setEkuboPositions] = useState<
// 		EkuboPosition[] | undefined
// 	>(undefined);
// 	const [vesuPositions, setVesuPositions] = useState<
// 		VesuEarnPosition[] | undefined
// 	>(undefined);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const wallet = useAtomValue(walletStarknetkitLatestAtom);

// 	useEffect(() => {
// 		async function getPositions() {
// 			setIsLoading(true);
// 			try {
// 				const data = await fetchPosition(wallet?.account?.address);
// 				setEkuboPositions(data);
// 				setVesuPositions(
// 					await getEarnPositions(wallet?.account?.address)
// 				);
// 			} catch (err) {
// 				console.error(err);
// 				setEkuboPositions(undefined);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		}
// 		getPositions();
// 	}, [wallet?.account?.address]);

// 	async function handleProtocolChange(protocol: string) {
// 		if (protocol == 'Vesu') {
// 			if (vesuPositions == undefined) {
// 				setVesuPositions(
// 					await getEarnPositions(wallet?.account?.address)
// 				);
// 			}
// 		}
// 		setProtocol(protocol);
// 	}

// 	async function refreshVesuPositions() {
// 		setIsLoading(true);
// 		setVesuPositions(await getEarnPositions(wallet?.account?.address));
// 		setIsLoading(false);
// 	}

// 	return (
// 		<div>
// 			<Navbar />

// 			<main className="max-w-7xl mx-auto px-6 py-20">
// 				<div className="space-y-8">
// 					<div className="space-y-4">
// 						<header className="flex justify-between items-center">
// 							<h1 className="text-3xl ">My Positions</h1>
// 						</header>
// 						<p className="text-gray-400">
// 							Manage your liquidity positions across protocols
// 						</p>
// 					</div>

// 					<div className="flex gap-4">
// 						{protocols.map((p) => (
// 							<button
// 								key={p}
// 								onClick={() => handleProtocolChange(p)}
// 								className={`
//                   flex items-center gap-3 px-6 py-3 rounded-full transition-all
//                   ${
// 						protocol === p
// 							? 'bg-white/10 ring-1 ring-white/20 shadow-lg'
// 							: 'bg-white/5 hover:bg-white/10'
// 					}
//                 `}
// 							>
// 								<Image
// 									src={`/images/${p}Logo.png`}
// 									width={24}
// 									height={24}
// 									alt={`${p} logo`}
// 									className="pointer-events-none"
// 								/>
// 								<span className="">{p}</span>
// 							</button>
// 						))}
// 					</div>

// 					{protocol == 'Ekubo' && (
// 						<EkuboPositionTable
// 							positions={ekuboPositions}
// 							isLoading={isLoading}
// 							isWalletConnected={!!wallet}
// 						/>
// 					)}

// 					{protocol == 'Vesu' && (
// 						<VesuPositionTable
// 							earnPositions={vesuPositions}
// 							borrowPositions={[]}
// 							isLoading={isLoading}
// 							isWalletConnected={!!wallet}
// 							onRefresh={refreshVesuPositions}
// 						/>
// 					)}
// 				</div>
// 			</main>

// 			<Footer />
// 		</div>
// 	);
// }

export default function MyPositions() {
	return (
		<>
			<h1>what you doin here? {';)'}</h1>
		</>
	);
}
