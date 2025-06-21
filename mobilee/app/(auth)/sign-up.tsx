import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import InputField from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { icons } from '@/constants';
import useAuthStore from '@/store/useAuthStore';

// Define form data shape without Zod
type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpForm>({
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
    mode: 'onSubmit',
  });

  const { signup, isLoading, error } = useAuthStore();

  const onSubmit = async (data: SignUpForm) => {
    try {
      const response = await signup(data);
      if (response) {
        router.push('/verify-email');
      }
    } catch (err: any) {
      Alert.alert('Sign Up Error', err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-around">
      {/* Header */}
      <View className="items-center justify-center h-30">
        <Text className="text-3xl font-bold text-primary-200">Rawad al-Thaqafa</Text>
        <Text className="text-[#82a0b6] mt-2 text-lg">Join our cultural community!</Text>
      </View>

      {/* Form */}
      <View className="px-5">
        {(
          [
            { key: 'firstName', label: 'First Name', icon: icons.person, placeholder: 'Enter first name' },
            { key: 'lastName', label: 'Last Name', icon: icons.person, placeholder: 'Enter last name' },
            { key: 'email', label: 'Email', icon: icons.email, placeholder: 'Enter email', textContentType: 'emailAddress' },
            { key: 'password', label: 'Password', icon: icons.lock, placeholder: 'Enter password', secureTextEntry: true, textContentType: 'password' },
          ] as const
        ).map((field) => (
          <Controller
            key={field.key}
            control={control}
            name={field.key as keyof SignUpForm}
            render={({ field: { value, onChange, onBlur } }) => (
              <>
                <InputField
                  label={field.label}
                  placeholder={field.placeholder}
                  icon={field.icon}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry={field.secureTextEntry}
                  textContentType={field.textContentType as any}
                />
                {errors[field.key as keyof SignUpForm] && (
                  <Text className="text-red-500 mt-1">
                    {errors[field.key as keyof SignUpForm]?.message}
                  </Text>
                )}
              </>
            )}
          />
        ))}

        {error && <Text className="text-red-500 text-center mt-2">{error}</Text>}

        <CustomButton
          title={isSubmitting || isLoading ? 'Signing Up...' : 'Sign Up'}
          onPress={() => handleSubmit(onSubmit)()}
          disabled={isSubmitting || isLoading}
          className="mt-6"
        />

        <Text className="text-center text-general-200 text-lg mt-6">
          Already have an account?{' '}
          <Text onPress={() => router.push('/sign-in')} className="text-primary-100">
            Log In
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
