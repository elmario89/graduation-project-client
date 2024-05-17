import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useApi} from "./ApiProvider";
import {AxiosError} from "axios";
import {Faculty} from "../types/faculty";
import {Alert, Snackbar} from "@mui/material";

type FacultiesContextType = {
    getAllFaculties: () => Promise<Faculty[] | undefined>;
    createFaculty: (data: Omit<Faculty, 'id'>) => Promise<Faculty | undefined>;
    updateFaculty: (data: Faculty) => Promise<Faculty | undefined>;
    getFacultyById: (id: string) => Promise<Faculty | undefined>;
    faculties: Faculty[] | null;
    deleteFaculty: (id: string) => Promise<void>;
}

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const FacultiesContext = createContext<FacultiesContextType>({} as FacultiesContextType);

const FacultiesProvider: FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] =
        useState<{ message: string, type: ErrorType } | null>(null);
    const [faculties, setFaculties] = useState<Faculty[] | null>(null);
    const { facultiesApi } = useApi();

    const getAllFaculties = async () => {
        try {
            const faculties = await facultiesApi.getAllFaculties();
            setFaculties(faculties);
            return faculties;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const createFaculty = async (data: Omit<Faculty, 'id'>) => {
        try {
            const group = await facultiesApi.createFaculty(data);
            setAlert({ message: 'Faculty has been created!', type: 'success' });
            return group;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const updateFaculty = async (data: Faculty) => {
        try {
            const group = await facultiesApi.updateFaculty(data);
            setAlert({ message: 'Faculty has been updated!', type: 'success' });
            return group;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getFacultyById = async (id: string) => {
        try {
            return await facultiesApi.getFacultyById(id);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const deleteFaculty = async (id: string) => {
        try {
            await facultiesApi.deleteFaculty(id);
            setAlert({ message: 'Faculty has been deleted!', type: 'success' });
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const memoValue = useMemo(() => ({
        getAllFaculties,
        faculties,
        createFaculty,
        getFacultyById,
        updateFaculty,
        deleteFaculty,
    }), [getAllFaculties, faculties, createFaculty, getFacultyById, deleteFaculty]);

    return <FacultiesContext.Provider value={memoValue}>
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
    </FacultiesContext.Provider>
}

export const useFaculties = () => useContext(FacultiesContext);

export default FacultiesProvider;