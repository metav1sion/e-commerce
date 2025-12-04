import Card from "@mui/material/Card";
import type { IProduct } from "../../model/IProduct";
import { Button, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router";
import requests from "../../api/requests";
import { useState } from "react";

interface Props {
  product: IProduct;
}

const links = [
  { title: "Details", path: "/catalog/" },
];

function Product(props: Props) {

  const [loading, setLoading] = useState(false);

  const handleAddItem = (productId : number, quantity: number) => {
    setLoading(true);
    requests.Cart.addItem(productId,quantity)
                  .then(cart =>console.log(cart))
                  .catch((error) => console.log(error))
                  .finally(()=>setLoading(false));

  }

  return (
    <Card>
      <CardMedia 
        component="img"
        height="200"
        image={`http://localhost:5220/images/${props.product.imageUrl}`}
        alt={props.product.name}
        sx={{ 
          objectFit: 'contain',
          p: 2,
          backgroundColor: 'grey.50'
        }}
      />
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
        <Button size="small" variant="outlined" startIcon={<AddShoppingCartIcon />} disabled={!props.product.isActive || props.product.stock === 0} onClick={()=>handleAddItem(props.product.id,1)} loading = {loading}>Add to Cart</Button>
        <Button size="small" startIcon={<SearchIcon />} component={Link} to={links[0].path + props.product.id}>View</Button>
      </CardActions>
    </Card>
  );
}

export default Product;