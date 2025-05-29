import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import Input from "../../components/ui/Input";
import {
  Loader,
  Lock,
  Mail,
  User,
  Check,
  Globe,
  MapPin,
  Building,
  FileText,
  Upload,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, signUpType } from "../../validations/signUpSchema";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, error: serverError, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<signUpType>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const selectedCategory = watch("category");
  const imageFile = watch("imageFile");

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleFiles = (file: File) => {
    setPreviewImage(URL.createObjectURL(file));
    setValue("imageFile", file, { shouldDirty: true, shouldValidate: true });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFiles(e.dataTransfer.files[0]);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  // Open the hidden file input
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Click on the dashed wrapper
  const onWrapperClick = () => {
    openFileDialog();
  };

  // Click on inner buttons
  const onChangeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openFileDialog();
  };

  const onSubmit = async (data: signUpType) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("role", "partner");

    formData.append("businessName", data.businessName);
    formData.append("location", data.location);
    formData.append("websiteUrl", data.websiteUrl);

    formData.append("description", data.description);
    formData.append("categories", data.category ?? "");

    if (data.imageFile) {
      formData.append("filename", data.imageFile);
    }

    try {
      await signup(formData);
      navigate("/verify-email");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div
        className="flex w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ minHeight: "680px", maxHeight: "100vh" }}
      >
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-[#2e4057] to-[#1a2a3a] text-white p-8 flex-col justify-center items-center">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold mb-4">رواد الثقافة</h1>
            <h2 className="text-2xl font-light">Rawad al-Thaqafa</h2>
          </div>
          <div className="space-y-6 text-center">
            <p className="text-xl">Join our cultural community as a Partner</p>
            <div className="flex flex-col gap-5 mt-6">
              {["Showcase your cultural business", "Connect with cultural enthusiasts", "Promote your cultural events"].map((txt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-2 bg-opacity-20 rounded-full">
                    {idx === 1 ? <Check className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                  </div>
                  <span className="text-lg">{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-2/3 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold text-[#2e4057]">Create Partner Account</h3>
            <div className="lg:hidden text-right">
              <h1 className="text-xl font-bold text-[#2e4057]">رواد الثقافة</h1>
              <h2 className="text-sm text-[#82a0b6]">Rawad al-Thaqafa</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information & Business Basics */}
            <div className="space-y-5">
              <h4 className="text-xl font-medium text-[#2e4057]">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input icon={User} placeholder="First Name" {...register("firstName")} error={errors.firstName?.message} />
                <Input icon={User} placeholder="Last Name" {...register("lastName")} error={errors.lastName?.message} />
              </div>
              <Input icon={Mail} placeholder="Email Address" {...register("email")} error={errors.email?.message} />
              <Input icon={Lock} placeholder="Password" type="password" {...register("password")} error={errors.password?.message} />
              

              <h4 className="text-xl font-medium text-[#2e4057] pt-4">Business Basics</h4>
              <Input icon={Building} placeholder="Business Name" {...register("businessName")} error={errors.businessName?.message} />
              <Input icon={MapPin} placeholder="Location" {...register("location")} error={errors.location?.message} />
              <Input icon={Globe} placeholder="Website URL" type="url" {...register("websiteUrl")} error={errors.websiteUrl?.message} />
            </div>

            {/* Business Details */}
            <div className="space-y-5">
              <h4 className="text-xl font-medium text-[#2e4057]">Business Details</h4>

              <div className="space-y-3">
                <label className="block text-gray-700 text-base font-medium">How would you define your business?</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Books", "Museums", "Library", "Cinema"].map((cat) => (
                    <label key={cat} className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all text-base ${selectedCategory === cat ? "border-[#ff7f50] bg-orange-50 text-[#ff7f50] font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <input type="radio" value={cat} {...register("category")} className="sr-only" />
                      {cat}
                    </label>
                  ))}
                </div>
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>

              <div className="relative">
                <FileText className="w-5 h-5 absolute left-4 top-4 text-gray-400" />
                <textarea placeholder="Business Description" rows={4} {...register("description")} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff7f50] transition-all" />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 text-base font-medium">Business Image</label>
                <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} onClick={onWrapperClick} className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${dragActive ? "border-[#ff7f50] bg-orange-50" : "border-gray-300 hover:border-gray-400"}`}>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInputChange} />
                  {previewImage ? (
                    <>
                      <img src={previewImage} alt="Preview" className="mx-auto h-32 object-contain rounded-lg" />
                      <p className="text-sm text-gray-500">{imageFile?.name} <button type="button" onClick={onChangeClick} className="text-[#ff7f50] hover:underline">Change</button></p>
                    </>
                  ) : (
                    <div className="space-y-2 py-6">
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-base text-gray-600"><span className="text-[#ff7f50] font-medium">Drop image</span> or <button type="button" onClick={onChangeClick} className="text-[#ff7f50] font-medium">click to upload</button></p>
                    </div>
                  )}
                </div>
                {errors.imageFile && <p className="text-red-500 text-sm">{errors.imageFile.message}</p>}
              </div>

              {serverError && <div className="py-3 px-4 bg-red-50 border border-red-200 rounded-xl"><p className="text-red-500 text-base font-medium">{serverError}</p></div>}
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" disabled={isLoading || isSubmitting} className="w-full py-4 px-6 bg-gradient-to-r from-[#ff7f50] to-[#ff6b6b] text-white font-bold rounded-xl text-lg shadow-lg transition-all duration-300 disabled:opacity-50 hover:shadow-xl active:translate-y-0.5">
                {isLoading || isSubmitting ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Create Partner Account"}
              </button>
              <p className="text-center text-base text-gray-600 mt-4">Already have an account? <Link to="/login" className="text-[#ff7f50] font-medium hover:text-[#ff6b6b]">Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
