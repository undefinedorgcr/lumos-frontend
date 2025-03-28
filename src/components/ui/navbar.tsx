'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from './modals/LoginModal';
import { activeUser } from '@/state/user';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useAtom } from 'jotai';
import { Menu, X } from 'lucide-react';
import WalletConnector from './connectWallet';

export default function Navbar() {
	const [openLogin, setOpenLogin] = useState<boolean>(false);
	const [user, setUser] = useAtom(activeUser);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const handleLogout = async () => {
		await signOut(auth);
		setUser(undefined);
		setIsMenuOpen(false);
	};

	return (
		<>
			<button
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				className="md:hidden fixed top-6 left-6 z-50 p-2 rounded-sm bg-white/5 hover:bg-white/10 transition-all ring-1 ring-white/20"
			>
				{isMenuOpen ? (
					<X className="w-5 h-5" />
				) : (
					<Menu className="w-5 h-5" />
				)}
			</button>

			{isMenuOpen && (
				<div
					className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
					onClick={() => setIsMenuOpen(false)}
				/>
			)}
			<div
				className={`md:hidden fixed top-0 left-0 h-full w-64 bg-black/90 backdrop-blur-sm border-r border-white/20 transform transition-transform duration-300 ease-in-out z-40 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
			>
				<div className="flex flex-col h-full p-6">
					<div className="mt-14 mb-8">
						<Link href="/" onClick={() => setIsMenuOpen(false)}>
							<Image
								src="/images/LumosLogo.png"
								width={45}
								height={45}
								alt="Lumos app logo"
								className="transition duration-500 hover:scale-110 opacity-75 hover:opacity-100"
							/>
						</Link>
					</div>
					<div className="flex flex-col gap-4">
						<Link
							href="/calculators"
							className="text-gray-400 hover:text-white transition-colors duration-300"
							onClick={() => setIsMenuOpen(false)}
						>
							Calculators
						</Link>
						<Link
							href="/mypositions"
							className="text-gray-400 hover:text-white transition-colors duration-300"
							onClick={() => setIsMenuOpen(false)}
						>
							My positions
						</Link>
						<Link
							href="/pools"
							className="text-gray-400 hover:text-white transition-colors duration-300"
							onClick={() => setIsMenuOpen(false)}
						>
							Pools
						</Link>
					</div>
					<div className="mt-auto">
						{user !== undefined ? (
							<div className="flex flex-col gap-4">
								{user.pfp && (
									<Link
										href="/profile"
										className="text-gray-400 hover:text-white transition-colors duration-300"
										onClick={() => setIsMenuOpen(false)}
									>
										<Image
											src={user.pfp}
											alt="User Profile"
											width={40}
											height={40}
											className="rounded-full object-cover ring-1 ring-white/20"
										/>
									</Link>
								)}
								<button
									className="w-full px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 
                                    transition-all duration-300 text-base ring-1 ring-white/20"
									onClick={() => handleLogout()}
								>
									Logout
								</button>
							</div>
						) : (
							<button
								className="w-full px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 
                                transition-all duration-300 text-base ring-1 ring-white/20"
								onClick={() => {
									setIsMenuOpen(false);
									setOpenLogin(true);
								}}
							>
								Login
							</button>
						)}
					</div>
					<div className="flex justify-center mt-4">
						<WalletConnector />
					</div>
				</div>
			</div>
			{/* Desktop Navigation */}
			<nav className="hidden md:flex fixed top-0 left-0 right-0 backdrop-blur-sm z-40 px-6 py-8 items-center justify-center font-bodyRegular">
				<Link
					href="/"
					className="absolute left-6 flex items-center transition duration-500 hover:scale-110 opacity-75 hover:opacity-100 mr-2"
				>
					<Image
						src="/images/LumosLogo.png"
						width={35}
						height={35}
						alt="Lumos app logo"
					/>
					<p className="font-logo px-3">Lumos</p>
				</Link>
				<div className="flex space-x-6">
					<Link
						href="/calculators"
						className="text-gray-400 hover:text-white transition-colors duration-300"
					>
						Calculators
					</Link>
					<Link
						href="/mypositions"
						className="text-gray-400 hover:text-white transition-colors duration-300"
					>
						Positions
					</Link>
					<Link
						href="/pools"
						className="text-gray-400 hover:text-white transition-colors duration-300"
					>
						Pools
					</Link>
				</div>
				<div className="absolute right-6 flex items-center space-x-4">
					<WalletConnector />
					{user !== undefined ? (
						<div className="flex items-center space-x-4">
							{user.pfp && (
								<Link href="/profile">
									<Image
										src={user.pfp}
										alt="User Profile"
										width={35}
										height={35}
										className="rounded-full object-cover ring-1 ring-white/20"
									/>
								</Link>
							)}
							<button
								className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 
                                transition-all duration-300 text-base ring-1 ring-white/20"
								onClick={() => handleLogout()}
							>
								Logout
							</button>
						</div>
					) : (
						<button
							className="px-8 py-2 rounded-sm bg-white/5 hover:bg-white/10 
                            transition-all duration-300 text-base ring-1 ring-white/20"
							onClick={() => setOpenLogin(true)}
						>
							Login
						</button>
					)}
				</div>
			</nav>

			{/* Login Modal */}
			<LoginModal isOpen={openLogin} onClose={setOpenLogin} />
		</>
	);
}
