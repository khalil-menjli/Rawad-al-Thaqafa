import React from "react";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signInType } from "../../validations/signInSchema";
import { useNavigate } from "react-router-dom";

const SignInPage: React.FC = () => {
  const { login, isLoading, error: serverError } = useAuthStore() as {
    login: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
  };
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signInType>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: signInType) => {
    await login(data.email, data.password);
    navigate("/partners");

  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="p-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-[#2e4057] mb-3">رواد الثقافة</h1>
            <h2 className="text-2xl text-[#82a0b6] mb-6">Rawad al-Thaqafa</h2>
            <h3 className="text-3xl font-bold text-[#2e4057]">Sign In</h3>
            <p className="text-gray-500 mt-3 text-lg">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              icon={Mail}
              type="email"
              placeholder="info@gmail.com"
              {...register("email")}
              className="text-lg"
              error={errors.email?.message}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="text-lg"
              error={errors.password?.message}
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-[#ff7f50] text-sm font-medium hover:text-[#ff6b6b] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {serverError && (
              <p className="text-red-500 font-medium text-lg">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#ff7f50] to-[#ff6b6b] text-white font-bold rounded-xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading || isSubmitting ? (
                <Loader className="w-8 h-8 animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}

            </button>

            <p className="text-center mt-8 text-gray-600 text-lg">
              Don’t have an account?{' '}
              <Link
                to="/signup"
                className="text-[#ff7f50] font-medium hover:text-[#ff6b6b] transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;