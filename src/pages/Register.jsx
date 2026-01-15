import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


function Register() {
    const { t } = useTranslation();

    const [userName, setUserName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const [verificationCode, setVerificationCode] = useState(null);
    const [inputCode, setInputCode] = useState("");

    const navigate = useNavigate();


    const validate = () => {
        const newErrors = {};

        if (!userName.trim()) newErrors.userName = t("errors.usernameRequired");
        if (!firstName.trim()) newErrors.firstName = t("errors.firstNameRequired");
        if (!lastName.trim()) newErrors.lastName = t("errors.lastNameRequired");
        if (!email.trim()) newErrors.email = t("errors.emailRequired");
        if (!password) newErrors.password = t("errors.passwordRequired");
        if (!confirmPassword) newErrors.confirmPassword = t("errors.confirmPasswordRequired");
        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = t("errors.passwordsDoNotMatch");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (verificationCode) {
            if (parseInt(inputCode) === verificationCode) {
                console.log("User verified successfully!");
                alert(t("messages.registrationCompleted"));
                navigate("/login");
            } else {
                setServerError(t("errors.invalidVerificationCode"));
            }
            return;
        }

        if (!validate()) return;

        setLoading(true);
        try {
            let data;

            // mock
            if (!import.meta.env.VITE_API_URL) {
                await new Promise((res) => setTimeout(res, 1000));
                data = { success: true, message: "Mock registration OK" };
            } else {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/auth/register`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: userName,
                            firstName,
                            lastName,
                            email,
                            password,
                        }),
                    }
                );
                data = await response.json();
                if (!response.ok) {
                    setServerError(data.message || t("errors.registrationFailed"));
                    return;
                }
            }

            console.log("Registration successful", data);

            const code = Math.floor(100000 + Math.random() * 900000);
            setVerificationCode(code);
            console.log("Verification code (mock):", code);

        } catch (err) {
            setServerError(t("errors.serverNotReachable"));
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: 360,
                padding: 4,
                margin: "40px auto",
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: 3,
            }}
        >
            <Typography variant="h5" align="center">
                {t("register.title")}
            </Typography>

            {!verificationCode ? (
                <>
                    <TextField
                        label={t("register.username")}
                        required
                        variant="outlined"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        error={!!errors.userName}
                        helperText={errors.userName}
                    />
                    <TextField
                        label={t("register.firstName")}
                        required
                        variant="outlined"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                    />
                    <TextField
                        label={t("register.lastName")}
                        required
                        variant="outlined"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />
                    <TextField
                        label={t("register.email")}
                        type="email"
                        required
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label={t("register.password")}
                        type="password"
                        required
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        label={t("register.confirmPassword")}
                        type="password"
                        required
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                </>
            ) : (
                <>
                    <Typography align="center" color="primary">
                        {t("register.verificationSent")}
                    </Typography>
                    <TextField
                        label={t("register.verificationCode")}
                        required
                        variant="outlined"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                    />
                </>
            )}

            {serverError && (
                <Typography color="error" align="center">
                    {serverError}
                </Typography>
            )}

            <Button type="submit" variant="contained" disabled={loading}>
                {loading
                    ? t("register.processing")
                    : !verificationCode
                        ? t("register.registerButton")
                        : t("register.verifyButton")}
            </Button>
        </Box>
    );
}

export default Register;
