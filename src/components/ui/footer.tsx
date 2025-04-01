import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = (): React.JSX.Element => {
	return (
		<footer className="text-white bg-opacity-50 backdrop-blur-sm">
			<div className="container mx-auto px-6 py-8">
				<div className="flex flex-col md:flex-row justify-between items-center mb-8">
					<div className="mb-6 md:mb-0">
						<h2 className="flex items-center mr-2">
							<Image
								src="/images/LumosLogo.png"
								width={35}
								height={35}
								alt="Lumos app logo"
							/>
							<p className="font-logo px-3">Lumos</p>
						</h2>
						<p className="text-sm text-gray-400 mt-2">
							Power your finances with DeFi
						</p>
					</div>

					<div className="flex space-x-4">
						<a
							className="p-2 rounded-md bg-black bg-opacity-30 hover:bg-white hover:text-black transition-all duration-500"
							href="https://github.com/undefinedorgcr"
							target="_blank"
							aria-label="GitHub"
						>
							<svg
								height="20"
								viewBox="0 0 24 24"
								width="20"
								className="fill-current"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M12,0.296c-6.627,0-12,5.372-12,12c0,5.302,3.438,9.8,8.206,11.387   c0.6,0.111,0.82-0.26,0.82-0.577c0-0.286-0.011-1.231-0.016-2.234c-3.338,0.726-4.043-1.416-4.043-1.416   C4.421,18.069,3.635,17.7,3.635,17.7c-1.089-0.745,0.082-0.729,0.082-0.729c1.205,0.085,1.839,1.237,1.839,1.237   c1.07,1.834,2.807,1.304,3.492,0.997C9.156,18.429,9.467,17.9,9.81,17.6c-2.665-0.303-5.467-1.332-5.467-5.93   c0-1.31,0.469-2.381,1.237-3.221C5.455,8.146,5.044,6.926,5.696,5.273c0,0,1.008-0.322,3.301,1.23   C9.954,6.237,10.98,6.104,12,6.099c1.02,0.005,2.047,0.138,3.006,0.404c2.29-1.553,3.297-1.23,3.297-1.23   c0.653,1.653,0.242,2.873,0.118,3.176c0.769,0.84,1.235,1.911,1.235,3.221c0,4.609-2.807,5.624-5.479,5.921   c0.43,0.372,0.814,1.103,0.814,2.222c0,1.606-0.014,2.898-0.014,3.293c0,0.319,0.216,0.694,0.824,0.576   c4.766-1.589,8.2-6.085,8.2-11.385C24,5.669,18.627,0.296,12,0.296z" />
							</svg>
						</a>
						<a
							className="p-2 rounded-md bg-black bg-opacity-30 hover:bg-white hover:text-black transition-all duration-500"
							href="https://x.com/lumosapp_"
							target="_blank"
							aria-label="X"
						>
							<svg
								height="20"
								viewBox="0 0 24 24"
								width="20"
								className="fill-current"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="m0,0v24h24V0H0Zm15.063,19.232l-3.87-5.055-4.422,5.055h-2.458l5.733-6.554-6.046-7.91h5.062l3.494,4.621,4.043-4.621h2.455l-5.361,6.126,6.307,8.337h-4.937Z" />
							</svg>
						</a>
						<a
							className="p-2 rounded-md bg-black bg-opacity-30 hover:bg-white hover:text-black transition-all duration-500"
							href="https://discord.gg/sEpnC6JB2U"
							target="_blank"
							aria-label="Discord"
						>
							<svg
								height="20"
								viewBox="0 0 24 24"
								width="20"
								className="fill-current"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M20.317,4.37c-1.53-0.702-3.17-1.219-4.885-1.515c-0.031-0.006-0.062,0.009-0.079,0.037   c-0.211,0.375-0.445,0.865-0.608,1.249c-1.845-0.276-3.68-0.276-5.487,0C9.095,3.748,8.852,3.267,8.641,2.892   C8.624,2.864,8.593,2.85,8.562,2.855C6.848,3.15,5.208,3.667,3.677,4.37C3.664,4.375,3.652,4.385,3.645,4.397   c-3.111,4.648-3.964,9.182-3.546,13.66c0.002,0.022,0.014,0.043,0.031,0.056c2.053,1.508,4.041,2.423,5.993,3.029   c0.031,0.01,0.064-0.002,0.084-0.028c0.462-0.63,0.873-1.295,1.226-1.994c0.021-0.041,0.001-0.09-0.042-0.106   c-0.653-0.248-1.274-0.55-1.872-0.892c-0.047-0.028-0.051-0.095-0.008-0.128c0.126-0.094,0.252-0.192,0.372-0.291   c0.022-0.018,0.052-0.022,0.078-0.01c3.928,1.793,8.18,1.793,12.061,0c0.026-0.012,0.056-0.009,0.079,0.01   c0.12,0.099,0.246,0.198,0.373,0.292c0.044,0.032,0.041,0.1-0.007,0.128c-0.598,0.349-1.219,0.645-1.873,0.891   c-0.043,0.016-0.061,0.066-0.041,0.107c0.36,0.698,0.772,1.363,1.225,1.993c0.019,0.027,0.053,0.038,0.084,0.029   c1.961-0.607,3.95-1.522,6.002-3.029c0.018-0.013,0.029-0.033,0.031-0.055c0.5-5.177-0.838-9.674-3.548-13.66   C20.342,4.385,20.33,4.375,20.317,4.37z M8.02,15.331c-1.183,0-2.157-1.086-2.157-2.419s0.955-2.419,2.157-2.419   c1.211,0,2.176,1.095,2.157,2.419C10.177,14.246,9.221,15.331,8.02,15.331z M15.995,15.331c-1.182,0-2.157-1.086-2.157-2.419   s0.955-2.419,2.157-2.419c1.211,0,2.176,1.095,2.157,2.419C18.152,14.246,17.206,15.331,15.995,15.331z" />
							</svg>
						</a>
						<a
							className="p-2 rounded-md bg-black bg-opacity-30 hover:bg-white hover:text-black transition-all duration-500"
							href="https://t.me/+zB6wXUOsWptjNzQx"
							target="_blank"
							aria-label="Telegram"
						>
							<svg
								height="20"
								viewBox="0 0 24 24"
								width="20"
								className="fill-current"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
							</svg>
						</a>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					<div className="space-y-4">
						<h3 className="text-sm font-semibold uppercase tracking-wider">
							Company
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/about"
									className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/knowmore"
									className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
								>
									Know More
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="text-sm font-semibold uppercase tracking-wider">
							Tools
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/calculators"
									className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
								>
									Calculators
								</Link>
							</li>
							<li>
								<Link
									href="/mypositions"
									className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
								>
									Positions
								</Link>
							</li>
							<li>
								<Link
									href="/pools"
									className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
								>
									Pools
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="text-sm font-semibold uppercase tracking-wider">
							Support
						</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="https://t.me/+zB6wXUOsWptjNzQx"
									target="_blank"
									className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
								>
									Contact Us
								</a>
							</li>
							<li>
								<Link
									href="/profile"
									className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
								>
									My Account
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="pt-8 border-t border-gray-800">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-xs text-gray-400">
							Lumos App - Copyright © {new Date().getFullYear()}{' '}
							- All rights reserved
						</p>
						<div className="mt-4 md:mt-0">
							<Link
								href="#"
								className="text-xs text-gray-400 hover:text-white mr-4 transition-colors duration-300"
							>
								Privacy Policy
							</Link>
							<Link
								href="#"
								className="text-xs text-gray-400 hover:text-white transition-colors duration-300"
							>
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
