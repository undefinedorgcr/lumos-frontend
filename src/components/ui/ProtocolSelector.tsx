import React from 'react';
import Image from 'next/image';

interface ProtocolSelectorProps {
	protocols: string[];
	selectedProtocol: string;
	onSelectProtocol: (protocol: string) => void;
}

export default function ProtocolSelector({
	protocols,
	selectedProtocol,
	onSelectProtocol,
}: ProtocolSelectorProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{protocols.map((protocol) => (
				<button
					key={protocol}
					className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
						selectedProtocol === protocol
							? 'bg-white/20 border border-white text-white'
							: 'bg-white/5 hover:bg-white/10 border border-white/5'
					}`}
					onClick={() => onSelectProtocol(protocol)}
				>
					<Image
						src={`/images/${protocol}Logo.png`}
						width={20}
						height={20}
						alt={`${protocol} logo`}
					/>
					{protocol}
				</button>
			))}
		</div>
	);
}
