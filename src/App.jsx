import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme, useMediaQuery } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";



import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Home } from "@mui/icons-material";

function App() {
    const { t } = useTranslation();
    const theme = useTheme();
    const showNavigation = useMediaQuery(theme.breakpoints.up("md"));
    const { user } = useAuth();


    const images = ["/images/tennis.jpg", "/images/volleyball.jpg", "/images/basketball.jpg"];

    const activities = [
        {
            activityId: 1,
            title: "Tennis",
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: "2026-07-15T10:00:00",
        },
        {
            activityId: 2,
            title: "Basketball",
            organizer: "Jonas Swag",
            description: "Entspanntes Basketballspiel für alle Levels.",
            img: "/images/basketball.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K.", "Max T."],
            maxParticipants: 10,
            dateAndTime: "2026-07-29T10:00:00",
        },
        {
            activityId: 3,
            title: "Tennis",
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: null,
        },
        {
            activityId: 4,
            title: "Tennis",
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: "2026-07-15T10:00:00",
        },
        {
            activityId: 5,
            title: "Tennis",
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: "2026-07-15T10:00:00",
        },
        {
            activityId: 6,
            title: "Tennisinvergangenheit",
            organizer: "Jonas Schön",
            description: "Entspanntes Tennisdoppel für alle Levels.",
            img: "/images/tennis.jpg",
            participants: ["Anna M.", "Lukas F.", "Sophie K."],
            maxParticipants: 4,
            dateAndTime: "2025-07-15T10:00:00",
        },
    ];


    function ActivitiesSection() {

        const now = new Date();
        const futureActivities = activities.filter((activity) => activity.dateAndTime && new Date(activity.dateAndTime) > now);

        return (
            <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: "#f9f9f9" }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    {t("home.exploreActivities")}
                </Typography>
                <Typography variant="subtitle1" gutterBottom textAlign="center" sx={{ mb: 4, color: "text.secondary" }}>
                    {t("home.exploreActivitiesDesc")}
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {futureActivities.map((activity, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt={activity.title}
                                    height="140"
                                    image={activity.img}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {activity.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {t("home.date")}{new Date(activity.dateAndTime).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {(activity.participants?.length ?? 0)} / {activity.maxParticipants} {t("home.activityParticipants")}
                                    </Typography>

                                </CardContent>
                                <CardActions>
                                    {user ? (
                                        <Button size="small" component={Link} to={`/event/${activity.activityId}`}>{t("home.seeMore")}</Button>
                                    ) : (
                                        <Button size="small" disabled>{t("home.seeNoMore")}</Button>
                                    )}                                    
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <>

            <Box sx={{ position: "relative" }}>
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        pointerEvents: "none",
                        zIndex: 2,
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "#fff",
                            p: { xs: 2, md: 4 },
                            borderRadius: 2,
                            maxWidth: 600,
                        }}
                    >
                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                                fontSize: "clamp(1.75rem, 6vw, 3.5rem)",
                                lineHeight: 1.1,
                            }}
                        >
                            {t("home.title")}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: "clamp(1rem, 3vw, 1.5rem)",
                                opacity: 0.9,
                            }}
                        >
                            {t("home.welcomeMessage")}
                        </Typography>
                    </Box>
                </Box>

                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    autoplay={{ delay: 8000 }}
                    navigation={showNavigation}
                    pagination={{ clickable: true }}
                    loop
                >
                    {images.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                sx={{
                                    height: { xs: 300, md: 500 },
                                    backgroundImage: `url(${slide})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    zIndex: -1,
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            <ActivitiesSection />
        </>
    );
}

export default App;
