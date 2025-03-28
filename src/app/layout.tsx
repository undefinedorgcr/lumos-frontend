import type { Metadata } from 'next';
import './globals.css';
import ChatWidget from '@/components/ui/modals/ChatWidget';
import TestNetworkBanner from '@/components/ui/TestNetworkBanner';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
	title: 'Lumos',
	description: 'Liquidity pool management dapp',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-[#141514] font-body text-white min-h-screen tracking-widest">
				<TestNetworkBanner>
					<div className="p-6">
						{children}
						<ChatWidget />
						<Analytics />
					</div>
				</TestNetworkBanner>
			</body>
		</html>
	);
}
