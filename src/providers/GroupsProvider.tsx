import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useApi} from "./ApiProvider";
import {AxiosError} from "axios";
import {Group} from "../types/group";
import {Alert, Snackbar} from "@mui/material";

type GroupsContextType = {
    getAllGroups: () => Promise<void>;
    groups: Group[] | null;
}

const GroupsContext = createContext<GroupsContextType>({} as GroupsContextType);

const GroupsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [error, setError] = useState<AxiosError | null>(null);
    const [groups, setGroups] = useState<Group[] | null>(null);
    const { groupsApi } = useApi();

    const getAllGroups = async () => {
        try {
            const groups = await groupsApi.getAllGroups();
            setGroups(groups);
        } catch (e) {
            console.log(e);
            setError(e as AxiosError);
        }
    }

    const memoValue = useMemo(() => ({
        getAllGroups,
        groups,
    }), [getAllGroups, groups]);

    return <GroupsContext.Provider value={memoValue}>
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
    </GroupsContext.Provider>
}

export const useGroups = () => useContext(GroupsContext);

export default GroupsProvider;