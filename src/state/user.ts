import { atomWithStorage } from 'jotai/utils';

interface User {
	email: string;
	uid: string;
	displayName: string;
	pfp: string;
}

export const activeUser = atomWithStorage<undefined | User>(
	'activeUser',
	undefined,
	{
		getItem: (key) => {
			const storedValue = sessionStorage.getItem(key);
			if (storedValue == 'undefined') {
				return undefined;
			}
			return storedValue ? JSON.parse(storedValue) : undefined;
		},
		setItem: (key, value) => {
			sessionStorage.setItem(key, JSON.stringify(value));
		},
		removeItem: (key) => {
			sessionStorage.removeItem(key);
		},
	}
);
