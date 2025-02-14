/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import StarField from '@/components/animations/starfield';
import Image from 'next/image'
import { auth, provider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, TwitterAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { activeUser } from '@/state/user';
import ErrorModal from './ErrorModal';
import axios from 'axios';
import { User } from '@/types/User';

interface LoginModalProps {
    isOpen: boolean;
    onClose: (value: boolean) => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [useRegister, setUseRegister] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');
    const [passError, setPassError] = useState<string>('');
    const [repeatPassError, setRepeatPassError] = useState<string>('');
    const [openError, setOpenError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const setUser = useSetAtom(activeUser);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const saveUser = async (user: User) => {
        const { data } = (await axios.post(`/api/lumos/users`,
            {
                'uId': user.uId,
                'email': user.email,
                'user_type': 'FREE',
            }));
        return data;
    }

    const handleLoginGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser({ email: result.user.email ?? '', uid: result.user.uid, displayName: result.user.displayName ?? '', pfp: result.user.photoURL ?? '' });
            await saveUser({ uId: result.user.uid, email: result.user.email ?? '' });
            onClose(false);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    const handleLoginX = async () => {
        try {
            const result = await signInWithPopup(auth, new TwitterAuthProvider());
            setUser({ email: result.user.email ?? '', uid: result.user.uid, displayName: result.user.displayName ?? '', pfp: result.user.photoURL ?? '' });
            await saveUser({ uId: result.user.uid, email: result.user.email ?? '' });
            onClose(false);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    }

    const handleLogin = async () => {
        setEmailError('');
        setPassError('');
        if (email.trim() === '') {
            setEmailError('Email is required');
            return;
        }
        if (!validateEmail(email)) {
            setEmailError('Invalid email address');
            return;
        }
        if (password.trim() === '') {
            setPassError('Password is required');
            return;
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            setUser({
                email: result.user.email ?? '',
                uid: result.user.uid,
                displayName: result.user.displayName ?? '',
                pfp: result.user.photoURL ?? '/images/defUserPfp.png'
            });
            setEmail('');
            setPassword('');
            onClose(false);
        } catch (error) {
            setOpenError(true);
            setErrorMessage("Email or password may be incorrect");
            console.error("Error al iniciar sesión:", error);
        }
    }

    const handleRegister = async () => {
        setEmailError('');
        setPassError('');
        setRepeatPassError('');
        if (email.trim() === '') {
            setEmailError('Email is required');
            return;
        }
        if (!validateEmail(email)) {
            setEmailError('Invalid email address');
            return;
        }

        if (password.trim() === '') {
            setPassError('Password is required');
            return;
        }
        if (repeatPassword.trim() === '') {
            setRepeatPassError('Please repeat password');
            return;
        }
        if (password !== repeatPassword) {
            setRepeatPassError('Passwords do not match');
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            setUser({
                email: result.user.email ?? '',
                uid: result.user.uid,
                displayName: result.user.displayName ?? '',
                pfp: result.user.photoURL ?? '/images/defUserPfp.png'
            });
            await saveUser({ uId: result.user.uid, email: result.user.email ?? '' });
            setEmail('');
            setPassword('');
            setRepeatPassword('');
            onClose(false);
        } catch (error: any) {
            setOpenError(true);
            setErrorMessage(error.message.replace("Firebase: ", ""));
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#111111]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <StarField></StarField>
            <div className="bg-[#171717] rounded-lg w-full max-w-md relative">
                <button
                    onClick={() => onClose(false)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-400 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 flex items-center justify-center mb-6">
                        <Image
                            src="/images/LumosLogo.png"
                            width={55}
                            height={55}
                            alt="Lumos app logo"
                        />
                    </div>
                    <h3 className="text-2xl text-white font-light mb-8">
                        {useRegister ? "Sign Up to Lumos" : "Login to Lumos"}
                    </h3>
                    <div className="w-full space-y-4 mb-6">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg 
                                         text-white placeholder-gray-400 focus:outline-none focus:border-gray-500
                                         transition-colors"
                            />
                            {emailError && <span className="text-red-400 p-2 text-sm">{emailError}</span>}
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg 
                                         text-white placeholder-gray-400 focus:outline-none focus:border-gray-500
                                         transition-colors"
                            />
                            {passError && <span className="text-red-400 text-sm">{passError}</span>}
                        </div>

                        {useRegister && (
                            <div>
                                <input
                                    type="password"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    placeholder="Repeat Password"
                                    className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg 
                                             text-white placeholder-gray-400 focus:outline-none focus:border-gray-500
                                             transition-colors"
                                />
                                {repeatPassError && <span className="text-red-400 text-sm">{repeatPassError}</span>}
                            </div>
                        )}

                        <button
                            className="py-2 w-full rounded-md border border-white/20 bg-white/5 
                                     hover:bg-white hover:text-black transition-all duration-500 text-lg font-neuethin"
                            onClick={useRegister ? handleRegister : handleLogin}>
                            {useRegister ? "Sign Up" : "Login"}
                        </button>
                    </div>
                    <div className="w-full flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gray-700"></div>
                        <span className="text-gray-400 font-light">or continue with</span>
                        <div className="flex-1 h-px bg-gray-700"></div>
                    </div>
                    <div className="w-full space-y-3">
                        <button
                            className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg
                                           hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2"
                            onClick={handleLoginGoogle}>
                            <Image
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                                width={20}
                                height={20}
                                alt="Google logo"
                            />
                            <span className="text-white font-light">Continue with Google</span>
                        </button>
                        <button
                            className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg
                                           hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2"
                            onClick={handleLoginX}>
                            <Image
                                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-white-icon.png"
                                width={20}
                                height={20}
                                alt="X logo"
                            />
                            <span className="text-white font-light">Continue with X</span>
                        </button>
                    </div>

                    <p className="mt-4 text-white">
                        {useRegister ? "Already have an account? " : "Not a user yet? "}
                        <span
                            className="underline cursor-pointer"
                            onClick={() => setUseRegister(!useRegister)}
                        >
                            {useRegister ? "Login" : "Register"}
                        </span>
                    </p>
                </div>
            </div>
            <ErrorModal
                isOpen={openError}
                onClose={() => setOpenError(false)}
                message={errorMessage}
                title={'Error'}
            />
        </div>
    );
};

export default LoginModal;
