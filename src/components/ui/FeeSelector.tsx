import React from 'react';

interface FeeSelectorProps {
	fees: string[];
	selectedFee: string | null;
	onSelectFee: (fee: string | null) => void;
}

export default function FeeSelector({
	fees,
	selectedFee,
	onSelectFee,
}: FeeSelectorProps) {
	return (
		<div className="flex gap-2">
			{fees.map((fee) => (
				<button
					key={fee}
					className={`px-4 py-2 rounded-lg transition-colors border ${
						selectedFee === fee
							? 'bg-white/20 text-white border border-white'
							: 'bg-white/5 hover:bg-white/10 border-white/5'
					}`}
					onClick={() =>
						onSelectFee(selectedFee === fee ? null : fee)
					}
				>
					{fee}
				</button>
			))}
		</div>
	);
}
