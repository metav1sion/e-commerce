import { Alert, AlertTitle, List, ListItem, ListItemText } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useState } from "react";

function ErrorPage() {

    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    return (
        <>
        {
            validationErrors.length > 0 && (
                <Alert severity="error">
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {
                            validationErrors.map((error,index)=>(
                                <ListItem key={index}>
                                    <ListItemText>{error}</ListItemText>
                                </ListItem>
                            ))
                        }
                    </List>
                </Alert>
            )
        }
            <Button sx={{mr:2}} variant="contained" onClick={getServerError}>
            500 - Server Error.
            </Button>
            <Button sx={{ml:2}} variant="contained" onClick={getNotFoundError}>
                404 - Not Found.
            </Button>
            <Button sx={{ml:2}} variant="contained" onClick={getValidationError}>
                400 - Validation Error.
            </Button>
        </>
    );

    function getServerError() {
        axios.get('error/server-error');
    }
    function getNotFoundError() {
        axios.get('error/not-found');
    }
    function getValidationError() {
        axios.get('error/validation-error')
        .then(() => console.log("no validation errors"))
        .catch(errors => setValidationErrors(errors));
    }
}

export default ErrorPage;