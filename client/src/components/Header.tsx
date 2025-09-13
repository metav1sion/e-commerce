import { AppBar, Typography } from "@mui/material";
import type { IProduct } from "../model/IProduct";

interface Props {
  products: IProduct[];
}

function Header(props: Props) {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Typography variant="h6">E-Commerce</Typography>
    </AppBar>
  );
}

export default Header;
