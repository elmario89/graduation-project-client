import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {FC, useEffect, useState} from "react";
import {useGroups} from "../providers/GroupsProvider";
import {
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack
} from "@mui/material";
import {Group} from "../types/group";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

function createData(
    id: string,
    facultyName: string,
    name: string,
    start: Date,
    finish: Date,
) {
    return { id, name, start, finish, facultyName };
}

const Groups: FC = () => {
    const [rows, setRow] = useState<any | null>(null);
    const { groups , getAllGroups, deleteGroup } = useGroups();
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteDialogOpened, setDeleteDialogOpened] =
        React.useState<boolean>(false);
    const [deleteCandidate, setDeleteCandidate] =
        React.useState<string | null>(null);

    const navigate = useNavigate();

    const getRows = (data: Group[]) => data?.map((group) => {
        const { id, finish, start, name, faculty } = group;
        return createData(id, faculty.name, name, start, finish);
    })

    useEffect( () => {
        getAllGroups()
            .then(() => setLoading(false));
    }, []);

    useEffect( () => {
        if (groups) {
            setRow(getRows(groups));
        }
    }, [groups]);

    if (loading || !groups || !rows) {
        return (
            <div
                style={{
                    height: '100vh',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Группы
            </Typography>
            <Box sx={{py: 2}}>
                <Button
                    variant={'contained'}
                    color={'success'}
                    onClick={() => navigate('/admin/group')}
                >
                    Добавить группу
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    <Alert severity="warning">Групп нет, попробуйте добавить одну</Alert>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Название</TableCell>
                                    <TableCell>Институт</TableCell>
                                    <TableCell align="right">Начало обучения</TableCell>
                                    <TableCell align="right">Конец обучения</TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row: { id: string; facultyName: string; name: string; start: string; finish: string }) => (
                                    <TableRow
                                        style={{ cursor: 'pointer' }}
                                        hover={true}
                                        onClick={() => navigate(`/admin/group/${row.id}`)}
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                        <TableCell component="th" scope="row">{row.facultyName}</TableCell>
                                        <TableCell align="right">{dayjs(row.start).format('DD MMMM YYYY')}</TableCell>
                                        <TableCell align="right">{dayjs(row.finish).format('DD MMMM YYYY')}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                type={'submit'}
                                                variant="contained"
                                                color="warning"
                                                onClick={() => navigate(`/admin/group/${row.id}`)}
                                            >
                                                Обновить группу
                                            </Button>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                type={'submit'}
                                                variant="contained"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteDialogOpened(true);
                                                    setDeleteCandidate(row.id);
                                                }}
                                            >
                                                Удалить группу
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                <DialogTitle id="alert-dialog-title">
                    Удалить группу
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Вы уверены что хотите удалить группу?
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
                                await deleteGroup(deleteCandidate);
                                await getAllGroups();
                                setLoading(false);
                            }
                        }}
                    >
                        Удалить
                    </Button>
                    <Button variant="contained" color="success" onClick={() => setDeleteDialogOpened(false)} autoFocus>
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Groups;