import { Box, Fab, Grid, Pagination, Typography, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components';
import { useAppContext } from '../context';
import { ProductService } from '../services';
import { Product } from '../types';

const Products = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [products, setProducts] = useState<Product[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Gestion responsive pour petits écrans

    const getProducts = () => {
        setLoading(true);
        ProductService.getProducts(pageSelected, 9)
            .then((res) => {
                setProducts(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getProducts();
    }, [pageSelected]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                px: isSmallScreen ? 2 : 5, // Ajustement du padding pour petits écrans
            }}
        >
            <Typography variant="h2" sx={{ fontSize: isSmallScreen ? '1.5rem' : '2rem' }}>
                Les produits
            </Typography>

            {/* Bouton Ajouter un produit */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row', // Disposition verticale sur petits écrans
                    justifyContent: isSmallScreen ? 'center' : 'flex-end',
                    gap: 2,
                }}
            >
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    onClick={() => navigate('/product/create')}
                    sx={{ alignSelf: isSmallScreen ? 'center' : 'auto' }}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    Ajouter un produit
                </Fab>
            </Box>

            {/* Grille des produits */}
            <Grid container alignItems="center" rowSpacing={3} columnSpacing={2}>
                {products?.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <ProductCard product={product} displayShop={true} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination ou message Aucun produit */}
            {products?.length !== 0 ? (
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
                <Typography
                    variant="h6"
                    sx={{
                        mt: 2,
                        textAlign: 'center',
                        fontSize: isSmallScreen ? '1rem' : '1.25rem',
                    }}
                >
                    Aucun produit correspondant
                </Typography>
            )}
        </Box>
    );
};

export default Products;
