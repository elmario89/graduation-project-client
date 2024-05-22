import { FC, useEffect, useState } from "react";
import { Box, CircularProgress, Link, Typography } from "@mui/material";
import { useAuth } from "../providers/AuthProvider";
import { useTeachers } from "../providers/TeachersProvider";
import { Discipline } from "../types/discipline";
import { Link as RouterLink } from "react-router-dom";

const TeacherDisciplines: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [disciplines, setDisciplines] = useState<Discipline[] | null>(null);
  const { user } = useAuth();
  const { getTeacherDisciplines } = useTeachers();

  useEffect(() => {
    if (user?.id) {
      getTeacherDisciplines(user.id).then((disciplines) => {
        setDisciplines(disciplines || []);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading || !disciplines) {
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
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Typography sx={{ mb: 2 }} variant="h3">
        Дисциплины:
      </Typography>
      <Box display={"flex"} flexDirection={'column'} gap={2}>
        {disciplines.map((t) => (
          <Link
            onClick={(e) => e.stopPropagation()}
            key={t.id}
            component={RouterLink}
            to={`/teacher/groups/${t.id}`}
          >
            {t.name}
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default TeacherDisciplines;
