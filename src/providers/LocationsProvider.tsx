import {createContext, FC, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useApi} from "./ApiProvider";
import {AxiosError} from "axios";
import {Location} from "../types/location";
import {Alert, Snackbar} from "@mui/material";
import { Day } from "../types/day";

type LocationsContextType = {
    getAllLocations: () => Promise<Location[] | undefined>;
    createLocation: (data: Omit<Location, 'id'>) => Promise<Location | undefined>;
    updateLocation: (data: Location) => Promise<Location | undefined>;
    getLocationById: (id: string) => Promise<Location | undefined>;
    locations: Location[] | null;
    deleteLocation: (id: string) => Promise<void>;
    getLocationByDay: (day: Day, time: string) => Promise<Location[] | undefined>;
}

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const LocationsContext = createContext<LocationsContextType>({} as LocationsContextType);

const LocationsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [alert, setAlert] =
        useState<{ message: string, type: ErrorType } | null>(null);
    const [locations, setLocations] = useState<Location[] | null>(null);
    const { locationsApi } = useApi();

    const getAllLocations = async () => {
        try {
            const locations = await locationsApi.getAllLocations();
            setLocations(locations);
            return locations;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getLocationByDay = async (day: Day, time: string) => {
        try {
            const locations = await locationsApi.getLocationByDay(day, time);
            setLocations(locations);
            return locations;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const createLocation = async (data: Omit<Location, 'id'>) => {
        try {
            const location = await locationsApi.createLocation(data);
            setAlert({ message: 'Location has been created!', type: 'success' });
            return location;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const updateLocation = async (data: Location) => {
        try {
            const location = await locationsApi.updateLocation(data);
            setAlert({ message: 'Location has been updated!', type: 'success' });
            return location;
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const getLocationById = async (id: string) => {
        try {
            return await locationsApi.getLocationById(id);
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const deleteLocation = async (id: string) => {
        try {
            await locationsApi.deleteLocation(id);
            setAlert({ message: 'Location has been deleted!', type: 'success' });
        } catch (e: unknown) {
            if (e instanceof AxiosError) {
                setAlert({ message: e.message, type: 'error' });
            }
        }
    }

    const memoValue = useMemo(() => ({
        getAllLocations,
        locations,
        createLocation,
        getLocationById,
        updateLocation,
        deleteLocation,
        getLocationByDay,
    }), [getAllLocations, locations, createLocation, getLocationById, deleteLocation, getLocationByDay]);

    return <LocationsContext.Provider value={memoValue}>
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
    </LocationsContext.Provider>
}

export const useLocations = () => useContext(LocationsContext);

export default LocationsProvider;