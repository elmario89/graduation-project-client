import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useApi} from "./ApiProvider";
import {AxiosError} from "axios";
import {Discipline} from "../types/discipline";
import {Alert, Snackbar} from "@mui/material";
import {AddOrUpdateDiscipline} from "../types/add-or-update-discipline";

type DisciplinesContextType = {
    getAllDisciplines: () => Promise<void>;
    createDiscipline: (data: Omit<AddOrUpdateDiscipline, 'id'>) => Promise<Discipline | undefined>;
    updateDiscipline: (data: AddOrUpdateDiscipline) => Promise<Discipline | undefined>;
    getDisciplineById: (id: string) => Promise<Discipline | undefined>;
    disciplines: Discipline[] | null;
    deleteDiscipline: (id: string) => Promise<void>;
}

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const DisciplinesContext = createContext<DisciplinesContextType>({} as DisciplinesContextType);

const DisciplinesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] =
        useState<{ message: string, type: ErrorType } | null>(null);
    const [disciplines, setDisciplines] = useState<Discipline[] | null>(null);
    const { disciplinesApi } = useApi();

    const getAllDisciplines = async () => {
        try {
            const disciplines = await disciplinesApi.getAllDisciplines();
            setDisciplines(disciplines);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const createDiscipline = async (data: Omit<AddOrUpdateDiscipline, 'id'>) => {
        try {
            const discipline = await disciplinesApi.createDiscipline(data);
            setAlert({ message: 'Discipline has been created!', type: 'success' });
            return discipline;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const updateDiscipline = async (data: AddOrUpdateDiscipline) => {
        try {
            const discipline = await disciplinesApi.updateDiscipline(data);
            setAlert({ message: 'Discipline has been updated!', type: 'success' });
            return discipline;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getDisciplineById = async (id: string) => {
        try {
            return await disciplinesApi.getDisciplineById(id);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const deleteDiscipline = async (id: string) => {
        try {
            await disciplinesApi.deleteDiscipline(id);
            setAlert({ message: 'Discipline has been deleted!', type: 'success' });
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const memoValue = useMemo(() => ({
        getAllDisciplines,
        disciplines,
        createDiscipline,
        getDisciplineById,
        updateDiscipline,
        deleteDiscipline,
    }), [getAllDisciplines, disciplines, createDiscipline, getDisciplineById, deleteDiscipline]);

    return <DisciplinesContext.Provider value={memoValue}>
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
    </DisciplinesContext.Provider>
}

export const useDisciplines = () => useContext(DisciplinesContext);

export default DisciplinesProvider;