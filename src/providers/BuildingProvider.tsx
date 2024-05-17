import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { useApi } from "./ApiProvider";
import { AxiosError } from "axios";
import { Building } from "../types/building";
import { Alert, Snackbar } from "@mui/material";

type BuildingsContextType = {
  getAllBuildings: () => Promise<void>;
  createBuilding: (data: Omit<Building, "id">) => Promise<Building | undefined>;
  updateBuilding: (data: Building) => Promise<Building | undefined>;
  getBuildingById: (id: string) => Promise<Building | undefined>;
  buildings: Building[] | null;
  deleteBuilding: (id: string) => Promise<void>;
};

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const BuildingsContext = createContext<BuildingsContextType>(
  {} as BuildingsContextType
);

const BuildingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [alert, setAlert] = useState<{
    message: string;
    type: ErrorType;
  } | null>(null);
  const [buildings, setBuildings] = useState<Building[] | null>(null);
  const { buildingsApi } = useApi();

  const getAllBuildings = async () => {
    try {
      const buildings = await buildingsApi.getAllBuildings();
      setBuildings(buildings);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const createBuilding = async (data: Omit<Building, "id">) => {
    try {
      const building = await buildingsApi.createBuilding(data);
      setAlert({ message: "Building has been created!", type: "success" });
      return building;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const updateBuilding = async (data: Building) => {
    try {
      const building = await buildingsApi.updateBuilding(data);
      setAlert({ message: "Building has been updated!", type: "success" });
      return building;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const getBuildingById = async (id: string) => {
    try {
      return await buildingsApi.getBuildingById(id);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const deleteBuilding = async (id: string) => {
    try {
      await buildingsApi.deleteBuilding(id);
      setAlert({ message: "Building has been deleted!", type: "success" });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const memoValue = useMemo(
    () => ({
      getAllBuildings,
      buildings,
      createBuilding,
      getBuildingById,
      updateBuilding,
      deleteBuilding,
    }),
    [
      getAllBuildings,
      buildings,
      createBuilding,
      getBuildingById,
      deleteBuilding,
    ]
  );

  return (
    <BuildingsContext.Provider value={memoValue}>
      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={() => setAlert(null)}
      >
        <Alert
          onClose={() => setAlert(null)}
          severity={alert?.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
      {children}
    </BuildingsContext.Provider>
  );
};

export const useBuildings = () => useContext(BuildingsContext);

export default BuildingsProvider;
