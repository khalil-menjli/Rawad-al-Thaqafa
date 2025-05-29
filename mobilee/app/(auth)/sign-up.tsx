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

const SignUp = () => {
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
        <SafeAreaView className="flex-1 bg-white justify-around ">
            {/* Header */}
            <View className="items-center justify-center h-30">
                <Text className="text-3xl font-bold text-primary-200">Rawad al-Thaqafa</Text>

                <Text className="text-[#82a0b6] mt-2 text-lg">
                    Join our cultural community!
                </Text>
            </View>

            {/* Form */}
            <View className="px-5">
                {[
                    { name: 'firstName', label: 'First Name', icon: icons.person, placeholder: 'Enter first name' },
                    { name: 'lastName', label: 'Last Name', icon: icons.person, placeholder: 'Enter last name' },
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

                <CustomButton
                    title={isSubmitting ? 'Submitting...' : 'Sign Up'}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="mt-6"
                />

                <Link href="/(root)/(tabs)/search" className="mt-6">
                    <Text className="text-center text-general-200 text-lg">
                        Already have an account?{' '}
                        <Text className="text-primary-100">Log In</Text>
                    </Text>
                </Link>
            </View>
        </SafeAreaView>
    );
};

export default SignUp;
