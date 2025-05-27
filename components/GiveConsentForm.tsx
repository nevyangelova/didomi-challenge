import {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import {addConsent} from '../services/consents';
import {CONSENT_OPTIONS} from '../constants/consents';
import {ConsentFormSchema, ConsentFormType} from '../types/consents';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {useConsentsContext} from '@/contexts/ConsentsContext';

export default function GiveConsentForm({onSuccess}: {onSuccess: () => void}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {refreshAndGoToLastPage} = useConsentsContext();
    // Using local state here is idiomatic for a single, self-contained form.
    const [form, setForm] = useState<ConsentFormType>({
        name: '',
        email: '',
        consentGivenFor: [],
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{[k: string]: string}>({});

    // The flat state object pattern is easy to update, and avoids prop-drilling or unnecessary context.
    const handleChange = (
        field: keyof ConsentFormType,
        value: string | string[]
    ) => {
        setForm((prev) => ({...prev, [field]: value}));
    };

    // Using a functional update to the state ensures we always work with the latest state, which is important in concurrent React.
    const handleCheckbox = (option: string) => {
        setForm((prev) => {
            const exists = prev.consentGivenFor.includes(option);
            return {
                ...prev,
                consentGivenFor: exists
                    ? prev.consentGivenFor.filter((c) => c !== option)
                    : [...prev.consentGivenFor, option],
            };
        });
    };

    /**
     * validate runs the Zod schema validation on the current form state.
     * This provides robust validation and clear error messages.
     * The schema is defined in a separate file (types/consents.ts) to promote reusability and consistency.
     */
    const validate = () => {
        const result = ConsentFormSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: {[k: string]: string} = {};
            for (const err of result.error.errors) {
                if (err.path[0]) fieldErrors[err.path[0]] = err.message;
            }
            setErrors(fieldErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    /**
     * After a successful submit, we call onSuccess to let the parent know to switch tabs or show a message.
     * The button is disabled while submitting to prevent double submissions.
     * Also we need to refresh the list after adding an new consent to display to the user.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            await addConsent(form);
            await refreshAndGoToLastPage();
            onSuccess();
        } finally {
            setSubmitting(false);
        }
    };

    // Compute form validity using Zod. This ensures the submit button is only enabled when the form is valid.
    const isFormValid = ConsentFormSchema.safeParse(form).success;

    return (
        <Paper
            sx={{
                p: {xs: 2, sm: 3},
                borderRadius: 2,
                maxWidth: 600,
                textAlign: 'center',
                mx: {xs: 2, sm: 'auto'},
            }}
            elevation={2}
            component='form'
            onSubmit={handleSubmit}
        >
            <Box
                display='flex'
                flexDirection={{xs: 'column', sm: 'row'}}
                gap={1}
                mb={2}
            >
                <TextField
                    label='Name'
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={validate}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                    size='small'
                    required
                />
                <TextField
                    label='Email address'
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={validate}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    size='small'
                    required
                />
            </Box>
            <Typography mb={1}>I agree to:</Typography>
            <Box
                sx={{
                    border: '1px solid #bbb',
                    borderRadius: 1.5,
                    p: {xs: 1, sm: 1.5},
                    mb: 2,
                    maxWidth: 400,
                    textAlign: 'left',
                    margin: '1rem auto',
                }}
            >
                {CONSENT_OPTIONS.map((option) => (
                    <FormControlLabel
                        key={option}
                        control={
                            <Checkbox
                                checked={form.consentGivenFor.includes(option)}
                                onChange={() => handleCheckbox(option)}
                                onBlur={validate}
                                size={isMobile ? 'small' : 'medium'}
                            />
                        }
                        label={option}
                        sx={{
                            fontSize: {xs: '0.875rem', sm: '1rem'},
                            '& .MuiFormControlLabel-label': {
                                fontSize: 'inherit',
                            },
                        }}
                    />
                ))}
                {errors.consentGivenFor && (
                    <FormHelperText error>
                        {errors.consentGivenFor}
                    </FormHelperText>
                )}
            </Box>
            <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={submitting || !isFormValid}
                sx={{
                    fontWeight: 600,
                    fontSize: {xs: 16, sm: 18},
                    py: {xs: 1, sm: 1.5},
                    px: {xs: 2, sm: 3},
                    borderRadius: 1,
                }}
            >
                Give consent
            </Button>
        </Paper>
    );
}
