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

const Home = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [shops, setShops] = useState<Shop[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const [sort, setSort] = useState<string>('');
    const [filters, setFilters] = useState<string>('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Small screens

    const getShops = () => {
        setLoading(true);
        let promisedShops: Promise<ResponseArray<Shop>>;
        if (sort) {
            promisedShops = ShopService.getShopsSorted(pageSelected, 9, sort);
        } else if (filters) {
            promisedShops = ShopService.getShopsFiltered(pageSelected, 9, filters);
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
        getShops();
    }, [pageSelected, sort, filters]);

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
                px: isSmallScreen ? 2 : 5, // Padding for smaller screens
            }}
        >
            <Typography variant="h4" textAlign="center">
                Les boutiques
            </Typography>

            {/* Bouton Ajouter */}
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

            {/* Tri et Filtres */}
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

                <Filters setUrlFilters={setFilters} setSort={setSort} sort={sort} />
            </Box>

            {/* Liste des boutiques */}
            <Grid container alignItems="center" rowSpacing={3} columnSpacing={3}>
                {shops?.map((shop) => (
                    <Grid item key={shop.id} xs={12} sm={6} md={4}>
                        <ShopCard shop={shop} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
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
