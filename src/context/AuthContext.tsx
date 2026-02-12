import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    referralCode?: string;
    accountStatus?: string;
    registrationDate?: string;
    hasWithdrawalPin?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    const { data } = await api.get('/user/profile');
                    // data.user has the fresh user object, data.account has account info
                    const updatedUser = { ...data.user, token };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } catch (err) {
                    console.error('Failed to restore auth session', err);
                    setUser(JSON.parse(storedUser));
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
    };

    const register = async (name: string, email: string, password: string, referralCode?: string) => {
        const { data } = await api.post('/auth/register', { name, email, password, referralCode });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const refreshProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await api.get('/user/profile');
                const updatedUser = { ...data.user, token };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } catch (err) {
                console.error('Failed to refresh profile', err);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
