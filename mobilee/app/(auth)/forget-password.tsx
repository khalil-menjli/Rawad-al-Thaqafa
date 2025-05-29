import { SafeAreaView } from "react-native-safe-area-context";
import {Image, Text, View} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {signUpSchema, SignUpType} from "@/validation/signUpSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {icons, images} from "@/constants";
import InputField from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {Link} from "expo-router";
import React from "react";
const ForgetPassword = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpType>({
        resolver: zodResolver(signUpSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data: SignUpType) => {
        console.log('Validated data:', data);
        // API hookup here
    };

    return (
        <View className="flex-1 bg-white  ">
            {/* Header */}
            <View className="relative w-full h-[250px]">
                <Image source={images.signCover} className="z-0 w-full h-[250px]" />
            </View>
            <View className="flex justify-between "  >
                <View>
                    <Text className="text-3xl font-bold text-primary-200 text-center">Rawad al-Thaqafa</Text>
                    <Text className="text-[#82a0b6] mt-2 text-lg text-center"> Welcome back !</Text>
                </View>
                {/* Form */}
                <View className="px-5">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <View className="mb-4">
                                <InputField
                                    label="Email"
                                    placeholder="you@example.com"
                                    icon={icons.email}
                                    value={value as string}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    textContentType="emailAddress"
                                />
                                {errors.email && (
                                    <Text className="text-red-500 mt-1 text-sm">
                                        {errors.email.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    />

                    <CustomButton
                        title={isSubmitting ? 'Submitting...' : 'Submit'}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="mt-2"
                    />
                </View>

                    <Link href="/sign-in" className="mt-6">
                        <Text className="text-center text-general-200 text-lg">
                            Remembered your password?{' '}
                            <Text className="text-primary-100">Login</Text>
                        </Text>
                    </Link>
                </View>
            </View>

    );
};
export default ForgetPassword;