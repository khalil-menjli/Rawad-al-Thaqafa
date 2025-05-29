import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { icons } from "@/constants";

interface TabIconProps {
    source: ImageSourcePropType;
    focused: boolean;
}

const TabIcon = ({ source, focused }: TabIconProps) => (
    <View className="flex items-center justify-center w-14 h-14">
        <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{
                backgroundColor: focused ? "#ff6b6b" : "transparent",
            }}
        >
            <Image
                source={source}
                className="w-6 h-6"
                style={{
                    tintColor: focused ? "white" : "#82a0b6",
                }}
                resizeMode="contain"
            />
        </View>
        {focused && (
            <View
                className="w-1 h-1 rounded-full mt-1"
                style={{ backgroundColor: "#ff6b6b" }}
            />
        )}
    </View>
);

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#ff6b6b",
                tabBarInactiveTintColor: "#ff6b6b",
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "white",
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255, 127, 80, 0.1)",
                    borderRadius: 24,
                    marginBottom: Math.max(insets.bottom - 10, 10),
                    marginHorizontal: 16,
                    height: 70,
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingHorizontal: 20,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                    elevation: 8,
                    position: "absolute",

                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.home} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.search} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: "Tasks",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.close} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="saves"
                options={{
                    title: "Saves",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.email} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon source={icons.profile} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}