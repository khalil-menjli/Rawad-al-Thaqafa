import { Stack } from "expo-router";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(pages)" options={{ headerShown: false }} />
            <Stack.Screen name="offer/[id]" options={{ headerShown: false }} />

        </Stack>
    );
};

export default Layout;