import React from 'react';
import { Card, Container, Typography } from '@mui/material';
import { useLocation } from 'react-router';

function ServerError() {

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
                        Server Error
                    </Typography>
                )
            }
        </Container>
        
    );
}

export default ServerError;