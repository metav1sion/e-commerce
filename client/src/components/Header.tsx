import { AccountCircle, ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router";

const links = [
  { title: "Home", path: "/" },
  { title: "Catalog", path: "/catalog" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const navStyles = {
  color: "inherit",
  textDecoration: "none",
  "&:hover": { color: "text.primary" },
  "&.active": { color: "warning.main" }
};

function Header() {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Typography variant="h6">E-Commerce</Typography>
            <Stack direction="row">
              {
                links.map(
                  link => <Button component={NavLink} to={link.path} key={link.title} sx={navStyles}>{link.title}</Button>
                )
              }
            </Stack>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <Badge badgeContent={4} color="secondary">
              <ShoppingCart/>
            </Badge>
          </IconButton>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <Badge color="secondary">
              <AccountCircle/>
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
