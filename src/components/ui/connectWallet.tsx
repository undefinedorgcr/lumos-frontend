import Image from 'next/image'

export default function WalletConnector() {
    return (
        <div>
            <button className="text-xl font-neuethin bg-white text-black px-10 py-2 rounded-md flex items-center gap-2">
                Login
                <Image
                    src="/images/ArgentLogo.png"
                    width={35}
                    height={35}
                    alt="Lumos app logo"
                />
            </button>
        </div>
    );
}
