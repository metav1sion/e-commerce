import { 
    Button, 
    CircularProgress, 
    Divider, 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    Chip,
    Stack,
    Paper,
    ButtonGroup
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useParams } from "react-router";
import type { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {addItemToCart, deleteItemFromCart} from "../cart/cartSlice";

function ProductDetailsPage() {

    const { id } = useParams<{ id: string }>();
    const productId = id ? Number(id) : null;
    const [product, setProduct] = useState<IProduct | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const { cart, status } = useAppSelector((state) => state.cart);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (productId) {
            requests.Catalog.details(productId)
            .then(data => setProduct(data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
        }
        console.log("product", product);
    }, [productId]);

    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="80vh"
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!product) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="60vh"
            >
                <Typography variant="h5" color="text.secondary">
                    Product not found.
                </Typography>
            </Box>
        );
    }

    const handleAddItem = (productId : number, quantity: number) => {
        dispatch(addItemToCart({productId, quantity}))
            .then(() => {
                toast.success("Product added to cart");
            })
            .catch((error) => console.error("The product could not be added", error));
    }

    const handleRemoveItem = (productId : number, quantity: number) => {
        dispatch(deleteItemFromCart({productId, quantity})).then(()=> {
            toast.info("Product removed from cart");
        }).catch((error) => console.error("The product could not be removed", error));
    }

    const cartItem = cart?.items?.find(item => item.productId === product?.id);
    const quantityInCart = cartItem?.quantity || 0;

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Grid container spacing={4}>
                {/* Ürün Resmi */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            overflow: 'hidden',
                            backgroundColor: 'grey.50'
                        }}
                    >
                        <Box
                            component="img"
                            src={`http://localhost:5220/images/${product.imageUrl}`}
                            alt={product.name}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: 600,
                                objectFit: 'contain',
                                p: 3
                            }}
                        />
                    </Card>
                </Grid>

                {/* Ürün Bilgileri */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={3}>
                        {/* Başlık ve Stok Durumu */}
                        <Box>
                            <Typography 
                                variant="h4" 
                                component="h1" 
                                fontWeight="bold"
                                gutterBottom
                                sx={{ mb: 2 }}
                            >
                                {product.name}
                            </Typography>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                                {product.stock > 0 ? (
                                    <Chip 
                                        icon={<CheckCircleIcon />}
                                        label="In Stock"
                                        color="success"
                                        size="small"
                                    />
                                ) : (
                                    <Chip 
                                        icon={<CancelIcon />}
                                        label="Out of Stock"
                                        color="error"
                                        size="small"
                                    />
                                )}
                                {!product.isActive && (
                                    <Chip 
                                        label="Inactive"
                                        color="warning"
                                        size="small"
                                    />
                                )}
                            </Stack>
                        </Box>

                        <Divider />

                        {/* Fiyat */}
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                backgroundColor: 'primary.main',
                                color: 'white',
                                borderRadius: 2
                            }}
                        >
                            <Typography variant="h3" fontWeight="bold">
                                {product.price.toLocaleString('tr-TR')} ₺
                            </Typography>
                        </Paper>

                        {/* Açıklama */}
                        <Box>
                            <Typography 
                                variant="h6" 
                                fontWeight="600"
                                gutterBottom
                                sx={{ mb: 2 }}
                            >
                                Ürün Açıklaması
                            </Typography>
                            <Typography 
                                variant="body1" 
                                color="text.secondary"
                                sx={{ lineHeight: 1.8 }}
                            >
                                {product.description}
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Ürün Detayları */}
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Typography 
                                    variant="h6" 
                                    fontWeight="600"
                                    gutterBottom
                                    sx={{ mb: 2 }}
                                >
                                    Ürün Detayları
                                </Typography>
                                <Stack spacing={2}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography color="text.secondary">Ürün Adı:</Typography>
                                        <Typography fontWeight="500">{product.name}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography color="text.secondary">Stok Miktarı:</Typography>
                                        <Typography fontWeight="500">{product.stock} adet</Typography>
                                    </Box>
                                    <Divider />
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography color="text.secondary">Durum:</Typography>
                                        <Typography 
                                            fontWeight="500"
                                            color={product.isActive ? "success.main" : "warning.main"}
                                        >
                                            {product.isActive ? "Aktif" : "Pasif"}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Sepete Ekle / Adet Değiştirme */}
                        {quantityInCart === 0 ? (
                            <LoadingButton
                                variant="contained"
                                size="large"
                                fullWidth
                                startIcon={<AddShoppingCartIcon />} 
                                disabled={!product.isActive || product.stock === 0}
                                onClick={() => handleAddItem(product.id, 1)}
                                loading={status === "pendingAddItem" + product.id}
                                sx={{
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    textTransform: 'none'
                                }}
                            >
                                Sepete Ekle
                            </LoadingButton>
                        ) : (
                            <Box>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    align="center"
                                    sx={{ mb: 1 }}
                                >
                                    Sepetteki Miktar
                                </Typography>
                                <ButtonGroup 
                                    variant="contained" 
                                    size="large"
                                    fullWidth
                                    sx={{ 
                                        borderRadius: 2,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <LoadingButton
                                        onClick={() => handleRemoveItem(product.id, 1)}
                                        loading={status === "pendingDeleteItem" + product.id}
                                        sx={{
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        <RemoveIcon />
                                    </LoadingButton>
                                    <Button
                                        disabled
                                        sx={{ 
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            color: 'white !important',
                                            backgroundColor: 'primary.main !important',
                                            cursor: 'default !important',
                                            flexGrow: 1
                                        }}
                                    >
                                        {quantityInCart}
                                    </Button>
                                    <LoadingButton
                                        onClick={() => handleAddItem(product.id, 1)}
                                        disabled={quantityInCart >= product.stock}
                                        loading={status === "pendingAddItem" + product.id}
                                        sx={{
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        <AddIcon />
                                    </LoadingButton>
                                </ButtonGroup>
                            </Box>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ProductDetailsPage;