/* eslint-disable camelcase */
import AsyncStorage from '@react-native-community/async-storage';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import api from '../services/api';

type User = {
    id: string;
    avatar_url: string;
    name: string;
    email: string;
};

interface AuthState {
    token: string;
    user: User;
}

interface AuthCredentialsData {
    email: string;
    password: string;
}

interface AuthContextData {
    user: User;
    signIn(credentials: AuthCredentialsData): void;
    signOut(): void;
    loading: boolean;
    updateUser(user: User): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [authenticationData, setAuthenticationData] = useState(
        {} as AuthState,
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData(): Promise<void> {
            const [user, token] = await AsyncStorage.multiGet([
                '@GoBarber:user',
                '@GoBarber:token',
            ]);
            if (token[1] && user[1]) {
                setAuthenticationData({
                    token: token[1],
                    user: JSON.parse(user[1]),
                });

                api.defaults.headers.authorization = `Bearer ${token[1]}`;
            }

            setLoading(false);
        }
        loadStorageData();
    }, []);

    const signIn = useCallback(async ({ email, password }) => {
        const response = await api.post('sessions', { email, password });

        const { user, token } = response.data;

        await AsyncStorage.multiSet([
            ['@GoBarber:user', JSON.stringify(user)],
            ['@GoBarber:token', token],
        ]);

        api.defaults.headers.authorization = `Bearer ${token}`;

        setAuthenticationData({ user, token });
    }, []);

    const signOut = useCallback(async () => {
        await AsyncStorage.multiRemove(['@GoBarber:user', '@GoBarber:token']);

        setAuthenticationData({} as AuthState);
    }, []);

    const updateUser = useCallback(
        async (user: User) => {
            await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

            setAuthenticationData({
                token: authenticationData.token,
                user: {
                    ...user,
                },
            });
        },
        [setAuthenticationData, authenticationData.token],
    );

    return (
        <AuthContext.Provider
            value={{
                user: authenticationData.user,
                signIn,
                signOut,
                loading,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = (): AuthContextData => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('The AuthProvider must be wrapping this component.');
    }

    return authContext;
};

export { useAuth, AuthProvider };
