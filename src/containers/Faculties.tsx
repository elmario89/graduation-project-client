import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FC, useEffect, useState } from "react";
import { useFaculties } from "../providers/FacultiesProvider";
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Stack,
} from "@mui/material";
import { Faculty } from "../types/faculty";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Group } from "../types/group";
import { Discipline } from "../types/discipline";

function createData(
  id: string,
  name: string,
  groups: Group[],
  disciplines: Discipline[]
) {
  return { id, name, groups, disciplines };
}

const Faculties: FC = () => {
  const [rows, setRow] = useState<any | null>(null);
  const { faculties, getAllFaculties, deleteFaculty } = useFaculties();
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpened, setDeleteDialogOpened] =
    React.useState<boolean>(false);
  const [deleteCandidate, setDeleteCandidate] = React.useState<string | null>(
    null
  );

  const navigate = useNavigate();

  const getRows = (data: Faculty[]) =>
    data?.map((faculty) => {
      const { name, id, groups, disciplines } = faculty;
      return createData(id, name, groups || [], disciplines || []);
    });

  useEffect(() => {
    getAllFaculties().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (faculties) {
      setRow(getRows(faculties));
    }
  }, [faculties]);

  if (loading || !faculties || !rows) {
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
        Faculties
      </Typography>
      <Box sx={{ py: 2 }}>
        <Button
          variant={"contained"}
          color={"success"}
          onClick={() => navigate("/admin/faculty")}
        >
          Add faculty
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity="warning">
                    No faculties, try to create one
                  </Alert>
                </Stack>
              </TableCell>
            </TableRow>
          ) : (
            <>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Groups</TableCell>
                  <TableCell>Disciplines</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(
                  (row: {
                    id: string;
                    name: string;
                    groups: Group[];
                    disciplines: Discipline[];
                  }) => (
                    <TableRow
                      style={{ cursor: "pointer" }}
                      hover={true}
                      onClick={() => navigate(`/admin/faculty/${row.id}`)}
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>
                        {row.groups.map((g) => (
                          <Link
                            onClick={(e) => e.stopPropagation()}
                            key={g.id}
                            component={RouterLink}
                            to={`/admin/group/${g.id}`}
                          >
                            {g.name}
                            <br />
                          </Link>
                        ))}
                      </TableCell>
                      <TableCell>
                        {row.disciplines.map((g) => (
                          <Link
                            onClick={(e) => e.stopPropagation()}
                            key={g.id}
                            component={RouterLink}
                            to={`/admin/discipline/${g.id}`}
                          >
                            {g.name}
                            <br />
                          </Link>
                        ))}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          type={"submit"}
                          variant="contained"
                          color="warning"
                          onClick={() => navigate(`/admin/faculty/${row.id}`)}
                        >
                          Update faculty
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          type={"submit"}
                          variant="contained"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialogOpened(true);
                            setDeleteCandidate(row.id);
                          }}
                        >
                          Delete faculty
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
      <Dialog
        open={deleteDialogOpened}
        onClose={() => setDeleteDialogOpened(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete faculty</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete faculty?
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
                await deleteFaculty(deleteCandidate);
                await getAllFaculties();
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
    </>
  );
};

export default Faculties;
