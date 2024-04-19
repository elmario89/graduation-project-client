import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useApi} from "./ApiProvider";
import {AxiosError} from "axios";
import {Group} from "../types/group";
import {Alert, Snackbar} from "@mui/material";
import {AddOrUpdateGroup} from "../types/add-or-update-group";

type GroupsContextType = {
    getAllGroups: () => Promise<void>;
    createGroup: (data: Omit<AddOrUpdateGroup, 'id'>) => Promise<Group | undefined>;
    updateGroup: (data: AddOrUpdateGroup) => Promise<Group | undefined>;
    getGroupById: (id: string) => Promise<Group | undefined>;
    groups: Group[] | null;
    deleteGroup: (id: string) => Promise<void>;
}

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const GroupsContext = createContext<GroupsContextType>({} as GroupsContextType);

const GroupsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] =
        useState<{ message: string, type: ErrorType } | null>(null);
    const [groups, setGroups] = useState<Group[] | null>(null);
    const { groupsApi } = useApi();

    const getAllGroups = async () => {
        try {
            const groups = await groupsApi.getAllGroups();
            setGroups(groups);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const createGroup = async (data: Omit<AddOrUpdateGroup, 'id'>) => {
        try {
            const group = await groupsApi.createGroup(data);
            setAlert({ message: 'Group has been created!', type: 'success' });
            return group;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const updateGroup = async (data: AddOrUpdateGroup) => {
        try {
            const group = await groupsApi.updateGroup(data);
            setAlert({ message: 'Group has been updated!', type: 'success' });
            return group;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getGroupById = async (id: string) => {
        try {
            return await groupsApi.getGroupById(id);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const deleteGroup = async (id: string) => {
        try {
            await groupsApi.deleteGroup(id);
            setAlert({ message: 'Group has been deleted!', type: 'success' });
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const memoValue = useMemo(() => ({
        getAllGroups,
        groups,
        createGroup,
        getGroupById,
        updateGroup,
        deleteGroup,
    }), [getAllGroups, groups, createGroup, getGroupById, deleteGroup]);

    return <GroupsContext.Provider value={memoValue}>
        <Snackbar open={!!alert} autoHideDuration={6000} onClose={() => setAlert(null)}>
            <Alert
                onClose={() => setAlert(null)}
                severity={alert?.type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alert?.message}
            </Alert>
        </Snackbar>
        {children}
    </GroupsContext.Provider>
}

export const useGroups = () => useContext(GroupsContext);

export default GroupsProvider;