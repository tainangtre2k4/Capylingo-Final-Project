import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout(){
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/(auth)" />;
    }
    return <Tabs/>
}