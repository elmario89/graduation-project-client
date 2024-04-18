import {createContext, FC, PropsWithChildren, useContext, useMemo} from "react";
import {Auth} from "../types/auth";

type AuthContextType = {
    signIn: (data: Auth) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const signIn = (data: Auth) => {
        console.log(data);
    }

    const memoValue = useMemo(() => ({
        signIn,
    }), [signIn]);

    return <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;