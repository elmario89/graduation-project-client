import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {FC, useEffect, useState} from "react";
import {useFaculties} from "../providers/FacultiesProvider";
import {CircularProgress} from "@mui/material";
import {Faculty} from "../types/faculty";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

function createData(
    id: string,
    name: string,
) {
    return { id, name };
}

const Faculties: FC = () => {
    const [rows, setRow] = useState<any | null>(null);
    const { faculties , getAllFaculties } = useFaculties();
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const getRows = (data: Faculty[]) => data?.map((faculty) => {
        const { name, id } = faculty;
        return createData(id, name);
    })

    useEffect( () => {
        getAllFaculties()
            .then(() => setLoading(false));
    }, []);

    useEffect( () => {
        if (faculties) {
            setRow(getRows(faculties));
        }
    }, [faculties]);

    if (loading || !faculties || !rows) {
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
                Faculties
            </Typography>
            <Box sx={{py: 2}}>
                <Button
                    variant={'contained'}
                    color={'success'}
                    onClick={() => navigate('/admin/faculty')}
                >
                    Add faculty
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row: { id: string, name: string; start: string; finish: string }) => (
                            <TableRow
                                style={{ cursor: 'pointer' }}
                                hover={true}
                                onClick={() => navigate(`/admin/faculty/${row.id}`)}
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default Faculties;