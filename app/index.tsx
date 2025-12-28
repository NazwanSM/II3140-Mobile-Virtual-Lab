import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getSession } from '@/lib';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const session = await getSession();
        setIsAuthenticated(!!session);
        setLoading(false);
    };

    if (loading) {
        return (
        <View className="flex-1 items-center justify-center bg-foundation-yellow-normal">
            <ActivityIndicator size="large" color="#78350f" />
        </View>
        );
    }

    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href={"/(auth)/welcome" as const} />;
}
