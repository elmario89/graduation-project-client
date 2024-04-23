import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useApi} from "./ApiProvider";
import {AxiosError} from "axios";
import {Schedule} from "../types/schedule";
import {Alert, Snackbar} from "@mui/material";
import {AddOrUpdateSchedule} from "../types/add-or-update-schedule";

type SchedulesContextType = {
    getAllSchedules: () => Promise<void>;
    createSchedule: (data: Omit<AddOrUpdateSchedule, 'id'>) => Promise<Schedule | undefined>;
    updateSchedule: (data: AddOrUpdateSchedule) => Promise<Schedule | undefined>;
    getScheduleById: (id: string) => Promise<Schedule | undefined>;
    getSchedulesByGroupId: (groupId: string) => Promise<Schedule[] | undefined>;
    schedules: Schedule[] | null;
    deleteSchedule: (id: string, groupId: string) => Promise<void>;
}

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const SchedulesContext = createContext<SchedulesContextType>({} as SchedulesContextType);

const SchedulesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] =
        useState<{ message: string, type: ErrorType } | null>(null);
    const [schedules, setSchedules] = useState<Schedule[] | null>(null);
    const { schedulesApi } = useApi();

    const getAllSchedules = async () => {
        try {
            const schedules = await schedulesApi.getAllSchedules();
            setSchedules(schedules);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const createSchedule = async (data: Omit<AddOrUpdateSchedule, 'id'>) => {
        try {
            const schedule = await schedulesApi.createSchedule(data);
            setAlert({ message: 'Schedule has been created!', type: 'success' });
            return schedule;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const updateSchedule = async (data: AddOrUpdateSchedule) => {
        try {
            const schedule = await schedulesApi.updateSchedule(data);
            setAlert({ message: 'Schedule has been updated!', type: 'success' });
            return schedule;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getScheduleById = async (id: string) => {
        try {
            return await schedulesApi.getScheduleById(id);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getSchedulesByGroupId = async (groupId: string) => {
        try {
            const schedules = await schedulesApi.getSchedulesByGroupId(groupId);
            if (schedules) {
                setSchedules(schedules);
            }

            return schedules;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const deleteSchedule = async (id: string, groupId: string) => {
        try {
            await schedulesApi.deleteSchedule(id);
            const schedules = await getSchedulesByGroupId(groupId);

            if (schedules) {
                setSchedules(schedules);
            }

            setAlert({ message: 'Schedule has been deleted!', type: 'success' });
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const memoValue = useMemo(() => ({
        getAllSchedules,
        schedules,
        createSchedule,
        getScheduleById,
        updateSchedule,
        deleteSchedule,
        getSchedulesByGroupId,
    }), [getAllSchedules, schedules, createSchedule, getScheduleById, deleteSchedule, getSchedulesByGroupId]);

    return <SchedulesContext.Provider value={memoValue}>
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
    </SchedulesContext.Provider>
}

export const useSchedules = () => useContext(SchedulesContext);

export default SchedulesProvider;