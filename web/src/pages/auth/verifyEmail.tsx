import { motion } from "framer-motion";
import { SetStateAction, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import Input from "../../components/ui/Input";
import { ArrowLeft, Loader, Lock, Check } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
    const [code, setCode] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    const { isLoading, verifyEmail } = useAuthStore();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await verifyEmail(Number(code));
            setIsVerified(true);
            toast.success("Email verified successfully!");
        } catch (error:any) {
            toast.error(error.message || "Error verifying email");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100"
            >
                <div className="p-10">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-bold text-[#2e4057] mb-3">رواد الثقافة</h1>
                        <h2 className="text-2xl text-[#82a0b6] mb-6">Rawad al-Thaqafa</h2>
                        <h3 className="text-3xl font-bold text-[#2e4057]">Verify Email</h3>
                    </div>

                    {!isVerified ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-gray-600 mb-6 text-center text-lg">
                                Enter the 6-digit verification code sent to your email address.
                            </p>
                            
                            <Input
                                icon={Lock}
                                type="number"
                                placeholder="Verification Code"
                                value={code}
                                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setCode(e.target.value)}
                                className="text-lg"
                                required
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 px-6 bg-gradient-to-r from-[#ff7f50] to-[#ff6b6b] text-white font-bold rounded-xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                                type="submit"
                            >
                                {isLoading ? <Loader className="w-8 h-8 animate-spin mx-auto" /> : "Verify Email"}
                            </motion.button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-20 h-20 bg-[#ff7f50] rounded-full flex items-center justify-center mx-auto"
                            >
                                <Check className="h-10 w-10 text-white" />
                            </motion.div>
                            <p className="text-gray-600 text-lg">
                                Your email has been successfully verified!
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link 
                            to="/login" 
                            className="text-[#ff7f50] font-medium hover:text-[#ff6b6b] transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmailPage;