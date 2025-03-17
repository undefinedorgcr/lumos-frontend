import React from 'react';
import { X } from 'lucide-react';
import StarField from '@/components/animations/starfield';
import Image from 'next/image';

interface InfoModalProps {
	isOpen: boolean;
	onClose: (value: boolean) => void;
	title: string;
	message: string;
}

export const InfoModal = ({
	isOpen,
	onClose,
	title,
	message,
}: InfoModalProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-[#111111]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<StarField></StarField>
			<div className="bg-[#171717] rounded-lg w-full max-w-md relative">
				<button
					onClick={() => onClose(false)}
					className="absolute right-4 top-4 text-gray-500 hover:text-gray-400 transition-colors"
				>
					<X className="w-6 h-6" />
				</button>
				<div className="p-8 flex flex-col items-center text-center">
					<div className="w-16 h-16 flex items-center justify-center mb-6">
						<Image
							src="/images/LumosLogo.png"
							width={55}
							height={55}
							alt="Lumos app logo"
						/>
					</div>
					<h2 className="text-2xl text-white font-light mb-8">
						{title}
					</h2>
					<p className="text-gray-300 text-lg font-light">
						{message}
					</p>
				</div>
			</div>
		</div>
	);
};

export default InfoModal;
