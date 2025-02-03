import { atomWithStorage } from 'jotai/utils'

interface User {
    email: string;
    uid: string;
    displayName: string;
    pfp: string;
}

export const activeUser = atomWithStorage<undefined | User>
  ('activeUser', undefined)
