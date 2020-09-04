/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import React, { useCallback, useRef } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    View,
} from 'react-native';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker'
import Button from '../../components/button';
import Input from '../../components/input';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import {
    Container,
    Form,
    Title,
    UserAvatarButton,
    UserAvatar,
    BackButton,
} from './styles';
import { useAuth } from '../../hooks/AuthContext';

type ProfileFormData = {
    name: string;
    email: string;
    password: string;
    old_password: string;
    password_confirmation: string;
};

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);

    const emailInputReference = useRef<TextInput>(null);
    const oldPasswordInputReference = useRef<TextInput>(null);
    const passwordInputReference = useRef<TextInput>(null);
    const passwordConfirmationInputReference = useRef<TextInput>(null);

    const handleFormSubmit = useCallback(
        async (data: ProfileFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome é um campo obrigatório.'),
                    email: Yup.string()
                        .email('Entre com um email válido.')
                        .required('Email é um campo obrigatório.'),
                    old_password: Yup.string(),
                    password: Yup.string().when('old_password', {
                        is: val => !!val.length,
                        then: Yup.string().required('Campo obrigatório'),
                        otherwise: Yup.string(),
                    }),
                    password_confirmation: Yup.string()
                        .when('old_password', {
                            is: val => !!val.length,
                            then: Yup.string().required('Campo obrigatório'),
                            otherwise: Yup.string(),
                        })
                        .oneOf(
                            [Yup.ref('password'), undefined],
                            'Senhas nao batem',
                        ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const {
                    name,
                    email,
                    password,
                    old_password,
                    password_confirmation,
                } = data;

                const formData = {
                    email,
                    name,
                    ...(old_password
                        ? {
                            old_password,
                            password,
                            password_confirmation,
                        }
                        : {}),
                };

                const response = await api.put('/profile', formData);

                updateUser(response.data);

                Alert.alert(
                    'Perfil atualizado com sucesso.',
                );

                navigation.goBack();
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    return;
                }

                Alert.alert(
                    'Erro na atualização do perfil',
                    'Algo errado com o seus dados. Tente novamente.',
                );
            }
        },
        [navigation, updateUser],
    );

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleUpdateAvatar = useCallback(() => {
        ImagePicker.showImagePicker({
            title: "Selecione um avatar",
            cancelButtonTitle: "Cancelar",
            takePhotoButtonTitle: "Tirar foto",
            chooseFromLibraryButtonTitle: "Escolha da galeria"
        }, response => {

            if (response.didCancel) {
                return;
            }

            if (response.error) {
                Alert.alert("Erro ao atualizar o seu avatar")
                return;
            }

            const data = new FormData();

            data.append("avatar", {
                type: "image/jpeg",
                name: `${user.id}.jpg`,
                uri: response.uri,
            });

            api.patch("users/avatar", data).then(apiResponse => {
                updateUser(apiResponse.data);
            })
        })
    }, [updateUser, user.id])

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                enabled
            >
                <ScrollView
                    contentContainerStyle={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Container>
                        <BackButton onPress={handleGoBack}>
                            <Icon
                                name="chevron-left"
                                size={30}
                                color="#999591"
                            />
                        </BackButton>

                        <UserAvatarButton onPress={handleUpdateAvatar}>
                            <UserAvatar source={{ uri: user.avatar_url }} />
                        </UserAvatarButton>
                        <View>
                            <Title>Meu perfil</Title>
                        </View>

                        <Form initialData={user} ref={formRef} onSubmit={handleFormSubmit}>
                            <Input
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                autoCapitalize="words"
                                autoCorrect
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailInputReference.current?.focus();
                                }}
                            />
                            <Input
                                ref={emailInputReference}
                                name="email"
                                icon="mail"
                                placeholder="Email"
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    oldPasswordInputReference.current?.focus();
                                }}
                            />
                            <Input
                                ref={oldPasswordInputReference}
                                name="old_password"
                                icon="lock"
                                placeholder="Senha Atual"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputReference.current?.focus();
                                }}
                                containerStyle={{ marginTop: 16 }}
                            />
                            <Input
                                ref={passwordInputReference}
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordConfirmationInputReference.current?.focus();
                                }}
                            />
                            <Input
                                ref={passwordConfirmationInputReference}
                                name="password_confirmation"
                                icon="lock"
                                placeholder="Confirmação da senha"
                                secureTextEntry
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}
                            />

                            <Button
                                onPress={() => {
                                    formRef.current?.submitForm();
                                }}
                            >
                                Confirmar mudanças
                            </Button>
                        </Form>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default Profile;
