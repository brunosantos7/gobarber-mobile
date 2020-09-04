/* eslint-disable camelcase */
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import {
    Container,
    Header,
    HeaderTitle,
    ProfileButton,
    ProviderAvatar,
    ProviderContainer,
    ProviderInfo,
    ProviderMeta,
    ProviderMetaText,
    ProviderName,
    ProvidersList,
    ProvidersListTitle,
    UserAvatar,
    UserName,
} from './styles';

export type Provider = {
    id: string;
    name: string;
    avatar_url: string;
};

const Dashboard: React.FC = () => {
    const { signOut, user } = useAuth();
    const { navigate } = useNavigation();
    const [providers, setProviders] = useState<Provider[]>([]);

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    const navigateToProfile = useCallback(() => {
        navigate('Profile');
    }, [navigate]);

    const navigateToCreateAppointment = useCallback(
        (providerId: string) => {
            navigate('CreateAppointment', { providerId });
        },
        [navigate],
    );

    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Bem vindo,
                    {'\n'}
                    <UserName>{user.name}</UserName>
                </HeaderTitle>

                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{ uri: user.avatar_url }} />
                </ProfileButton>
            </Header>

            <ProvidersList
                ListHeaderComponent={
                    <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
                }
                keyExtractor={provider => provider.id}
                data={providers}
                renderItem={({ item }) => (
                    <ProviderContainer
                        onPress={() => navigateToCreateAppointment(item.id)}
                    >
                        <ProviderAvatar source={{ uri: item.avatar_url }} />

                        <ProviderInfo>
                            <ProviderName>{item.name}</ProviderName>
                            <ProviderMeta>
                                <Icon
                                    name="calendar"
                                    size={14}
                                    color="#ff9000"
                                />

                                <ProviderMetaText>
                                    Segunda a sexta
                                </ProviderMetaText>
                            </ProviderMeta>

                            <ProviderMeta>
                                <Icon name="clock" size={14} color="#ff9000" />
                                <ProviderMetaText>8h as 18h</ProviderMetaText>
                            </ProviderMeta>
                        </ProviderInfo>
                    </ProviderContainer>
                )}
            />
        </Container>
    );
};

export default Dashboard;
