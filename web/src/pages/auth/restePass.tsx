import { useAuthStore } from "../../store/authStore";
import { useNavigate, useParams, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import { Lock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema for reset password
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const { resetPassword, error: serverError, isLoading } = useAuthStore();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordType) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    try {
      await resetPassword(token, data.password);
      toast.success("Password reset successfully, redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Error resetting password");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div
        
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100"
      >
        <div className="p-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-[#2e4057] mb-3">رواد الثقافة</h1>
            <h2 className="text-2xl text-[#82a0b6] mb-6">Rawad al-Thaqafa</h2>
            <h3 className="text-3xl font-bold text-[#2e4057]">Reset Password</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                icon={Lock}
                type="password"
                placeholder="New Password"
                className="text-lg"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Input
                icon={Lock}
                type="password"
                placeholder="Confirm New Password"
                className="text-lg"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-red-500 text-center text-lg">
                {serverError}
              </p>
            )}

            <button
             
              className="w-full py-4 px-6 bg-gradient-to-r from-[#ff7f50] to-[#ff6b6b] text-white font-bold rounded-xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Set New Password"}
            </button>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-[#ff7f50] font-medium hover:text-[#ff6b6b] transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
