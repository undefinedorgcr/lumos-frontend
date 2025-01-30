import Link from "next/link";
import WalletConnector from "./connectWallet";
import Image from 'next/image'

export default function Navbar() {
    return (
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
            <WalletConnector />
        </nav>
    );
}