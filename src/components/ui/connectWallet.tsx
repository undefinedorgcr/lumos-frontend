'use client';
import Image from 'next/image'
import { useState } from 'react';

export default function WalletConnector() {
    const [isHover, setIsHover] = useState(false);

    function handleArgentLogoChange() {
        setIsHover(!isHover);
    }

    return (
        <button 
            onMouseEnter={handleArgentLogoChange}
            onMouseLeave={handleArgentLogoChange}
            className="text-xl font-neuethin bg-white text-black px-10 py-2 rounded-md flex items-center gap-2
                      hover:bg-[#FF875C] hover:text-white transition duration-500"
        >
            Login
            {!isHover &&
                <Image
                    src="/images/ArgentLogo.png"
                    width={25}
                    height={25}
                    alt="Lumos app logo"
                    className="pointer-events-none"
                />
            }
            {isHover &&
                <Image
                    src="/images/LightArgentLogo.png"
                    width={25}
                    height={25}
                    alt="Lumos app logo"
                    className="pointer-events-none"
                />
            }
        </button>
    );
}