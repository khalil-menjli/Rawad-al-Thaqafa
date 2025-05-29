import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpType, signUpSchema } from '@/validation/signUpSchema';
import { Link } from 'expo-router';
import InputField from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import {icons, images} from '@/constants';
const SignIn = () => {
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
                    {[
                        { name: 'email', label: 'Email', icon: icons.email, placeholder: 'Enter email', textContentType: 'emailAddress' },
                        { name: 'password', label: 'Password', icon: icons.lock, placeholder: 'Enter password', secureTextEntry: true, textContentType: 'password' },
                    ].map((field) => (
                        <Controller
                            key={field.name}
                            control={control}
                            name={field.name as keyof SignUpType}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <>
                                    <InputField
                                        label={field.label}
                                        placeholder={field.placeholder}
                                        icon={field.icon}
                                        value={value as string}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        secureTextEntry={field.secureTextEntry}
                                        textContentType={field.textContentType as any}
                                    />
                                    {errors[field.name as keyof SignUpType] && (
                                        <Text className="text-red-500 mt-1">
                                            {errors[field.name as keyof SignUpType]?.message}
                                        </Text>
                                    )}
                                </>
                            )}
                        />
                    ))}
                    <Link href="/forget-password" className="mt-6">
                        <Text className="text-center text-general-200 text-lg">
                            Already have an account?{' '}
                            <Text className="text-primary-100">forget Passowrd</Text>
                        </Text>
                    </Link>

                    <CustomButton
                        title={isSubmitting ? 'Submitting...' : 'Sign In'}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="mt-6"
                    />

                    <Link href="/sign-up" className="mt-6">
                        <Text className="text-center text-general-200 text-lg">
                            Dont have an account?{' '}
                            <Text className="text-primary-100">Sing Up</Text>
                        </Text>
                    </Link>
                </View>
            </View>
        </View>
    );
};


export default SignIn;