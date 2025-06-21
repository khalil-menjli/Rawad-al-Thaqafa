import CustomButton from "@/components/CustomButton";
import InputField from "@/components/CustomInput";
import { icons, images } from "@/constants";
import { signUpSchema, SignUpType } from "@/validation/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

const UserProfile = () => {

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
    <SafeAreaView className="h-full bg-red-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
            <TouchableOpacity onPress={() => {
              router.replace("../(tabs)/profile")         

            }}>
                <Image source={icons.backArrow} className="size-10 " />
            </TouchableOpacity>

        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
            //TODO : CHANGE THE 
              source={images.signCover}
              className="size-44 relative rounded-full"
            />
          </View>
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
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
        </View>
        

        <CustomButton
          title={"Save"}
          onPress={() =>
            router.replace("/(auth)/sign-up")         
            }
          className="w-11/12 mt-10 mb-5"
        />
              
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;