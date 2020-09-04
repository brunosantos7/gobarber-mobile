import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../hooks/AuthContext';

const Routes: React.FC = () => {
    const { user, loading, signOut } = useAuth();

    useEffect(() => {
        signOut();
    }, [signOut]);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color="#999" />
            </View>
        );
    }
    return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
