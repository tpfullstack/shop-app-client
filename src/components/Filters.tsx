import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type FiltersType = {
    inVacations: string;
    createdAfter: Dayjs | null;
    createdBefore: Dayjs | null;
};

type Props = {
    filters: FiltersType;
    onFilterChange: (filters: FiltersType) => void;
    setSort: Dispatch<SetStateAction<string>>;
    sort: string;
};

const Filters = ({ filters, onFilterChange, setSort, sort }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [localFilters, setLocalFilters] = useState<FiltersType>(filters);
    const [dateError, setDateError] = useState<string>('');

    useEffect(() => {
        if (sort) setLocalFilters(filters);
    }, [sort, filters]);

    const handleClickButton = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDateError('');
    };

    const handleClear = () => {
        setLocalFilters({
            inVacations: '',
            createdAfter: null,
            createdBefore: null,
        });
        setDateError('');
    };

    const validateDates = (newFilters: FiltersType): boolean => {
        if (newFilters.createdAfter && newFilters.createdBefore) {
            if (newFilters.createdAfter.isAfter(newFilters.createdBefore)) {
                setDateError("La date 'Créée après' doit être antérieure à 'Créée avant'");
                return false;
            }
        }
        setDateError('');
        return true;
    };

    const handleChange = (key: string, value: string | Dayjs | null) => {
        const newFilters = { ...localFilters, [key]: value };
        if (key === 'createdAfter' || key === 'createdBefore') {
            validateDates(newFilters);
        }
        setLocalFilters(newFilters);
    };

    const handleValidate = () => {
        if (validateDates(localFilters)) {
            onFilterChange(localFilters);
            setSort('');
            setOpen(false);
        }
    };

    return (
        <>
            <Button variant="contained" onClick={handleClickButton}>
                Filtrer
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Filtrer les boutiques</DialogTitle>

                <DialogContent>
                    <FormControl fullWidth sx={{ marginTop: 2 }}>
                        <InputLabel id="demo-simple-select-label">Congé</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={localFilters.inVacations}
                            label="Congé"
                            onChange={(e) => handleChange('inVacations', e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Aucun</em>
                            </MenuItem>
                            <MenuItem value="true">En congé</MenuItem>
                            <MenuItem value="false">Pas en congé</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Créée après"
                            value={localFilters.createdAfter}
                            onChange={(v: Dayjs | null) => handleChange('createdAfter', v)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </DialogContent>

                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Créée avant"
                            value={localFilters.createdBefore}
                            onChange={(v: Dayjs | null) => handleChange('createdBefore', v)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    {dateError && (
                        <FormHelperText error>
                            {dateError}
                        </FormHelperText>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={handleClear}>
                        Effacer
                    </Button>
                    <Button autoFocus onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleValidate} disabled={!!dateError}>Valider</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Filters;
