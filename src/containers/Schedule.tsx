import * as React from "react";
import { FC, useEffect, useState } from "react";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useSchedules } from "../providers/ScheduleProvider";
import { Day } from "../types/day";
import { Schedule as ScheduleModel } from "../types/schedule";
import { TimeMapper } from "./mappers/time.mapper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import { DayMapper } from "./mappers/day.mapper";
import { TimeReverseMapper } from "./mappers/time-reverse.mapper";
import { ScheduleMapper } from "./mappers/schedule.mapper";
import "../styles/card.css";
import { useAuth } from "../providers/AuthProvider";

const INITIAL_TIME = [800, 940, 1120, 1330, 1510, 1650, 1825, 2000];

type ScheduleProps = {
  forStudent?: boolean;
};

const Schedule: FC<ScheduleProps> = ({ forStudent }) => {
  const {
    getSchedulesByGroupId,
    getSchedulesByTeacherId,
    deleteSchedule,
    schedules,
  } = useSchedules();
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<
    Record<number, ScheduleModel | null>[] | null
  >(null);
  const { user } = useAuth();

  const [deleteDialogOpened, setDeleteDialogOpened] =
    React.useState<boolean>(false);
  const [deleteCandidate, setDeleteCandidate] = React.useState<string | null>(
    null
  );

  const navigate = useNavigate();
  const { id, groupId, teacherId } = useParams();

  const generateArray = (data: ScheduleModel[], day: Day, time: number) => {
    return (
      data?.filter((s: ScheduleModel) => {
        return (
          s.day === day &&
          s.timeStart ===
            TimeReverseMapper[time.toString() as keyof typeof TimeReverseMapper]
        );
      })[0] || null
    );
  };

  useEffect(() => {
    if (teacherId) {
      console.log(teacherId);
      setLoading(true);
      getSchedulesByTeacherId(teacherId).then((response) => {
        if (response) {
          const configs = Array.from(Array(7).keys()).map((day) => {
            let result = {};

            INITIAL_TIME.forEach((time) => {
              result = {
                ...result,
                [time]: generateArray(response, day.toString() as Day, time),
              };
            });

            return result;
          });

          setConfig(configs);

          setLoading(false);
        }
      });
    }
    if (groupId) {
      setLoading(true);
      getSchedulesByGroupId(groupId).then((response) => {
        if (response) {
          const configs = Array.from(Array(7).keys()).map((day) => {
            let result = {};

            INITIAL_TIME.forEach((time) => {
              result = {
                ...result,
                [time]: generateArray(response, day.toString() as Day, time),
              };
            });

            return result;
          });

          setConfig(configs);

          setLoading(false);
        }
      });
    }
  }, [groupId, teacherId]);

  if ((id && !schedules) || loading || !config) {
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
        Schedule
      </Typography>
      <CssBaseline />
      {config.map((day, index) => (
        <Box className="card" sx={{ mb: 2 }} key={index}>
          <Typography variant="h5">
            {DayMapper[index as keyof typeof DayMapper]}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Table
            style={{ tableLayout: "fixed" }}
            sx={{ minWidth: 650 }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Discipline</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Class type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(day).map(([time, schedule]) => (
                <TableRow
                  onClick={() => {
                    if (!forStudent) {
                      return navigate(
                        `/admin/schedule/${groupId}/${index}/${time}/${schedule?.id || ""}`
                      );
                    }

                    if (schedule) {
                      if (teacherId) {
                        return navigate(
                          `/teacher/group/${schedule?.discipline.id}/${schedule?.group.id}`
                        );
                      }
                      return navigate(
                        `/student/visits/${schedule?.discipline.id}/${groupId}/${user?.id}`
                      );
                    }
                  }}
                  style={{
                    cursor: !schedule && forStudent ? "initial" : "pointer",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    opacity: !schedule && forStudent ? 0.5 : 1,
                  }}
                  hover={!(!schedule && forStudent)}
                  key={time}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant="h6">
                      {TimeMapper[time as keyof typeof TimeMapper]}
                    </Typography>
                  </TableCell>
                  <TableCell>{schedule?.discipline.name}</TableCell>
                  <TableCell>
                    {schedule?.teacher.name} {schedule?.teacher.surname}
                  </TableCell>
                  <TableCell>
                    {
                      ScheduleMapper[
                        // @ts-ignore
                        schedule?.scheduleType as keyof typeof ScheduleMapper
                      ]
                    }
                  </TableCell>
                  <TableCell>
                    {schedule?.location && (
                      <>
                        address: {schedule?.location.address}, floor:{" "}
                        {schedule?.location.floor}, auditory:{" "}
                        {schedule?.location.auditory}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {(schedule || !forStudent) && (
                      <Button
                        color={"success"}
                        size={"small"}
                        variant="contained"
                      >
                        {forStudent
                          ? teacherId
                            ? "Show group"
                            : "Show statistics"
                          : schedule
                            ? "Update schedule"
                            : "Add schedule"}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {schedule && !forStudent && (
                      <Button
                        color={"error"}
                        size={"small"}
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteDialogOpened(true);
                          setDeleteCandidate(schedule?.id);
                        }}
                      >
                        Delete schedule
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ))}

      <Dialog
        open={deleteDialogOpened}
        onClose={() => setDeleteDialogOpened(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete schedule slot</DialogTitle>
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
                setLoading(false);
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

      <Box display="flex" gap={1}>
        <Button
          onClick={() => navigate(`/admin/group/${groupId}`)}
          variant="contained"
          color="warning"
          sx={{ mt: 3, mb: 2 }}
        >
          Back
        </Button>
      </Box>
    </>
  );
};

export default Schedule;
