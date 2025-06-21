import { icons, images } from "@/constants";
import { router } from "expo-router";
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

const Profile = () => {

  const handleLogout = () => {
        // Add logout logic here
        router.replace('/(auth)/sign-in');
    };

  return (
    <SafeAreaView className="h-full bg-red-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
            <Text className="text-xl font-rubik-bold">Profile</Text>
            <TouchableOpacity >
                <Image source={icons.bell} className="size-5" />
            </TouchableOpacity>

        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
            //TODO : CHANGE THE 
              source={images.signCover}
              className="size-44 relative rounded-full"
            />
            

            <Text className="text-2xl font-rubik-bold mt-2"> khalil</Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="My Reservations" />
          <SettingsItem icon={icons.wallet} title="My Tasks" />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          <SettingsItem icon={icons.person}
             onPress={() => router.replace('../(pages)/UserProfile')}
              title="Profile" />
          <SettingsItem icon={icons.bell} title="Notifications" />
        </View>
        

        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;