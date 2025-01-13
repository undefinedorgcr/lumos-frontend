import Link from "next/link";
import WalletConnector from "./ConnectWallet";
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
                    />
                </Link>
                <div className="text-xl flex gap-8">
                    <Link href="/calculators" className="text-gray-300 hover:text-white font-neuethin transition duration-300">Calculators</Link>
                    <Link href="/mypositions" className="text-gray-300 hover:text-white font-neuethin transition duration-300">My positions</Link>
                </div>
            </div>
            <WalletConnector />
        </nav>
    );
}