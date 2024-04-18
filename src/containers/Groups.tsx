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
import {CircularProgress} from "@mui/material";
import {Group} from "../types/group";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

function createData(
    id: string,
    name: string,
    start: Date,
    finish: Date,
) {
    return { id, name, start, finish };
}

const Groups: FC = () => {
    const [rows, setRow] = useState<any | null>(null);
    const { groups , getAllGroups } = useGroups();
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const getRows = (data: Group[]) => data?.map((group) => {
        const { finish, start, name, id } = group;
        return createData(id, name, start, finish);
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
                Groups
            </Typography>
            <Box sx={{py: 2}}>
                <Button
                    variant={'contained'}
                    color={'success'}
                    onClick={() => navigate('/admin/group')}
                >
                    Add group
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Education start</TableCell>
                            <TableCell align="right">Education finish</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: { id: string, name: string; start: string; finish: string }) => (
                            <TableRow
                                style={{ cursor: 'pointer' }}
                                hover={true}
                                onClick={() => navigate(`/admin/group/${row.id}`)}
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row.name}</TableCell>
                                <TableCell align="right">{dayjs(row.start).format('DD MMMM YYYY')}</TableCell>
                                <TableCell align="right">{dayjs(row.finish).format('DD MMMM YYYY')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default Groups;