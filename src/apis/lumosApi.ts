import { User } from '@/types/User';
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_LUMOS_BACKEND_URL}/users`;


/**
 * Sends a POST request to create a new user.
 * @param user User data to be created.
 * @returns Server response or error.
 */
export async function saveUser(user: User): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const response = await axios.post(API_URL, user, {
            headers: { 'Content-Type': 'application/json' }
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: error.response?.data?.message || 'Error creating user' };
    }
}

/**
 * Fetches a user by their uId.
 * @param {string} uId - The uId of the user to retrieve.
 * @returns {Promise<{ success: boolean; data?: User; error?: string }>}
 */
export async function getUserByUId(uId: string): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
        const response = await axios.get(`${API_URL}?uId=${uId}`, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.users?.length > 0) {
            return { success: true, data: response.data.users[0] };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error: any) {
        return { success: false, error: error.response?.data?.message || 'Error fetching user' };
    }
}