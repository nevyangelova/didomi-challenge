import {Consent} from '@/types/consents';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ConsentsTable({consents}: {consents: Consent[]}) {
    return (
        <TableContainer component={Paper} sx={{mb: 2}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Consent given for</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {consents.map((consent, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{consent.name}</TableCell>
                            <TableCell>{consent.email}</TableCell>
                            <TableCell>
                                {consent.consentGivenFor.join(', ')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
