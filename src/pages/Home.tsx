import {
    Box,
    Fab,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filters, ShopCard } from '../components';
import { useAppContext } from '../context';
import { ShopService } from '../services';
import { ResponseArray, Shop } from '../types';
import { Dayjs } from 'dayjs';

type FiltersType = {
    inVacations: string;
    createdAfter: Dayjs | null;
    createdBefore: Dayjs | null;
};

const transformFiltersToURL = (filters: FiltersType & { search: string }): string => {
    const transform = {
        ...filters,
        createdAfter: filters.createdAfter?.format('YYYY-MM-DD'),
        createdBefore: filters.createdBefore?.format('YYYY-MM-DD'),
    };

    let url = '';
    for (const [key, value] of Object.entries(transform)) {
        if (value) {
            url += `&${key}=${encodeURIComponent(value)}`;
        }
    }

    return url;
};

const Home = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [shops, setShops] = useState<Shop[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const [sort, setSort] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filters, setFilters] = useState<FiltersType>({
        inVacations: '',
        createdAfter: null,
        createdBefore: null,
    });

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const getShops = () => {
        setLoading(true);
        let promisedShops: Promise<ResponseArray<Shop>>;
        const allFilters = {
            ...filters,
            search: searchTerm,
        };
        const urlFilters = transformFiltersToURL(allFilters);

        if (sort) {
            promisedShops = ShopService.getShopsSorted(pageSelected, 9, sort);
        } else if (urlFilters) {
            promisedShops = ShopService.getShopsFiltered(pageSelected, 9, urlFilters);
        } else {
            promisedShops = ShopService.getShops(pageSelected, 9);
        }
        promisedShops
            .then((res) => {
                setShops(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            getShops();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, pageSelected, sort, filters]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    const handleChangeSort = (event: SelectChangeEvent) => {
        setSort(event.target.value as string);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                px: isSmallScreen ? 2 : 5,
            }}
        >
            <Typography variant="h4" textAlign="center">
                Les boutiques
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: isSmallScreen ? 'center' : 'flex-end',
                }}
            >
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    onClick={() => navigate('/shop/create')}
                    sx={{ px: 2 }}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    {isSmallScreen ? 'Ajouter' : 'Ajouter une boutique'}
                </Fab>
            </Box>

            <TextField
                label="Rechercher"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: isSmallScreen ? 'center' : 'space-between',
                    gap: 2,
                }}
            >
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="sort-select-label">Trier par</InputLabel>
                    <Select
                        labelId="sort-select-label"
                        id="sort-select"
                        value={sort}
                        label="Trier par"
                        onChange={handleChangeSort}
                    >
                        <MenuItem value="">
                            <em>Aucun</em>
                        </MenuItem>
                        <MenuItem value="name">Nom</MenuItem>
                        <MenuItem value="createdAt">Date de création</MenuItem>
                        <MenuItem value="nbProducts">Nombre de produits</MenuItem>
                    </Select>
                </FormControl>

                <Filters
                    filters={filters}
                    onFilterChange={setFilters}
                    setSort={setSort}
                    sort={sort}
                />
            </Box>

            <Grid container alignItems="center" rowSpacing={3} columnSpacing={3}>
                {shops?.map((shop) => (
                    <Grid item key={shop.id} xs={12} sm={6} md={4}>
                        <ShopCard shop={shop} />
                    </Grid>
                ))}
            </Grid>

            {shops?.length !== 0 ? (
                <Pagination
                    count={count}
                    page={page}
                    siblingCount={1}
                    onChange={handleChangePagination}
                    sx={{
                        mt: 2,
                        '& .MuiPagination-ul': { justifyContent: 'center' },
                    }}
                />
            ) : (
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Aucune boutique correspondante
                </Typography>
            )}
        </Box>
    );
};

export default Home;
