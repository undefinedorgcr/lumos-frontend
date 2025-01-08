/* eslint-disable @next/next/no-html-link-for-pages */
import WalletConnector from "./connectWallet";
import Image from 'next/image'

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center m-7">
            <div className="flex items-center gap-8">
                <a href="/" className="justify-items-center">
                    <Image
                        src="/images/LumosLogo.png"
                        width={55}
                        height={55}
                        alt="Lumos app logo"
                    />
                </a>
                <div className="text-xl flex gap-8">
                    <a href="/calculators" className="text-gray-300 hover:text-white font-neuethin transition duration-300">Calculators</a>
                    <a href="mypositions" className="text-gray-300 hover:text-white font-neuethin transition duration-300">My positions</a>
                </div>
            </div>
            <WalletConnector></WalletConnector>
        </nav>
    );
}