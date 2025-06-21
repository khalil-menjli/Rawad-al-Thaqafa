import React, { useEffect } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { Link, useRouter } from 'expo-router';
import InputField from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { icons, images } from '@/constants';
import useAuthStore from '@/store/useAuthStore';

// Simple form types
type FormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const { login, isLoading, error, isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      Alert.alert('Login Error', err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="relative w-full h-[250px]">
        <Image source={images.signCover} className="z-0 w-full h-[250px]" />
      </View>

      <View className="flex justify-between flex-1">
        <View className="mt-4">
          <Text className="text-3xl font-bold text-primary-200 text-center">Rawad al-Thaqafa</Text>
          <Text className="text-[#82a0b6] mt-2 text-lg text-center">Welcome back!</Text>
        </View>

        {/* Form */}
        <View className="px-5">
          {(['email', 'password'] as (keyof FormData)[]).map((name) => {
            const isPassword = name === 'password';
            return (
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <InputField
                      label={name === 'email' ? 'Email' : 'Password'}
                      placeholder={`Enter ${name}`}
                      icon={isPassword ? icons.lock : icons.email}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      secureTextEntry={isPassword}
                      textContentType={isPassword ? 'password' : 'emailAddress'}
                    />
                  </>
                )}
              />
            );
          })}

          <Link href="/forget-password" className="mt-4">
            <Text className="text-center text-general-200 text-lg">Forgot your password?</Text>
          </Link>

          {error && <Text className="text-red-500 text-center mt-2">{error}</Text>}

          <CustomButton
            title={isLoading ? 'Signing In...' : 'Sign In'}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="mt-6"
          />

          <Link href="/sign-up" className="mt-6">
            <Text className="text-center text-general-200 text-lg">
              Don't have an account? <Text className="text-primary-100">Sign Up</Text>
            </Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
