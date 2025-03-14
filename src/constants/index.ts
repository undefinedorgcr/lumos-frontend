// constants.ts
import { RpcProvider, constants } from 'starknet';

export const getAddresses = (chainId: string | undefined) => ({
	EKUBO_CORE:
		'0x00000005dd3D2F4429AF886cD1a3b08289DBcEa99A294197E9eB43b0e0325b4b',
	EKUBO_POSITIONS:
		chainId === 'SN_SEPOLIA'
			? '0x06a2aee84bb0ed5dded4384ddd0e40e9c1372b818668375ab8e3ec08807417e5'
			: '0x02e0af29598b407c8716b17f6d2795eca1b471413fa03fb145a5e33722184067',
	USDC:
		chainId === 'SN_SEPOLIA'
			? '0x053b40A647CEDfca6cA84f542A0fe36736031905A9639a7f19A3C1e66bFd5080'
			: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
});

export const getBraavosChainId = (chainId: string) =>
	chainId === constants.NetworkName.SN_MAIN
		? '0x534e5f4d41494e'
		: '0x534e5f5345504f4c4941';

export const getBaseUrl = (chainId: string) =>
	chainId === 'SN_SEPOLIA'
		? 'https://sepolia-api.ekubo.org'
		: 'https://mainnet-api.ekubo.org';

export const ARGENT_SESSION_SERVICE_BASE_URL =
	process.env.NEXT_PUBLIC_ARGENT_SESSION_SERVICE_BASE_URL ||
	'https://cloud.argent-api.com/v1';

export const ARGENT_WEBWALLET_URL =
	process.env.NEXT_PUBLIC_ARGENT_WEBWALLET_URL || 'https://web.argent.xyz';

export const getNodeUrl = (chainId?: string) =>
	chainId === 'SN_SEPOLIA'
		? process.env.NEXT_PUBLIC_SEPOLIA_RPC
		: process.env.NEXT_PUBLIC_MAINNET_RPC;

export const getProvider = (nodeUrl: string | undefined) =>
	new RpcProvider({ nodeUrl });

export const getChainId = (chainId?: string) =>
	chainId === 'SN_SEPOLIA'
		? constants.NetworkName.SN_SEPOLIA
		: constants.NetworkName.SN_MAIN;
