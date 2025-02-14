'use client'
import Link from "next/link";
import Image from 'next/image'
import { useState } from "react";
import LoginModal from "./modals/LoginModal";
import { activeUser } from "@/state/user";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAtom } from "jotai";
import { Menu, X } from "lucide-react";

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
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed top-6 left-6 z-50 p-2 rounded-sm bg-white/5 hover:bg-white/10 transition-all ring-1 ring-white/20"
            >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className={`fixed top-0 left-0 h-full w-64 bg-black/90 backdrop-blur-sm border-r border-white/20 transform transition-transform duration-300 ease-in-out z-40 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                            className="text-gray-400 hover:text-white font-light transition-colors duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Calculators
                        </Link>
                        <Link
                            href="/mypositions"
                            className="text-gray-400 hover:text-white font-light transition-colors duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            My positions
                        </Link>
                        <Link
                            href="/pools"
                            className="text-gray-400 hover:text-white font-light transition-colors duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pools
                        </Link>
                        {/* <Link 
                            href="/pricing" 
                            className="text-gray-400 hover:text-white font-light transition-colors duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pricing
                        </Link> */}
                    </div>
                    <div className="mt-auto">
                        {user !== undefined ? (
                            <div className="flex flex-col gap-4">
                                {user.pfp && (
                                    <Link
                                        href="/profile"
                                        className="text-gray-400 hover:text-white font-light transition-colors duration-300"
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
                                    transition-all duration-300 text-base font-light ring-1 ring-white/20"
                                    onClick={() => handleLogout()}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                className="w-full px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 
                                transition-all duration-300 text-base font-light ring-1 ring-white/20"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setOpenLogin(true);
                                }}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            <LoginModal isOpen={openLogin} onClose={setOpenLogin} />
        </>
    );
}
