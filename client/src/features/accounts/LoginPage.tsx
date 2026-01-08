import {Avatar, Box, Button, Container, TextField, Typography} from "@mui/material";
import Paper from "@mui/material/Paper";
import {LockOutlined} from "@mui/icons-material";
import {useState} from "react";
import type {ChangeEvent, FormEvent} from "react";
import requests from "../../api/requests.ts";

export default function LoginPage() {
    // const [username, setUsername] =  useState("");
    // const [password, setPassword] =  useState("");

    const [values, setValues] = useState({
        username: "",
        password: ""
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(values);
        requests.Account.login(values)
            .then((response) => {
                console.log("Login successful");
                console.log(response.token);
            })
            .catch((error) => {
                console.log("Login error:", error);
            });
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = e.target;
        setValues({
            ...values,
            [name]: value
        });
    }

    return (
        <Container maxWidth="xs">
            <Paper sx={{marginTop: 8, padding: 2}} elevation={3}>
                <Avatar sx = {{mx: "auto", color: "secondary.main", textAlign: "center", mb: 1}}>
                    <LockOutlined/>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{textAlign: "center"}}>Login</Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt:2}}>
                    <TextField
                        name="username"
                        value={values.username}
                        onChange={e=> handleInputChange(e)}
                        label={"Enter Username"}
                        fullWidth
                        required
                        autoFocus
                        sx={{mb:2}}
                        size="small"></TextField>
                    <TextField
                        name="password"
                        value={values.password}
                        onChange={e=> handleInputChange(e)}
                        label={"Enter Password"}
                        type="password"
                        fullWidth
                        required
                        sx={{mb:2}}
                        size="small"></TextField>
                    <Button type="submit" variant="contained" fullWidth sx={{mt:1}}>Login</Button>
                </Box>
            </Paper>
        </Container>
    )
}