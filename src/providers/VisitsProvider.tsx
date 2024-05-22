import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useApi} from "./ApiProvider";
import {AxiosError} from "axios";
import {Alert, Snackbar} from "@mui/material";
import { Visit } from "../types/visit";

type VisitsContextType = {
    getVisitByScheduleAndStudent: (studentId: string, scheduleIds: string[]) => Promise<Visit[] | undefined>;
    getVisitsBySchedule: (scheduleId: string[]) => Promise<Visit[] | undefined>;
}

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const VisitsContext = createContext<VisitsContextType>({} as VisitsContextType);

const VisitsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] =
        useState<{ message: string, type: ErrorType } | null>(null);
    const { visitsApi } = useApi();

    const getVisitByScheduleAndStudent = async (studentId: string, scheduleIds: string[]) => {
        try {
            const visits = await visitsApi.getVisitByScheduleAndStudent(studentId, scheduleIds);

            return visits;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getVisitsBySchedule = async (scheduleIds: string[]) => {
        try {
            const visits = await visitsApi.getVisitBySchedule(scheduleIds);

            return visits;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const memoValue = useMemo(() => ({
        getVisitByScheduleAndStudent,
        getVisitsBySchedule,
    }), [getVisitByScheduleAndStudent, getVisitsBySchedule]);

    return <VisitsContext.Provider value={memoValue}>
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
    </VisitsContext.Provider>
}

export const useVisits = () => useContext(VisitsContext);

export default VisitsProvider;