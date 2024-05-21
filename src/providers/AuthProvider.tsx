import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {Auth} from "../types/auth";
import {useApi} from "./ApiProvider";
import {StorageService} from "../services/storage.service";
import {useNavigate} from "react-router-dom";
import {Alert, Snackbar} from "@mui/material";
import {AxiosError} from "axios";
import {User} from "../types/user";
import {UserRole} from "../enums/user-role";
import {jwtDecode} from "jwt-decode";

type AuthContextType = {
    user: User | null;
    signIn: (data: Auth) => Promise<void>;
    signOut: () => void;
    authenticated: boolean;
}

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] =
        useState<{ message: string, type: ErrorType } | null>(null);
    const storageService = new StorageService();
    const [error, setError] = useState<AxiosError | null>(null);
    const [user, setUser] =
        useState<User | null>(
            storageService.getItem<string>('token')
                ? jwtDecode<User>(storageService.getItem<string>('token'))
                : null
        );
    let navigate = useNavigate();
    const [authenticated, setAuthenticated] =
        useState<boolean>(!!storageService.getItem('token'));
    const { authApi } = useApi();

    const signIn = async (data: Auth) => {
        
        try {
            const token = await authApi.signIn(data);
            if (token) {
                const decodedUser = jwtDecode<User>(token);
                setUser(decodedUser);
                const { role } = decodedUser;
                setAuthenticated(true);

                if (role) {
                    switch (role) {
                        case UserRole.Admin: {
                            return navigate('/admin/groups');
                        }
                        case UserRole.Student: {
                            return navigate('/student');
                        }
                        case UserRole.Teacher: {
                            return navigate('/teacher');
                        }
                    }
                }
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                 // @ts-ignore
                 setAlert({ message: e.response.data.message, type: 'error' });
            }
        }
    }

    const signOut = () => {
        storageService.clearItem('token');
        navigate('/sign-in');
    }

    const memoValue = useMemo(() => ({
        signIn,
        authenticated,
        user,
        signOut,
    }), [signIn, signOut, authenticated, user]);

    return <AuthContext.Provider value={memoValue}>
        <Snackbar open={!!alert} autoHideDuration={6000} onClose={() => setAlert(null)}>
            <Alert
                onClose={() => setAlert(null)}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alert?.message}
            </Alert>
        </Snackbar>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;