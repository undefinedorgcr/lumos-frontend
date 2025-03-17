import { atomWithStorage } from 'jotai/utils';
import { StarknetWindowObject } from 'starknetkit';

export const walletStarknetkitLatestAtom = atomWithStorage<
	undefined | null | StarknetWindowObject
>('walletStarknetkitLatest', undefined);
