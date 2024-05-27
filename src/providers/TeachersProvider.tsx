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
import { Teacher } from "../types/teacher";
import { Alert, Snackbar } from "@mui/material";
import { AddOrUpdateTeacher } from "../types/add-or-update-teacher";
import { Discipline } from "../types/discipline";
import { Group } from "../types/group";
import { Visit } from "../types/visit";

type TeachersContextType = {
  getAllTeachers: () => Promise<Teacher[] | undefined>;
  createTeacher: (
    data: Omit<AddOrUpdateTeacher, "id">
  ) => Promise<Teacher | undefined>;
  updateTeacher: (data: AddOrUpdateTeacher) => Promise<Teacher | undefined>;
  getTeacherById: (id: string) => Promise<Teacher | undefined>;
  teachers: Teacher[] | null;
  deleteTeacher: (id: string) => Promise<void>;
  getTeacherDisciplines: (id: string) => Promise<Discipline[] | undefined>;
  getTeacherGroups: (
    teacherId: string,
    disciplineId: string
  ) => Promise<Group[] | undefined>;
  setVisit: (dto: { studentId: string; scheduleId: string; date: Date }) => Promise<Visit[] | undefined>;
  deleteVisit: (id: string) => Promise<Visit[] | undefined>;
};

type ErrorType = "error" | "success" | "info" | "warning" | undefined;

const TeachersContext = createContext<TeachersContextType>(
  {} as TeachersContextType
);

const TeachersProvider: FC<PropsWithChildren> = ({ children }) => {
  const [alert, setAlert] = useState<{
    message: string;
    type: ErrorType;
  } | null>(null);
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const { teachersApi } = useApi();

  const getAllTeachers = async () => {
    try {
      const teachers = await teachersApi.getAll();
      setTeachers(teachers);

      return teachers;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const createTeacher = async (data: Omit<AddOrUpdateTeacher, "id">) => {
    try {
      const teacher = await teachersApi.create(data);
      setAlert({ message: "Преподаватель создан", type: "success" });
      return teacher;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const getTeacherGroups = async (teacherId: string, disciplineId: string) => {
    try {
      return await teachersApi.getTeacherGroups(teacherId, disciplineId);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const setVisit = async (dto: { studentId: string; scheduleId: string; date: Date }) => {
    try {
      setAlert({ message: "Посещение студента было добавлено", type: "success" });
      return await teachersApi.setVisit(dto);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const deleteVisit = async (id: string) => {
    try {
      setAlert({ message: "Посещения студента было удалено", type: "warning" });
      return await teachersApi.deleteVisit(id);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const getTeacherDisciplines = async (id: string) => {
    try {
      return await teachersApi.getTeacherDisciplines(id);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const updateTeacher = async (data: AddOrUpdateTeacher) => {
    try {
      const teacher = await teachersApi.update(data);
      setAlert({ message: "Преподаватель обновлен", type: "success" });
      return teacher;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const getTeacherById = async (id: string) => {
    try {
      return await teachersApi.getById(id);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      await teachersApi.delete(id);
      setAlert({ message: "Преподаватель удален", type: "success" });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        setAlert({ message: e.message, type: "error" });
      }
    }
  };

  const memoValue = useMemo(
    () => ({
      getAllTeachers,
      teachers,
      createTeacher,
      getTeacherById,
      updateTeacher,
      deleteTeacher,
      getTeacherDisciplines,
      getTeacherGroups,
      setVisit,
      deleteVisit,
    }),
    [
      getAllTeachers,
      teachers,
      createTeacher,
      getTeacherById,
      deleteTeacher,
      getTeacherDisciplines,
      getTeacherGroups,
      setVisit,
      deleteVisit,
    ]
  );

  return (
    <TeachersContext.Provider value={memoValue}>
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
    </TeachersContext.Provider>
  );
};

export const useTeachers = () => useContext(TeachersContext);

export default TeachersProvider;
