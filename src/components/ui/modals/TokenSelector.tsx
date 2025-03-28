/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Token } from '@/types/Tokens';
import Image from 'next/image';

interface TokenSelectorProps {
	isOpen: any;
	onClose: any;
	onSelectToken: any;
	tokens: Token[];
	topTokens: Array<string>;
}

export const TokenSelectorModal = ({
	isOpen,
	onClose,
	onSelectToken,
	tokens,
	topTokens,
}: TokenSelectorProps) => {
	// const [searchQuery, setSearchQuery] = useState('');
	const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);

	// function filter(psearchQuery: string) {
	//     setSearchQuery(psearchQuery);
	//     setFilteredTokens(tokens.filter(token =>
	//         token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
	//         token.name.toLowerCase().includes(searchQuery.toLowerCase())
	//     ));
	// }

	useEffect(() => {
		setFilteredTokens(
			tokens.filter((token) => topTokens.includes(token.symbol))
		);
		onSelectToken(undefined);
	}, [onSelectToken, tokens, topTokens]);

	function handleClose() {
		onClose(false);
	}

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-zinc-900 rounded-2xl w-full max-w-md">
				<div className="p-4 border-b border-zinc-800 flex justify-between items-center">
					<h2 className="text-xl text-white ">Select a token</h2>
					<button
						onClick={handleClose}
						className="text-zinc-400 hover:text-white transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>
				{/* TODO: re-enable token search once all tokens are explored */}
				{/* <div className="p-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or paste address"
                            value={searchQuery}
                            onChange={(e) => filter(e.target.value)}
                            className="w-full bg-zinc-800 text-white rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                    </div>
                </div> */}

				<div className="p-4 border-t border-zinc-800">
					<h3 className="text-zinc-400 text-sm mb-2">
						Popular tokens
					</h3>
					<div className="space-y-2 max-h-64 overflow-y-auto">
						{filteredTokens.map((token) => (
							<button
								key={token.symbol}
								onClick={() => {
									onSelectToken(token);
									onClose(false);
								}}
								className="w-full flex items-center p-3 hover:bg-zinc-800 rounded-lg transition-colors"
							>
								<Image
									className="p-1"
									src={token.logo_url}
									alt={'Ekubo logo'}
									width={25}
									height={25}
								/>
								<div className="flex flex-col items-start">
									<span className="text-white ">
										{token.symbol}
									</span>
								</div>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
