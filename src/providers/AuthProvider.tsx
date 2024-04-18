import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {Auth} from "../types/auth";
import {useApi} from "./ApiProvider";
import {StorageService} from "../services/storage.service";
import {useNavigate} from "react-router-dom";
import {Alert, Snackbar} from "@mui/material";
import {AxiosError} from "axios";

type AuthContextType = {
    signIn: (data: Auth) => Promise<void>;
    authenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [error, setError] = useState<AxiosError | null>(null);
    const storageService = new StorageService();
    let navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState<boolean>(!!storageService.getItem('token'));
    const { auth } = useApi();

    const signIn = async (data: Auth) => {
        try {
            const token = await auth.signIn(data);
            if (token) {
                setAuthenticated(true);
                navigate('/');
            }
        } catch (e) {
            console.log(e);
            setError(e as AxiosError);
        }
    }

    const memoValue = useMemo(() => ({
        signIn,
        authenticated,
    }), [signIn, authenticated]);

    return <AuthContext.Provider value={memoValue}>
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert
                onClose={() => setError(null)}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {error?.message}
            </Alert>
        </Snackbar>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;