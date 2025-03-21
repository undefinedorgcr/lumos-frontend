// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import ChatWidget from '@/components/ui/modals/ChatWidget';
import TestNetworkBanner from '@/components/ui/TestNetworkBanner';

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
			<body className="bg-[#101010] text-white min-h-screen">
				<TestNetworkBanner>
					<div className="p-6">
						{children}
						<ChatWidget />
					</div>
				</TestNetworkBanner>
			</body>
		</html>
	);
}
