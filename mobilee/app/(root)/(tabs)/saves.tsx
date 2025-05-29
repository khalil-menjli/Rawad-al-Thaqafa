import React from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Saves = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 px-4">
                <Text className="text-2xl font-bold text-primary-200 my-4">
                    Saved Items
                </Text>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-general-200 text-lg">
                        No saved items yet
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Saves;
