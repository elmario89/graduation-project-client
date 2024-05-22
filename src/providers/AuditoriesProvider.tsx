import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useApi} from "./ApiProvider";
import {AxiosError} from "axios";
import {Auditory} from "../types/auditory";
import {Alert, Snackbar} from "@mui/material";
import { Day } from "../types/day";

type AuditoriesContextType = {
    getAllAuditories: () => Promise<Auditory[] | undefined>;
    createAuditory: (data: Omit<Auditory, 'id'>) => Promise<Auditory | undefined>;
    updateAuditory: (data: Auditory) => Promise<Auditory | undefined>;
    getAuditoryById: (id: string) => Promise<Auditory | undefined>;
    auditories: Auditory[] | null;
    deleteAuditory: (id: string) => Promise<void>;
    getAuditoryByDay: (day: Day, time: string) => Promise<Auditory[] | undefined>;
}

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const AuditoriesContext = createContext<AuditoriesContextType>({} as AuditoriesContextType);

const AuditoriesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] =
        useState<{ message: string, type: ErrorType } | null>(null);
    const [auditories, setAuditories] = useState<Auditory[] | null>(null);
    const { auditoriesApi } = useApi();

    const getAllAuditories = async () => {
        try {
            const auditories = await auditoriesApi.getAllAuditories();
            setAuditories(auditories);
            return auditories;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getAuditoryByDay = async (day: Day, time: string) => {
        try {
            const auditories = await auditoriesApi.getAuditoryByDay(day, time);
            setAuditories(auditories);
            return auditories;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const createAuditory = async (data: Omit<Auditory, 'id'>) => {
        try {
            const auditory = await auditoriesApi.createAuditory(data);
            setAlert({ message: 'Аудитория добавлена', type: 'success' });
            return auditory;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const updateAuditory = async (data: Auditory) => {
        try {
            const auditory = await auditoriesApi.updateAuditory(data);
            setAlert({ message: 'Аудитория обновлена', type: 'success' });
            return auditory;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getAuditoryById = async (id: string) => {
        try {
            return await auditoriesApi.getAuditoryById(id);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const deleteAuditory = async (id: string) => {
        try {
            await auditoriesApi.deleteAuditory(id);
            setAlert({ message: 'Аудитория удалена', type: 'success' });
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const memoValue = useMemo(() => ({
        getAllAuditories,
        auditories,
        createAuditory,
        getAuditoryById,
        updateAuditory,
        deleteAuditory,
        getAuditoryByDay,
    }), [getAllAuditories, auditories, createAuditory, getAuditoryById, deleteAuditory, getAuditoryByDay]);

    return <AuditoriesContext.Provider value={memoValue}>
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
    </AuditoriesContext.Provider>
}

export const useAuditories = () => useContext(AuditoriesContext);

export default AuditoriesProvider;