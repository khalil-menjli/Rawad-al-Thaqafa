import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Link, router} from 'expo-router';
import {icons} from '@/constants';
import CustomButton from '@/components/CustomButton';

const Profile = () => {
    const handleLogout = () => {
        // Add logout logic here
        router.replace('/(auth)/sign-in');
    };

    return (
        <SafeAreaView className="flex-1 h-full bg-white">
            <ScrollView className="flex-1">
                {/* Header Section */}
                <View className="items-center py-6">
                    <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                        <Image
                            source={icons.person}
                            className="w-12 h-12"
                        />
                    </View>
                    <Text className="text-xl font-bold mt-4 text-primary-200">John Doe</Text>
                    <Text className="text-general-200">john.doe@example.com</Text>
                </View>

                {/* Profile Options */}
                {/*<View className="px-4 mt-6">
                    {[
                        {title: 'Personal Information', icon: icons.person, href: '/edit-profile'},
                        {title: 'Settings', icon: icons.settings, href: '/settings'},
                        {title: 'Help Center', icon: icons.help, href: '/help'},
                    ].map((item, index) => (
                        <Link href={item.href} key={index} asChild>
                            <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
                                <Image source={item.icon} className="w-6 h-6 mr-4"/>
                                <Text className="text-lg text-general-200">{item.title}</Text>
                            </TouchableOpacity>
                        </Link>
                    ))}
                </View>*/}

                <View className="px-4 mt-6">
                    <CustomButton
                        title="Logout"
                        onPress={handleLogout}
                        bgVariant="secondary"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
