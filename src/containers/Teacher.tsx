import * as React from "react";
import { FC, useEffect, useState } from "react";
import { useTeachers } from "../providers/TeachersProvider";
import { Autocomplete, CircularProgress, Link } from "@mui/material";
import { Teacher as TeacherModel } from "../types/teacher";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Discipline } from "../types/discipline";
import { useDisciplines } from "../providers/DisciplinesProvider";
import { Faculty } from "../types/faculty";
import { useFaculties } from "../providers/FacultiesProvider";

type TeacherData = Omit<
  TeacherModel & { disciplineIds: string[]; facultiesIds: string[] },
  "id"
>;

type FormValues = {
  name: string;
  surname: string;
  login: string;
  password: string;
  disciplines?: Discipline[];
  faculties?: Faculty[];
};

const Teacher: FC = () => {
  const [teacher, setTeacher] = useState<FormValues | null>(null);
  const [disciplineDropdownItems, setDisciplineDropdownItems] = useState<
    { name: string; id: string; facultyId: string }[]
  >([]);
  const [filteredDisciplineDropdownItems, setFilteredDisciplineDropdownItems] =
    useState<{ name: string; id: string; facultyId: string }[]>([]);
  const [facultyDropdownItems, setFacultyDropdownItems] = useState<
    { name: string; id: string }[]
  >([]);
  const { getTeacherById, createTeacher, updateTeacher } = useTeachers();
  const { getAllFaculties } = useFaculties();
  const { getAllDisciplines } = useDisciplines();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getTeacherById(id).then((teacher) => {
        if (teacher) {
          setTeacher(teacher);
        }
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    Promise.all([getAllDisciplines(), getAllFaculties()]).then(
      ([fetchedDisciplines, fetchedFaculties]) => {
        if (fetchedDisciplines) {
          setDisciplineDropdownItems(
            fetchedDisciplines.map((d) => ({
              name: d.name,
              id: d.id,
              facultyId: d.facultyId,
            }))
          );
        }
        if (fetchedFaculties) {
          setFacultyDropdownItems(
            fetchedFaculties.map((d) => ({ name: d.name, id: d.id }))
          );
        }
      }
    );
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    watch,
    setValue,
  } = useForm<TeacherData>();

  useEffect(() => {
    const facultiesIds = watch("facultiesIds");
    const filtered = disciplineDropdownItems.filter((d) =>
      facultiesIds.includes(d.facultyId)
    );
    setFilteredDisciplineDropdownItems(filtered);
  }, [watch("facultiesIds")]);

  const onSubmit: SubmitHandler<TeacherData> = async (data) => {
    if (id) {
      const updatedTeacher = await updateTeacher({ id, ...data });
      if (updatedTeacher) {
        setTeacher(updatedTeacher);
      }
    } else {
      const teacher = await createTeacher(data);

      if (teacher) {
        navigate(`/admin/teacher/${teacher.id}`);
      }
    }
  };

  if ((id && !teacher) || loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Учитель
      </Typography>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            justifyContent="flex-start"
            component="form"
            width={600}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              {...register("name", { required: true })}
              margin="normal"
              error={!!errors.name}
              required
              fullWidth
              id="name"
              label="Имя"
              name="name"
              autoComplete="name"
              autoFocus
              defaultValue={teacher?.name || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register("surname", { required: true })}
              margin="normal"
              error={!!errors.surname}
              required
              fullWidth
              id="surname"
              label="Фамилия"
              name="surname"
              autoComplete="surname"
              autoFocus
              defaultValue={teacher?.surname || ""}
              sx={{ mb: 2 }}
            />

            {!id && (
              <>
                <TextField
                  {...register("login", { required: true })}
                  margin="normal"
                  error={!!errors.login}
                  required
                  fullWidth
                  id="login"
                  label="Логин"
                  name="login"
                  autoComplete="login"
                  autoFocus
                  defaultValue={teacher?.login || ""}
                  sx={{ mb: 2 }}
                />

                <TextField
                  {...register("password", { required: true })}
                  margin="normal"
                  error={!!errors.password}
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  sx={{ mb: 2 }}
                />
              </>
            )}

            <Controller
              control={control}
              rules={{ required: true }}
              name="facultiesIds"
              defaultValue={
                teacher?.faculties
                  ? teacher?.faculties.map((faculty) => faculty.id)
                  : []
              }
              render={({ field: { onChange } }) => (
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={facultyDropdownItems}
                  getOptionLabel={(option) => option.name}
                  defaultValue={
                    teacher?.faculties
                      ? teacher?.faculties.map((faculty) => ({
                          name: faculty.name,
                          id: faculty.id,
                        }))
                      : []
                  }
                  onChange={(_, chosen) => {
                    const included = chosen.map((c) => c.id);
                    const filtered = disciplineDropdownItems.filter((f) =>
                      included.includes(f.facultyId)
                    );
                    setFilteredDisciplineDropdownItems(filtered);
                    const t = watch("disciplineIds").filter((f) =>
                      filtered.map((f) => f.id).includes(f)
                    );
                    // @ts-ignore
                    setValue("disciplineIds", t);

                    return onChange(chosen?.map((faculty) => faculty.id));
                  }}
                  filterSelectedOptions
                  sx={{ mb: 4, mt: 2 }}
                  renderInput={(params) => (
                    <TextField
                      error={!!errors.facultiesIds}
                      {...params}
                      label="Выберите факультет"
                      placeholder="Факультеты"
                    />
                  )}
                />
              )}
            />

            <Controller
              control={control}
              rules={{ required: true }}
              name="disciplineIds"
              defaultValue={
                teacher?.disciplines
                  ? teacher?.disciplines.map((discipline) => discipline.id)
                  : []
              }
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  value={filteredDisciplineDropdownItems.filter(f => value.includes(f.id))}
                  disabled={watch("facultiesIds")?.length === 0}
                  multiple
                  disableCloseOnSelect
                  options={filteredDisciplineDropdownItems}
                  getOptionLabel={(option) => option.name}
                  defaultValue={
                    teacher?.disciplines
                      ? teacher?.disciplines.map((discipline) => ({
                          name: discipline.name,
                          id: discipline.id,
                        }))
                      : []
                  }
                  onChange={(_, chosen) =>
                    onChange(chosen?.map((discipline) => discipline.id))
                  }
                  filterSelectedOptions
                  sx={{ mb: 2, mt: 2 }}
                  renderInput={(params) => (
                    <TextField
                      error={!!errors.disciplineIds}
                      {...params}
                      label="Выберите дисциплины"
                      placeholder="Дисциплины"
                    />
                  )}
                />
              )}
            />

            {teacher?.disciplines && teacher.disciplines.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Дисциплины:
                </Typography>
                <Box
                  display="flex"
                  flexDirection={"column"}
                  gap={1}
                  sx={{ my: 2 }}
                >
                  {teacher.disciplines.map((d) => (
                    <Link
                      style={{ alignSelf: "flex-start" }}
                      key={d.id}
                      component={RouterLink}
                      to={`/admin/discipline/${d.id}`}
                    >
                      {d.name}
                    </Link>
                  ))}
                </Box>
              </>
            )}

            <Box display="flex" gap={1}>
              <Button
                disabled={!isDirty}
                type={"submit"}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {id ? "Обновить учителя" : "Добавить учителя"}
              </Button>
              <Button
                onClick={() => navigate(`/admin/teachers`)}
                variant="contained"
                color="warning"
                sx={{ mt: 3, mb: 2 }}
              >
                Назад
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Box>
    </>
  );
};

export default Teacher;
