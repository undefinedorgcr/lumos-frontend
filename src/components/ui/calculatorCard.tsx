'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProtocolCardProps {
    imageSrc: string,
    title: string,
    description: string,
    href: string,
}

const ProtocolCard = ({ imageSrc, title, description, href } : ProtocolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      href={href}
      className="group relative w-full max-w-lg bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 transition-all duration-300 hover:border-zinc-600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
          <Image 
            src={imageSrc} 
            alt={title} 
            width={70} 
            height={70}
            className="object-contain"
          />
        </div>
        <h3 className="text-xl font-light text-white mb-3">{title}</h3>
        <p className="text-zinc-400 text-center text-sm">{description}</p>
        
        <div className={`mt-6 px-4 py-2 rounded-lg border border-zinc-700 text-sm transition-all duration-300 ${isHovered ? 'text-black bg-white' : 'bg-transparent'}`}>
          Launch Calculator
        </div>
      </div>
    </Link>
  );
};

export default ProtocolCard;
