import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text} from 'react-native';
import {Stack} from 'expo-router';

const Tasks = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    headerTitle: "Tasks",
                }}
            />
            <View className="flex-1 px-4">
                <Text className="text-2xl font-bold text-primary-200">
                    Your Tasks
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default Tasks;