'use client';
import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { activeUser } from '@/state/user';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import InfoModal from '@/components/ui/modals/InfoModal';

interface UserDetails {
	user_type: string;
	plan_exp_date?: string;
}

const ProfilePage = () => {
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [openInfo, setOpenInfo] = useState(false);
	const user = useAtomValue(activeUser);

	useEffect(() => {
		async function getUserDetails() {
			try {
				if (user !== undefined) {
					setLoading(true);
					const { data } = await axios.get(`/api/lumos/users`, {
						params: { uId: user.uid },
					});
					setUserDetails(data.data);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		getUserDetails();
	}, [user]);

	if (!user) {
		return (
			<div className="min-h-screen flex flex-col relative">
				<Navbar />
				<main className="flex-1 flex items-center justify-center">
					<div className="text-center p-6 backdrop-blur-sm">
						<p className="text-2xl  mb-6">
							Please log in to view your profile.
						</p>
						<Link
							href="/"
							className="custom-button mt-4 hover:scale-105 transition-transform"
						>
							Go to Home
						</Link>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col relative">
			<Navbar />
			<main className="flex-1 flex items-center px-6 py-12">
				<div className="max-w-4xl mx-auto w-full">
					<div className="space-y-8">
						<h1 className="text-4xl  text-center mb-12 bg-clip-text bg-gradient-to-r text-white">
							Your Profile
						</h1>

						{loading ? (
							<div className="flex justify-center items-center h-64">
								<div className="text-2xl  animate-pulse">
									Loading...
								</div>
							</div>
						) : (
							<div className="space-y-8">
								<div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
									<div className="flex flex-col md:flex-row items-center gap-8">
										<div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white">
											<Image
												src={
													user.pfp ||
													'/images/default-avatar.png'
												}
												alt="Profile picture"
												fill
												className="object-cover"
											/>
										</div>
										<div className="space-y-4 text-center md:text-left">
											<div>
												<p className="text-gray-400 text-sm uppercase tracking-wider">
													Email
												</p>
												<p className="text-2xl  bg-clip-text bg-gradient-to-r text-white">
													{user.email}
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
									<h2 className="text-2xl  mb-6 bg-clip-text text-white bg-gradient-to-r">
										Subscription Details
									</h2>
									<div className="space-y-6">
										<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-lg bg-white/5">
											<div>
												<p className="text-gray-400 text-sm tracking-wider">
													Current Plan
												</p>
												<p className="text-2xl ">
													{userDetails?.user_type ||
														'FREE'}
												</p>
											</div>

											{userDetails?.user_type ===
												'FREE' && (
												<Link
													href="#"
													className="custom-button"
													onClick={() => {
														setOpenInfo(true);
													}}
												>
													Upgrade Plan
												</Link>
											)}
										</div>

										<div className="p-4 rounded-lg bg-white/5">
											<p className="text-gray-400 text-sm tracking-wider">
												Next Payment Date
											</p>
											<p className="text-xl ">
												{userDetails?.plan_exp_date
													? new Date(
															userDetails.plan_exp_date
														).toLocaleDateString()
													: 'Free plan tier does not expire.'}
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>
			<InfoModal
				isOpen={openInfo}
				onClose={() => {
					setOpenInfo(false);
				}}
				title={'Upgrade Your Plan'}
				message={
					'Tier upgrade is not implemented yet, if you want to become a PRO user on Lumos please contact lumosapplication@gmail.com or leave a message on our discord server.'
				}
			/>
			<Footer />
		</div>
	);
};

export default ProfilePage;
