import Card from "@mui/material/Card";
import type { IProduct } from "../model/IProduct";
import { Button, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

interface Props {
  product: IProduct;
}

function Product(props: Props) {
  return (
    <Card>
      <CardMedia sx={{ height: 140, backgroundSize: "contain" }} image={`http://localhost:5220/images/${props.product.imageUrl}`}/>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.product.description}
        </Typography>
        <Typography variant="h6" color="text.primary">
          {(props.product.price)} TL
        </Typography>
        <Typography variant="body2" color={props.product.stock > 0 ? "green" : "red"}>
          {props.product.stock > 0 ? "In Stock" : "Out of Stock"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="outlined" startIcon={<AddShoppingCartIcon />} disabled={!props.product.isActive || props.product.stock === 0}>Add to Cart</Button>
        <Button size="small">View</Button>
      </CardActions>
    </Card>
  );
}

export default Product;