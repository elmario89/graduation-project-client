import {ApiFactory} from "../services/api.factory";
import {createContext, FC, PropsWithChildren, useContext} from "react";

const api = ApiFactory.createApi();

const ApiContext = createContext<typeof api>(api);

const ApiProvider: FC<PropsWithChildren> = ({ children}) => (
    <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
)

export const useApi = () => useContext(ApiContext);

export default ApiProvider;