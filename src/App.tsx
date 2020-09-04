import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import 'react-native-gesture-handler';
import SlashScreen from 'react-native-splash-screen';
import AppProvider from './hooks/index';
import Routes from './routes';

const App: React.FC = () => {
    useEffect(() => {
        SlashScreen.hide();
    }, []);

    return (
        <NavigationContainer>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#312e38"
                translucent
            />
            <AppProvider>
                <View style={{ flex: 1 }}>
                    <Routes />
                </View>
            </AppProvider>
        </NavigationContainer>
    );
};

export default App;
