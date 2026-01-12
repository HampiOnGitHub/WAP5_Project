import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

function App() {
    const { t } = useTranslation();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t("home.title")}
            </Typography>

            <Typography variant="body1">
                {t("home.welcomeMessage")}
            </Typography>
        </Box>
    );
}

export default App;
