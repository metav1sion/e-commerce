import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography, Button, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Grid';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {addItemToCart, deleteItemFromCart} from "./cartSlice";
import {toast} from "react-toastify";
import type { CartItem } from "../../model/ICart";

function ShoppingCartPage(){

    const { cart, status } = useAppSelector((state) => state.cart);
    const dispatchCart = useAppDispatch();


    const handleAddItem = (productId : number, quantity: number) => {
        dispatchCart(addItemToCart({productId, quantity})).then(() =>{
            toast.success("Item Added!");
        }).catch((error) => {console.log(error)});
    }

    const handleDeleteItem = (productId : number, quantity: number) => {
        dispatchCart(deleteItemFromCart({productId, quantity})).then(()=> {
            toast.info("Product removed from cart");
        }).catch((error) => console.error("The product could not be removed", error));
    }

    // Fiyat formatlama
    const ccyFormat = (num: number): string => {
        return `${num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
    }

    // Toplam hesaplama
    const subtotal = cart?.items?.reduce((sum: number, item: CartItem) =>
        sum + (item.price * item.quantity), 0) || 0;


    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <Container>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" gap={3}>
                    <Typography variant="h4" color="text.secondary">
                        Sepetiniz Boş
                    </Typography>
                    <Button variant="contained" href="/catalog">
                        Alışverişe Başla
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
                Alışveriş Sepetim
            </Typography>

            <Grid container spacing={3}>
                {/* Sol taraf - Sepet Tablosu */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <TableContainer component={Paper} elevation={2}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ürün</TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Birim Fiyat</TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Miktar</TableCell>
                                    <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Toplam</TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>İşlemler</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.items.map((item: CartItem) => (
                                    <TableRow
                                        key={item.productId}
                                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                                    >
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Box
                                                    component="img"
                                                    src={`http://localhost:5220/images/${item.imgUrl}`}
                                                    alt={item.name}
                                                    sx={{ 
                                                        width: 80, 
                                                        height: 80, 
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                        border: '1px solid',
                                                        borderColor: 'divider'
                                                    }}
                                                />
                                                <Typography variant="body1" fontWeight="500">
                                                    {item.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1">
                                                {ccyFormat(item.price)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                                <LoadingButton
                                                    size="small"
                                                    color="primary"
                                                    sx={{ 
                                                        border: '1px solid',
                                                        borderColor: 'primary.main',
                                                        minWidth: '32px',
                                                        padding: '4px'
                                                    }}
                                                    onClick={() => handleDeleteItem(item.productId, 1)}
                                                    loading={status === "pendingDeleteItem" + item.productId}
                                                >
                                                    <Remove fontSize="small" />
                                                </LoadingButton>
                                                <Typography
                                                    variant="body1" 
                                                    fontWeight="bold"
                                                    sx={{ minWidth: 30, textAlign: 'center' }}
                                                >
                                                    {item.quantity}
                                                </Typography>
                                                <LoadingButton
                                                    size="small"
                                                    color="primary"
                                                    sx={{ 
                                                        border: '1px solid',
                                                        borderColor: 'primary.main',
                                                        minWidth: '32px',
                                                        padding: '4px'
                                                    }}
                                                    onClick={() => handleAddItem(item.productId, 1)}
                                                    loading={status === "pendingAddItem" + item.productId}
                                                >
                                                    <Add fontSize="small" />
                                                </LoadingButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body1" fontWeight="bold" color="primary">
                                                {ccyFormat(item.price * item.quantity)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <LoadingButton
                                                color="error"
                                                sx={{ 
                                                    '&:hover': { 
                                                        backgroundColor: 'error.light',
                                                        color: 'white'
                                                    },
                                                    minWidth: '40px',
                                                    padding: '8px'
                                                }}
                                                onClick={() => handleDeleteItem(item.productId, item.quantity)}
                                                loading={status === "pendingDeleteItem" + item.productId}
                                            >
                                                <Delete />
                                            </LoadingButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Sağ taraf - Sipariş Özeti */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Sipariş Özeti
                        </Typography>
                        <Box display="flex" justifyContent="space-between" sx={{ mb: 2, mt: 2 }}>
                            <Typography variant="body1" color="text.secondary">
                                Ara Toplam:
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                                {ccyFormat(subtotal)}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography variant="body1" color="text.secondary">
                                Kargo:
                            </Typography>
                            <Typography variant="body1" fontWeight="500" color="success.main">
                                Ücretsiz
                            </Typography>
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={{
                                pt: 2,
                                borderTop: '2px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Toplam:
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                {ccyFormat(subtotal)}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                mt: 3,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                textTransform: 'none'
                            }}
                        >
                            Siparişi Tamamla
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ShoppingCartPage;