import {Consent} from '@/types/consents';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export default function ConsentsTable({consents}: {consents: Consent[]}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <TableContainer component={Paper} sx={{mb: 2, overflowX: 'auto'}}>
            <Table sx={{tableLayout: 'fixed', minWidth: isMobile ? 300 : 600}}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{width: isMobile ? '40%' : '25%'}}>Name</TableCell>
                        {!isMobile && (
                            <TableCell sx={{width: '35%'}}>Email</TableCell>
                        )}
                        <TableCell sx={{width: isMobile ? '60%' : '40%'}}>
                            Consent given for
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {consents.map((consent, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{width: isMobile ? '40%' : '25%'}}>
                                {consent.name}
                            </TableCell>
                            {!isMobile && (
                                <TableCell sx={{width: '35%'}}>
                                    {consent.email}
                                </TableCell>
                            )}
                            <TableCell sx={{width: isMobile ? '60%' : '40%'}}>
                                {consent.consentGivenFor.join(', ')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
