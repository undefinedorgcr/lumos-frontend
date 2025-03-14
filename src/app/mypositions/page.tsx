'use client';

import Footer from '@/components/ui/footer';
import Navbar from '@/components/ui/navbar';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { EkuboPosition, VesuPosition } from '@/types/Position';
import { fetchPosition } from '@/app/api/ekuboApi';
import { useAtomValue } from 'jotai';
import { walletStarknetkitLatestAtom } from '@/state/connectedWallet';
import EkuboPositionTable from '@/components/ui/EkuboPositionsTable';

export default function MyPositions() {
	const protocols = ['Ekubo', 'Vesu'];
	const [protocol, setProtocol] = useState('Ekubo');
	const [ekuboPositions, setEkuboPositions] = useState<
		EkuboPosition[] | undefined
	>(undefined);
	const [vesuPositions, setVesuPositions] = useState<
		VesuPosition[] | undefined
	>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const wallet = useAtomValue(walletStarknetkitLatestAtom);

	useEffect(() => {
		async function getPositions() {
			setIsLoading(true);
			try {
				const data = await fetchPosition(wallet?.account?.address);
				setEkuboPositions(data);
			} catch (err) {
				console.error(err);
				setEkuboPositions(undefined);
			} finally {
				setIsLoading(false);
			}
		}
		getPositions();
	}, [wallet?.account?.address]);

	function handleProtocolChange(protocol: string) {
		if (protocol == 'Vesu') {
			if (vesuPositions == undefined) {
				setVesuPositions([
					{
						pool: 'Genesis',
						type: 'Earn',
						collateral: 'STRK',
						total_supplied: 200,
					},
					{
						pool: 'Genesis',
						type: 'Earn',
						collateral: 'STRK',
						total_supplied: 200,
					},
					{
						pool: 'Genesis',
						type: 'Earn',
						collateral: 'STRK',
						total_supplied: 200,
					},
				]);
			}
		}
		setProtocol(protocol);
	}

	return (
		<div>
			<Navbar />

			<main className="max-w-7xl mx-auto px-6 py-12">
				<div className="space-y-8">
					<div className="space-y-4">
						<header className="flex justify-between items-center">
							<h1 className="text-3xl font-light">
								My Positions
							</h1>
						</header>
						<p className="text-gray-400">
							Manage your liquidity positions across protocols
						</p>
					</div>

					<div className="flex gap-4">
						{protocols.map((p) => (
							<button
								key={p}
								onClick={() => handleProtocolChange(p)}
								className={`
                  flex items-center gap-3 px-6 py-3 rounded-full transition-all
                  ${
						protocol === p
							? 'bg-white/10 ring-1 ring-white/20 shadow-lg'
							: 'bg-white/5 hover:bg-white/10'
					}
                `}
							>
								<Image
									src={`/images/${p}Logo.png`}
									width={24}
									height={24}
									alt={`${p} logo`}
									className="pointer-events-none"
								/>
								<span className="font-light">{p}</span>
							</button>
						))}
					</div>

					{protocol == 'Ekubo' && (
						<EkuboPositionTable
							positions={ekuboPositions}
							isLoading={isLoading}
							isWalletConnected={!!wallet}
						/>
					)}

					{/* {protocol == "Vesu" &&
            <VesuPositionTable
              positions={vesuPositions}
              isLoading={false}
              isWalletConnected={!!wallet}
            />
          } */}
				</div>
			</main>

			<Footer />
		</div>
	);
}
