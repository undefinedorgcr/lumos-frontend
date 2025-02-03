'use client'
import Link from "next/link";
import Image from 'next/image'
import { useState } from "react";
import LoginModal from "./modals/LoginModal";
import { activeUser } from "@/state/user";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAtom } from "jotai";

export default function Navbar() {
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const [user, setUser] = useAtom(activeUser);

    const handleLogout = async () => {
        await signOut(auth);
        setUser(undefined);
    };

    return (
        <>
            <nav className="flex justify-between items-center m-7">
                <div className="flex items-center gap-8">
                    <Link
                        href={"/"}
                        className="justify-items-center"
                    >
                        <Image
                            src="/images/LumosLogo.png"
                            width={55}
                            height={55}
                            alt="Lumos app logo"
                            className="transition duration-500 hover:scale-110 opacity-75 hover:opacity-100"
                        />
                    </Link>
                    <div className="text-xl flex gap-8">
                        <Link href="/calculators" className="text-gray-400 hover:text-white font-neuethin transition duration-300">Calculators</Link>
                        <Link href="/mypositions" className="text-gray-400 hover:text-white font-neuethin transition duration-300">My positions</Link>
                        <Link href="/pools" className="text-gray-400 hover:text-white font-neuethin transition duration-300">Pools</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {user !== undefined ? (
                        <>
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
                                className="px-8 py-2 rounded-md border border-white/20 bg-white/5 
                                hover:bg-white hover:text-black transition-all duration-500 
                                text-lg font-neuethin"
                                onClick={() => handleLogout()}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button 
                            className="px-8 py-2 rounded-md border border-white/20 bg-white/5 
                            hover:bg-white hover:text-black transition-all duration-500 
                            text-lg font-neuethin"
                            onClick={() => setOpenLogin(true)}
                        >
                            Login
                        </button>
                    )}
                </div>
            </nav>
            <LoginModal isOpen={openLogin} onClose={setOpenLogin} />
        </>
    );
}