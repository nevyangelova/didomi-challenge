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
            <Table sx={{tableLayout: 'fixed'}}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{width: '25%'}}>Name</TableCell>
                        <TableCell sx={{width: '35%'}}>Email</TableCell>
                        <TableCell sx={{width: '40%'}}>
                            Consent given for
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {consents.map((consent, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{width: '25%'}}>
                                {consent.name}
                            </TableCell>
                            <TableCell sx={{width: '35%'}}>
                                {consent.email}
                            </TableCell>
                            <TableCell sx={{width: '40%'}}>
                                {consent.consentGivenFor.join(', ')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
