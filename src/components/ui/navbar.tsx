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
                className="fixed top-7 left-7 z-50 p-2 rounded-md border border-white/20 bg-black hover:bg-white/5 transition-colors duration-300"
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-white/20 transform transition-transform duration-300 ease-in-out z-40 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full p-7">
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
                    <div className="flex flex-col gap-6">
                        <Link 
                            href="/calculators" 
                            className="text-gray-400 hover:text-white font-neuethin transition duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Calculators
                        </Link>
                        <Link 
                            href="/mypositions" 
                            className="text-gray-400 hover:text-white font-neuethin transition duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            My positions
                        </Link>
                        <Link 
                            href="/pools" 
                            className="text-gray-400 hover:text-white font-neuethin transition duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pools
                        </Link>
                        <Link 
                            href="#" 
                            className="text-gray-400 hover:text-white font-neuethin transition duration-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                    </div>
                    <div className="mt-auto">
                        {user !== undefined ? (
                            <div className="flex flex-col gap-4 hover:cursor-pointer">
                                {user.pfp && (
                                    <Image 
                                        src={user.pfp} 
                                        alt="User Profile" 
                                        width={40} 
                                        height={40} 
                                        className="rounded-full object-cover"
                                    />
                                )}
                                <button 
                                    className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/5 
                                    hover:bg-white hover:text-black transition-all duration-500 
                                    text-base font-neuethin"
                                    onClick={() => handleLogout()}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/5 
                                hover:bg-white hover:text-black transition-all duration-500 
                                text-base font-neuethin"
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
