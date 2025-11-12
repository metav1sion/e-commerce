import { Button, Card, Container, Typography } from "@mui/material";
import { NavLink, useLocation } from "react-router";

function NotFound() {
    
    const { state } = useLocation();

    return (
        <Container component={Card} sx={{p:3}}>
            {
                state?.error ? (
                <>
                    <Typography variant="h3" color="error" gutterBottom>
                        {state.error.title} - {state.status}
                    </Typography>
                    <Typography variant="body2"> {state.error.detail || "Unknown error occurred."}</Typography>
                </>
                ) : 
                (
                    <Typography variant="h3" color="error" gutterBottom>
                        Not Found
                    </Typography>
                )
            }
            <Button to="/catalog" variant="contained" component={NavLink} sx={{mt:3}}>Go to Catalog</Button>
        </Container>
    )
}

export default NotFound;