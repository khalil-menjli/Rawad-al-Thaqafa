import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import Input from "../components/ui/Input";
import { User, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const EditProfilePage = () => {
    const { checkAuth, user, updateProfile, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        console.log("zzz", user)
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || ""
            }));
        }
    }, [user]);
    

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        const updateData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            ...(formData.newPassword && {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            })
        };

        try {
            await updateProfile(updateData);
            // Clear password fields after successful update
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
            toast.success("Profile updated successfully!");
        } catch (error:any) {
            toast.error(error.message || "Error updating profile");
        }
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                        <h3 className="text-3xl font-bold text-[#2e4057]">Edit Profile</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                icon={User}
                                name="firstName"
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="text-lg"
                            />
                            <Input
                                icon={User}
                                name="lastName"
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="text-lg"
                            />
                        </div>

                        <div className="space-y-6 pt-4 border-t border-gray-200">
                            <h4 className="text-[#2e4057] font-semibold text-lg">Change Password</h4>
                            
                            <Input
                                icon={Lock}
                                name="currentPassword"
                                type="password"
                                placeholder="Current Password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="text-lg"
                            />
                            
                            <Input
                                icon={Lock}
                                name="newPassword"
                                type="password"
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="text-lg"
                            />
                            
                            <Input
                                icon={Lock}
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="text-lg"
                            />
                        </div>

                        {error && <p className="text-red-500 text-center text-lg">{error}</p>}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 px-6 bg-gradient-to-r from-[#ff7f50] to-[#ff6b6b] text-white font-bold rounded-xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </motion.button>

                        <div className="mt-8 text-center">
                            <Link 
                                to="/dashboard" 
                                className="text-[#ff7f50] font-medium hover:text-[#ff6b6b] transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                Back to Dashboard
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EditProfilePage;