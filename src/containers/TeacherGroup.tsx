import { FC, useEffect, useState } from "react";
import { Box, CircularProgress, Link, Typography } from "@mui/material";
import { useAuth } from "../providers/AuthProvider";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useStudents } from "../providers/StudentsProvider";
import { Student } from "../types/student";

const TeacherGroup: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [students, setStudents] = useState<Student[] | null>(null);
  const { user } = useAuth();
  const { getStudentsByGroup } = useStudents();
  const { disciplineId, groupId } = useParams();

  useEffect(() => {
    if (groupId) {
      getStudentsByGroup(groupId).then((students) => {
        setStudents(students || []);
        setLoading(false);
      });
    }
  }, [user, groupId]);

  if (loading || !students) {
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
        Студенты:
      </Typography>
      <Box display={"flex"} flexDirection={'column'} gap={2}>
        {students.map((t) => (
          <Link
            onClick={(e) => e.stopPropagation()}
            key={t.id}
            component={RouterLink}
            to={`/teacher/visits/${disciplineId}/${groupId}/${t.id}`}
          >
            {t.name} {t.surname}
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default TeacherGroup;
