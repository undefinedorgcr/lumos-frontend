'use client'
import Link from "next/link";
import Image from 'next/image'
import { useState } from "react";
import LoginModal from "./modals/LoginModal";

export default function Navbar() {
    const [openLogin, setOpenLogin] = useState<boolean>(false);

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
                <button className="px-8 py-2 rounded-md border border-white/20 bg-white/5 
                    hover:bg-white hover:text-black transition-all duration-500 
                    text-lg font-neuethin"
                    onClick={() => setOpenLogin(true)}
                >
                    Login
                </button>
            </nav>
            <LoginModal isOpen={openLogin} onClose={setOpenLogin}/>
        </>
    );
}
