'use client';
import StarField from '@/components/animations/starfield';
import Footer from '@/components/ui/footer';
import Navbar from '@/components/ui/navbar';
import { FeatureCardProps } from '@/types/FeatureCardProps';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
	return (
		<motion.div
			className="relative z-10 rounded-lg border border-gray-800 bg-[#111111] p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white"
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.5,
				type: 'spring',
				stiffness: 100,
			}}
			whileHover={{
				scale: 1.05,
				transition: { duration: 0.2 },
			}}
		>
			<motion.h3
				className="text-2xl font-light text-white mb-6 transition-colors duration-300 group-hover:text-blue-400"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				{title}
			</motion.h3>
			<motion.p
				className="text-gray-400 font-light"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
			>
				{description}
			</motion.p>
		</motion.div>
	);
};

const About = () => {
	const features = [
		{
			title: 'The Problem',
			description:
				'DeFi liquidity management is complex and inefficient, lacking user-friendly tools for real-time insights and cross-protocol optimization.',
		},
		{
			title: 'Our Solution',
			description:
				'Lumos simplifies liquidity management with real-time insights, optimizing capital efficiency across multiple DeFi protocols and blockchains—your all-in-one solution for liquidity pool management.',
		},
		{
			title: 'Our Mission',
			description:
				'Bridging TradFi and DeFi by simplifying liquidity provisioning and maximizing returns with user-friendly, efficient tools for all investors.',
		},
		{
			title: 'Future Vision',
			description:
				'We aspire to become the most comprehensive and user-friendly platform in the DeFi ecosystem. Our goal is to democratize liquidity management, break down technical barriers, and empower users with intuitive tools that maximize their potential in decentralized finance.',
		},
	];

	return (
		<div className="min-h-screen p-6">
			<Navbar />
			<StarField />

			<motion.div
				className="max-w-4xl mx-auto text-center mb-24 flex flex-col items-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className="mb-12 w-[430px] h-[430px] relative animate-float">
					<Image
						src="/images/LumosLogo.png"
						width={500}
						height={500}
						alt="Undef!ned logo"
						className="object-contain"
						priority
					/>
				</div>

				<h1 className="text-4xl md:text-5xl font-light text-white mb-12">
					Undef!ned
				</h1>

				<p className="text-gray-400 text-lg md:text-xl mb-6 font-light">
					we build.{' '}
				</p>
			</motion.div>

			<motion.div
				className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
				initial="hidden"
				animate="visible"
				variants={{
					hidden: { opacity: 0 },
					visible: {
						opacity: 1,
						transition: {
							delayChildren: 0.3,
							staggerChildren: 0.2,
						},
					},
				}}
			>
				{features.map((feature, index) => (
					<FeatureCard key={index} {...feature} />
				))}
			</motion.div>

			<Footer />
		</div>
	);
};

export default About;
