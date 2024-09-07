import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Tabs, useSegments } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout(){
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)" />;
    }
    const segment = useSegments();

    const page = segment.join('/')
    const pagesToHideTabBar = ['vocabulary/type1', 'skillcheck/reading', "skillcheck/listening"]

    const checkPageToHideTabBar = (): boolean => {
        for (const s of pagesToHideTabBar)
          if (page.includes(s))
            return true;
        return false;
      };
    return(
        <Tabs initialRouteName="(learn)">
            <Tabs.Screen
                name="(learn)"
                options={{
                    headerTransparent: true,
                    headerTitle: '',
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="book-open-page-variant-outline" size={size} color={color} />,
                    tabBarLabel: 'Learn',
                    headerShown: false,
                    tabBarStyle: { display: checkPageToHideTabBar() ? 'none' : 'flex' }
                }}
            />
            <Tabs.Screen
                name="(dictionary)"
                options={{
                    tabBarIcon: ({ color, size }) => <Ionicons name="file-tray-full" size={size} color={color} />,
                    tabBarLabel: 'Dictionary',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="(resources)"
                options={{
                    headerTransparent: true,
                    headerTitle: '',
                    tabBarIcon: ({ color, size }) => <Ionicons name="folder-open-outline" size={size} color={color} />,
                    tabBarLabel: 'Resources',
                }}
            />

            <Tabs.Screen
                name="(profile)"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                    tabBarLabel: 'My Profile',
                }}
            />
    </Tabs>
    )
}
