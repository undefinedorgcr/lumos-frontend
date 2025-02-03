/* eslint-disable @typescript-eslint/no-unused-vars */
import { X } from 'lucide-react';
import StarField from '@/components/animations/starfield';
import Image from 'next/image'
import { auth, provider } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, TwitterAuthProvider } from 'firebase/auth';
import { useState } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: (value: boolean) => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLoginGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Usuario logueado:", result.user);
            onClose(false);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    const handleLoginX = async () => {
        try {
            const result = await signInWithPopup(auth, new TwitterAuthProvider());
            console.log("Usuario logueado:", result.user);
            onClose(false);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    }


    const handleLogin = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario logueado:", result.user);
            onClose(false);
        } catch (error) {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Usuario creado:", result.user);
            onClose(false);
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
                        Login to Lumos
                    </h3>
                    <div className="w-full space-y-4 mb-6">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg 
                                     text-white placeholder-gray-400 focus:outline-none focus:border-gray-500
                                     transition-colors"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg 
                                     text-white placeholder-gray-400 focus:outline-none focus:border-gray-500
                                     transition-colors"
                        />
                        <button className="py-2 w-full rounded-md border border-white/20 bg-white/5 
                                         hover:bg-white hover:text-black transition-all duration-500 text-lg font-neuethin"
                                onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                    <div className="w-full flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gray-700"></div>
                        <span className="text-gray-400 font-light">or continue with</span>
                        <div className="flex-1 h-px bg-gray-700"></div>
                    </div>
                    <div className="w-full space-y-3">
                        <button className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg
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
                        <button className="w-full px-4 py-2 bg-[#222222] border border-gray-700 rounded-lg
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
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
