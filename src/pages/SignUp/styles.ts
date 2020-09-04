import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Form as UnformForm } from '@unform/mobile';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Title = styled.Text`
    font-size: 24px;
    font-family: 'RobotoSlab-Medium';
    color: #f4ede8;

    margin: 64px 0px 24px;
`;

export const BackToSignIn = styled.TouchableOpacity`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top-width: 1px;
    border-color: #232129;
    padding: 16px 0 ${16 + getBottomSpace()}px;

    background: #312e38;

    justify-content: center;
    align-items: center;

    flex-direction: row;
`;

export const BackToSignInText = styled.Text`
    color: #fff;
    font-size: 18px;
    font-family: 'RobotoSlab-Regular';
    margin-left: 16px;
`;

export const Form = styled(UnformForm)`
    width: 100%;
`;