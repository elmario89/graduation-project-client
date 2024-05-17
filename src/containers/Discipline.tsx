import * as React from "react";
import { FC, useEffect, useState } from "react";
import { useDisciplines } from "../providers/DisciplinesProvider";
import { Autocomplete, CircularProgress, Link } from "@mui/material";
import { Discipline as DisciplineModel } from "../types/discipline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { useFaculties } from "../providers/FacultiesProvider";
import { Faculty } from "../types/faculty";

type DisciplineData = Omit<DisciplineModel, "id">;

const Discipline: FC = () => {
  const [discipline, setDiscipline] = useState<DisciplineData | null>(null);
  const { getDisciplineById, createDiscipline, updateDiscipline } =
    useDisciplines();
  const { getAllFaculties, faculties } = useFaculties();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getDisciplineById(id).then((discipline) => {
        if (discipline) {
          setDiscipline(discipline);
        }
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    getAllFaculties();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<DisciplineData>();

  const onSubmit: SubmitHandler<DisciplineData> = async (data) => {
    if (id) {
      await updateDiscipline({ ...data, id });
    } else {
      const discipline = await createDiscipline(data);

      if (discipline) {
        navigate(`/admin/discipline/${discipline.id}`);
      }
    }
  };

  if ((id && !discipline) || loading || !faculties) {
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
        Discipline
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
              label="Discipline name"
              name="name"
              autoComplete="name"
              autoFocus
              defaultValue={discipline?.name || ""}
              sx={{ mb: 2 }}
            />

            <Controller
              control={control}
              rules={{ required: true }}
              name="facultyId"
              defaultValue={
                discipline?.faculty ? discipline?.faculty.id : undefined
              }
              render={({ field: { onChange } }) => (
                <Autocomplete
                  disablePortal
                  defaultValue={
                    discipline?.faculty
                      ? {
                          label: discipline?.faculty.name,
                          value: discipline?.faculty.id,
                        }
                      : null
                  }
                  onChange={(_, chosen) => onChange(chosen?.value)}
                  options={faculties.map((faculty: Faculty) => ({
                    label: faculty.name,
                    value: faculty.id,
                  }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Faculty"
                      error={!!errors.facultyId}
                    />
                  )}
                  sx={{ mt: 2 }}
                />
              )}
            />

            {discipline?.teachers && discipline.teachers.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Teachers:
                </Typography>
                <Box
                  display="flex"
                  flexDirection={"column"}
                  gap={1}
                  sx={{ my: 2 }}
                >
                  {discipline.teachers.map((teacher) => (
                    <Link
                      style={{ alignSelf: "flex-start" }}
                      component={RouterLink}
                      to={`/admin/teacher/${teacher.id}`}
                    >
                      {teacher.name} {teacher.surname}
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
                {id ? "Update discipline" : "Create discipline"}
              </Button>
              <Button
                onClick={() => navigate(`/admin/disciplines`)}
                variant="contained"
                color="warning"
                sx={{ mt: 3, mb: 2 }}
              >
                Back
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Box>
    </>
  );
};

export default Discipline;
