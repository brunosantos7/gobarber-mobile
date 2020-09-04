import React from 'react';
import { AuthProvider } from './AuthContext';

const SystemContexts: React.FC = ({ children }) => {
    return <AuthProvider>{children}</AuthProvider>;
};

export default SystemContexts;
