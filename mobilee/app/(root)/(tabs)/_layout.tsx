import React from "react";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { icons } from "@/constants";
import GlobalProvider from "@/lib/GlobalContext";

interface TabIconProps {
  source: any;
  focused: boolean;
}

const TabIcon = ({ source, focused }: TabIconProps) => (
  <View className="flex items-center justify-center w-14 h-14">
    <View
      className="w-12 h-12 rounded-full items-center justify-center"
      style={{ backgroundColor: focused ? "#ff6b6b" : "transparent" }}
    >
      <Image
        source={source}
        className="w-6 h-6"
        style={{ tintColor: focused ? "white" : "#82a0b6" }}
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
    <GlobalProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            paddingBottom: insets.bottom + 33,
            height: 70,
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "rgba(255,127,80,0.1)",
            borderRadius: 24,
            paddingHorizontal: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
            position: "absolute",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon source={icons.home} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon source={icons.search} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon source={icons.trophy} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="saves"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon source={icons.email} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => <TabIcon source={icons.profile} focused={focused} />,
          }}
        />
      </Tabs>
    </GlobalProvider>
  );
}
