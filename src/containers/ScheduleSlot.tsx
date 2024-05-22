import * as React from "react";
import { FC, useEffect, useState } from "react";
import { useSchedules } from "../providers/ScheduleProvider";
import {
  Autocomplete,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Schedule as ScheduleModel } from "../types/schedule";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Teacher } from "../types/teacher";
import { Auditory } from "../types/auditory";
import { useDisciplines } from "../providers/DisciplinesProvider";
import { useTeachers } from "../providers/TeachersProvider";
import { Discipline } from "../types/discipline";
import { Day } from "../types/day";
import { ScheduleType } from "../enums/schedule-type.enum";
import useRoleMessageHook from "../hook/use-week-day.hook";
import { TimeMapper } from "./mappers/time.mapper";
import { ScheduleMapper } from "./mappers/schedule.mapper";
import { useAuditories } from "../providers/AuditoriesProvider";

type ScheduleData = ScheduleModel & {
  groupId: string;
  disciplineId: string;
  teacherId: string;
  auditoryId: string;
};

type FormValues = {
  day: Day;
  scheduleType: ScheduleType;
  teacher: Teacher;
  discipline: Discipline;
  auditory: Auditory;
};

const ScheduleSlot: FC = () => {
  const [schedule, setSchedule] = useState<FormValues | null>(null);
  const [config, setConfig] = useState<{
    disciplines: Discipline[];
    teachers: Teacher[];
    auditories: Auditory[];
  } | null>(null);
  const { getScheduleById, createSchedule, updateSchedule, deleteSchedule } =
    useSchedules();
  const { getAllDisciplines } = useDisciplines();
  const { getAllTeachers } = useTeachers();
  const { getAuditoryByDay } = useAuditories();
  const [loading, setLoading] = useState<boolean>(false);

  const [deleteDialogOpened, setDeleteDialogOpened] =
    React.useState<boolean>(false);
  const [deleteCandidate, setDeleteCandidate] = React.useState<string | null>(
    null
  );

  const navigate = useNavigate();

  const { id, groupId, day, time } = useParams();

  const weekDayName = useRoleMessageHook(day as Day);
  useEffect(() => {
    if (id && groupId) {
      setLoading(true);
      getScheduleById(id, groupId).then((schedule) => {
        if (schedule) {
          setSchedule(schedule);
        }
        setLoading(false);
      });
    }
  }, [id, groupId]);

  useEffect(() => {
    Promise.all([
      getAllDisciplines(),
      getAllTeachers(),
      // @ts-ignore
      getAuditoryByDay(day, time),
    ]).then(([disciplines, teachers, auditories]) => {
      setConfig({
        disciplines: disciplines || [],
        teachers: teachers || [],
        auditories: auditories || [],
      });
    });
  }, []);

  const {
    handleSubmit,
    formState: { errors, isDirty },
    control,
    watch,
  } = useForm<ScheduleData>();

  const onSubmit: SubmitHandler<ScheduleData> = async (data) => {
    if (id) {
      await updateSchedule({
        ...data,
        id,
        groupId: groupId || "",
        day: day as Day,
        time: time || "",
      });
    } else {
      const schedule = await createSchedule({
        ...data,
        groupId: groupId || "",
        day: day as Day,
        time: time || "",
      });

      if (schedule) {
        navigate(`/admin/schedule/${groupId}`);
      }
    }
  };

  if ((id && !schedule) || loading || !config) {
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
        Schedule {weekDayName}{" "}
        {time ? TimeMapper[time as keyof typeof TimeMapper] : "Unknown..."}
      </Typography>
      <Box
        justifyContent="flex-start"
        component="form"
        width={600}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Controller
          control={control}
          rules={{ required: true }}
          name="teacherId"
          defaultValue={schedule?.teacher ? schedule?.teacher.id : undefined}
          render={({ field: { onChange } }) => (
            <Autocomplete
              disablePortal
              defaultValue={
                schedule?.teacher
                  ? {
                      label: `${schedule?.teacher.name} ${schedule?.teacher.surname}`,
                      value: schedule?.teacher.id,
                    }
                  : null
              }
              onChange={(_, chosen) => onChange(chosen?.value)}
              options={
                !watch("disciplineId")
                  ? config?.teachers.map((d) => ({
                      label: `${d.name} ${d.surname}`,
                      value: d.id,
                    }))
                  : config?.teachers
                      .filter((d) =>
                        d.disciplines?.some(
                          (d) => d.id === watch("disciplineId")
                        )
                      )
                      .map((d) => ({ label: `${d.name}`, value: d.id }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Teacher"
                  error={!!errors.teacherId}
                />
              )}
              sx={{ mt: 2 }}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ required: true }}
          name="disciplineId"
          defaultValue={
            schedule?.discipline ? schedule?.discipline.id : undefined
          }
          render={({ field: { onChange } }) => (
            <Autocomplete
              disablePortal
              defaultValue={
                schedule?.discipline
                  ? {
                      label: `${schedule?.discipline.name}`,
                      value: schedule?.discipline.id,
                    }
                  : null
              }
              onChange={(_, chosen) => onChange(chosen?.value)}
              options={
                !watch("teacherId")
                  ? config?.disciplines.map((d) => ({
                      label: `${d.name}`,
                      value: d.id,
                    }))
                  : config?.disciplines
                      .filter((d) =>
                        d.teachers?.some((t) => t.id === watch("teacherId"))
                      )
                      .map((d) => ({ label: `${d.name}`, value: d.id }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Discipline"
                  error={!!errors.disciplineId}
                />
              )}
              sx={{ mt: 2 }}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ required: true }}
          name="auditoryId"
          defaultValue={schedule?.auditory ? schedule?.auditory.id : undefined}
          render={({ field: { onChange } }) => (
            <Autocomplete
              disablePortal
              defaultValue={
                schedule?.auditory
                  ? {
                      label: `${schedule?.auditory.building.address}, Building: ${schedule?.auditory.building.number}, Auditory: ${schedule?.auditory.number}`,
                      value: schedule?.auditory.id,
                    }
                  : null
              }
              onChange={(_, chosen) => onChange(chosen?.value)}
              options={config?.auditories.map((d) => ({
                label: `${d?.building.address}, Building: ${d?.building.number}, Auditory: ${d?.number}`,
                value: d.id,
              }))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Auditory"
                  error={!!errors.disciplineId}
                />
              )}
              sx={{ mt: 2 }}
            />
          )}
        />

        <Controller
          control={control}
          rules={{ required: true }}
          name="scheduleType"
          defaultValue={
            schedule?.scheduleType ? schedule?.scheduleType : undefined
          }
          render={({ field: { onChange } }) => (
            <Autocomplete
              disablePortal
              defaultValue={
                schedule?.discipline
                  ? {
                      label:
                        ScheduleMapper[
                          // @ts-ignore
                          schedule?.scheduleType as keyof typeof ScheduleMapper
                        ],
                      value: schedule?.scheduleType,
                    }
                  : null
              }
              onChange={(_, chosen) => onChange(chosen?.value)}
              options={[
                {
                  label: "Lecture",
                  value: ScheduleType.Lecture,
                },
                {
                  label: "Laboratory",
                  value: ScheduleType.Laboratory,
                },
                {
                  label: "Practice",
                  value: ScheduleType.Practice,
                },
              ]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Class type"
                  error={!!errors.scheduleType}
                />
              )}
              sx={{ mt: 2 }}
            />
          )}
        />
        <Box display="flex" gap={1}>
          <Button
            disabled={!isDirty}
            type={"submit"}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {id ? "Update schedule" : "Create schedule"}
          </Button>
          <Button
            disabled={!id}
            variant="contained"
            color="error"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              setDeleteDialogOpened(true);
              setDeleteCandidate(id || "");
            }}
          >
            Delete schedule slot
          </Button>
          <Button
            onClick={() =>
              navigate(`/admin/schedule/${groupId}`, { replace: true })
            }
            variant="contained"
            color="warning"
            sx={{ mt: 3, mb: 2 }}
          >
            Back
          </Button>
        </Box>
        <Dialog
          open={deleteDialogOpened}
          onClose={() => setDeleteDialogOpened(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete schedule slot
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete schedule slot?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                if (deleteCandidate) {
                  setLoading(true);
                  setDeleteDialogOpened(false);
                  setLoading(true);
                  await deleteSchedule(deleteCandidate, groupId || "");
                  navigate(`/admin/schedule/${groupId}`);
                }
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setDeleteDialogOpened(false)}
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ScheduleSlot;
