import Image from 'next/image';
import Link from 'next/link';

interface ProtocolCardProps {
    imageSrc: string,
    title: string,
    href: string,
}

const ProtocolCard = ({ imageSrc, title, href } : ProtocolCardProps) => {
  return (
    <Link className="w-96 h-96 bg-black border border-white rounded-lg flex flex-col items-center justify-center p-4 shadow-md
                    hover:bg-zinc-700 transition duration-500 hover:cursor-pointer"
           href={href}>
      <div className="w-50 h-50 rounded-full overflow-hidden flex items-center justify-center bg-gray-800">
        <Image src={imageSrc} alt={title} width={200} height={200} />
      </div>
      <p className="text-white mt-4 text-lg font-neue text-center">{title}</p>
    </Link>
  );
};

export default ProtocolCard;
