import React from 'react';

const Footer = (): React.JSX.Element => {
	return (
		<footer className="text-white mt-auto">
			<div className="w-full border-t border-gray-800"></div>
			{/* Newsletter Section */}
			<div className="container mx-auto p-7">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Newsletter Signup */}
					<div className="md:col-span-1 flex flex-col items-center text-center">
						<h2 className="text-2xl font-bold mb-4">
							Don't Miss Out
						</h2>

						{/* Social Media Icons - Using original icons */}
						<div className="flex space-x-2 mt-6">
							<a
								className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
								href="https://github.com/undefinedorgcr"
								target="_blank"
							>
								<svg
									height="20"
									viewBox="0 0 24 24"
									width="20"
									className="fill-current"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g>
										<path d="M12,0.296c-6.627,0-12,5.372-12,12c0,5.302,3.438,9.8,8.206,11.387   c0.6,0.111,0.82-0.26,0.82-0.577c0-0.286-0.011-1.231-0.016-2.234c-3.338,0.726-4.043-1.416-4.043-1.416   C4.421,18.069,3.635,17.7,3.635,17.7c-1.089-0.745,0.082-0.729,0.082-0.729c1.205,0.085,1.839,1.237,1.839,1.237   c1.07,1.834,2.807,1.304,3.492,0.997C9.156,18.429,9.467,17.9,9.81,17.6c-2.665-0.303-5.467-1.332-5.467-5.93   c0-1.31,0.469-2.381,1.237-3.221C5.455,8.146,5.044,6.926,5.696,5.273c0,0,1.008-0.322,3.301,1.23   C9.954,6.237,10.98,6.104,12,6.099c1.02,0.005,2.047,0.138,3.006,0.404c2.29-1.553,3.297-1.23,3.297-1.23   c0.653,1.653,0.242,2.873,0.118,3.176c0.769,0.84,1.235,1.911,1.235,3.221c0,4.609-2.807,5.624-5.479,5.921   c0.43,0.372,0.814,1.103,0.814,2.222c0,1.606-0.014,2.898-0.014,3.293c0,0.319,0.216,0.694,0.824,0.576   c4.766-1.589,8.2-6.085,8.2-11.385C24,5.669,18.627,0.296,12,0.296z" />
										<path d="M4.545,17.526c-0.026,0.06-0.12,0.078-0.206,0.037c-0.087-0.039-0.136-0.121-0.108-0.18   c0.026-0.061,0.12-0.078,0.207-0.037C4.525,17.384,4.575,17.466,4.545,17.526L4.545,17.526z" />
										<path d="M5.031,18.068c-0.057,0.053-0.169,0.028-0.245-0.055c-0.079-0.084-0.093-0.196-0.035-0.249   c0.059-0.053,0.167-0.028,0.246,0.056C5.076,17.903,5.091,18.014,5.031,18.068L5.031,18.068z" />
										<path d="M5.504,18.759c-0.074,0.051-0.194,0.003-0.268-0.103c-0.074-0.107-0.074-0.235,0.002-0.286   c0.074-0.051,0.193-0.005,0.268,0.101C5.579,18.579,5.579,18.707,5.504,18.759L5.504,18.759z" />
										<path d="M6.152,19.427c-0.066,0.073-0.206,0.053-0.308-0.046c-0.105-0.097-0.134-0.234-0.068-0.307   c0.067-0.073,0.208-0.052,0.311,0.046C6.191,19.217,6.222,19.355,6.152,19.427L6.152,19.427z" />
										<path d="M7.047,19.814c-0.029,0.094-0.164,0.137-0.3,0.097C6.611,19.87,6.522,19.76,6.55,19.665   c0.028-0.095,0.164-0.139,0.301-0.096C6.986,19.609,7.075,19.719,7.047,19.814L7.047,19.814z" />
										<path d="M8.029,19.886c0.003,0.099-0.112,0.181-0.255,0.183c-0.143,0.003-0.26-0.077-0.261-0.174c0-0.1,0.113-0.181,0.256-0.184   C7.912,19.708,8.029,19.788,8.029,19.886L8.029,19.886z" />
										<path d="M8.943,19.731c0.017,0.096-0.082,0.196-0.224,0.222c-0.139,0.026-0.268-0.034-0.286-0.13   c-0.017-0.099,0.084-0.198,0.223-0.224C8.797,19.574,8.925,19.632,8.943,19.731L8.943,19.731z" />
									</g>
								</svg>
							</a>
							<a
								className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
								href="https://x.com/lumosapp_"
								target="_blank"
							>
								<svg
									height="20"
									viewBox="0 0 24 24"
									width="20"
									className="fill-current"
									xmlns="http://www.w3.org/2000/svg"
								>
									<polygon points="6.861 6.159 15.737 17.764 17.097 17.764 8.322 6.159 6.861 6.159" />
									<path d="m0,0v24h24V0H0Zm15.063,19.232l-3.87-5.055-4.422,5.055h-2.458l5.733-6.554-6.046-7.91h5.062l3.494,4.621,4.043-4.621h2.455l-5.361,6.126,6.307,8.337h-4.937Z" />
								</svg>
							</a>
							<a
								className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
								href="https://discord.gg/sEpnC6JB2U"
								target="_blank"
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
							{/* Telegram Icon */}
							<a
								className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
								href="https://t.me/+zB6wXUOsWptjNzQx"
								target="_blank"
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

					{/* Company Info */}
					<div className="md:col-span-1 flex flex-col items-center text-center ">
						<h3 className="text-lg font-medium mb-4 uppercase">
							Company
						</h3>
						<ul className="space-y-2">
							<li>
								<a href="#" className="hover:underline">
									About
								</a>
							</li>
						</ul>
					</div>

					{/* Customer Service */}
					<div className="md:col-span-1 flex flex-col items-center text-center">
						<h3 className="text-lg font-medium mb-4 uppercase ">
							Customer Service
						</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="https://t.me/+zB6wXUOsWptjNzQx"
									className="hover:underline"
								>
									Contact Us
								</a>
							</li>
							<li>
								<a href="/profile" className="hover:underline">
									My Account
								</a>
							</li>
						</ul>
					</div>

					{/* More to Explore */}
					<div className="md:col-span-1 flex flex-col items-center text-center">
						<h3 className="text-lg font-medium mb-4 uppercase">
							More to Explore
						</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="/calculators"
									className="hover:underline"
								>
									Calculators
								</a>
							</li>
							<li>
								<a
									href="/mypositions"
									className="hover:underline"
								>
									Positions
								</a>
							</li>
							<li>
								<a href="/pools" className="hover:underline">
									Pools
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom Links - Modificado para tener línea en todo el ancho y texto centrado */}
			<div>
				<div className="container mx-auto px-8 py-4">
					<div className="flex justify-center items-center">
						<span className="text-sm">
							Lumos App - Copyright © {new Date().getFullYear()}{' '}
							- All right reserved
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
