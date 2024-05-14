import { FC, useEffect, useState } from "react";
import { Box, CircularProgress, Link, Typography } from "@mui/material";
import { useAuth } from "../providers/AuthProvider";
import { useTeachers } from "../providers/TeachersProvider";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Group } from "../types/group";

const TeacherGroup: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const { user } = useAuth();
  const { getTeacherGroups } = useTeachers();
  const { disciplineId } = useParams();

  useEffect(() => {
    if (user?.id && disciplineId) {
      getTeacherGroups(user.id, disciplineId).then((groups) => {
        setGroups(groups || []);
        setLoading(false);
      });
    }
  }, [user, disciplineId]);

  if (loading || !groups) {
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
        Groups:
      </Typography>
      <Box display={"flex"} flexDirection={'column'} gap={2}>
        {groups.map((t) => (
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

export default TeacherGroup;
