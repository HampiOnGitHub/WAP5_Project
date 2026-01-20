import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme, useMediaQuery } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function App() {
    const { t } = useTranslation();
    const theme = useTheme();
    const showNavigation = useMediaQuery(theme.breakpoints.up("md"));
    const { user, accessToken } = useAuth();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const carouselImages = [
        "/images/tennis.jpg",
        "/images/volleyball.jpg",
        "/images/basketball.jpg",
    ];

    const cardImages = {
        football: "/images/football.jpg",
        tennis: "/images/tennisCard.jpg",
        volleyball: "/images/volleyballCard.jpg",
        basketball: "/images/basketballCard.jpg",
        running: "/images/running.jpg",
        fitness: "/images/fitness.jpg",
        swimming: "/images/swimming.jpg",
        skiing: "/images/skiing.jpg",
        golf: "/images/golf.jpg",
        gymnastics: "/images/gymnastics.jpg",
        bouldering: "/images/bouldering.jpg",
        other: "/images/other.jpg",
    };

    // 🔌 EVENTS VOM BACKEND LADEN
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/events`,
                    {
                        headers: accessToken
                            ? { Authorization: `Bearer ${accessToken}` }
                            : {},
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to load events");
                }

                const data = await res.json();
                setActivities(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [accessToken]);

    function ActivitiesSection() {
        const now = new Date();
        const futureActivities = activities.filter(
            (activity) =>
                activity.dateAndTime &&
                new Date(activity.dateAndTime) > now
        );

        return (
            <Box
                sx={{
                    py: 8,
                    px: { xs: 2, md: 4 },
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Typography variant="h4" gutterBottom textAlign="center">
                    {t("home.exploreActivities")}
                </Typography>

                {futureActivities.length === 0 ? (
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        textAlign="center"
                        sx={{ mb: 2, color: "text.secondary" }}
                    >
                        {t("home.noActivities")}
                    </Typography>
                ) : (
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        textAlign="center"
                        sx={{ mb: 2, color: "text.secondary" }}
                    >
                        {t("home.exploreActivitiesDesc")}
                    </Typography>
                )}

                <Box textAlign="center" gutterBottom sx={{ mb: 4 }}>
                    {user ? (
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            to="/event/eventCreate"
                        >
                            {t("home.createEvent")}
                        </Button>
                    ) : (
                        <Typography
                            variant="subtitle1"
                            gutterBottom
                            textAlign="center"
                            sx={{ mb: 4, color: "text.secondary" }}
                        >
                            {t("home.loginToCreate")}
                        </Typography>
                    )}
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {futureActivities.map((activity) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={activity._id}
                        >
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt={activity.sport}
                                    height="140"
                                    image={
                                        cardImages[activity.sport] ||
                                        "/images/other.jpg"
                                    }
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                    >
                                        {t("sports." + activity.sport)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "text.secondary" }}
                                    >
                                        {t("home.date")}
                                        {new Date(
                                            activity.dateAndTime
                                        ).toLocaleString()}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "text.secondary" }}
                                    >
                                        {activity.participants?.length ?? 0} /{" "}
                                        {activity.maxParticipants}{" "}
                                        {t("home.activityParticipants")}
                                    </Typography>
                                </CardContent>

                                <CardActions>
                                    {user ? (
                                        <>
                                            {activity.participants.some(
                                                (p) =>
                                                    p.username ===
                                                    user.username
                                            ) ? (
                                                <>
                                                    <CheckCircleIcon color="success" />
                                                    &nbsp;
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "green",
                                                            display:
                                                                "inline-block",
                                                        }}
                                                    >
                                                        {t(
                                                            "home.signedUpAlready"
                                                        )}
                                                    </Typography>
                                                    &nbsp;
                                                    <Button
                                                        size="small"
                                                        component={Link}
                                                        to={`/event/${activity._id}`}
                                                    >
                                                        {t("home.seeMore")}
                                                    </Button>
                                                </>
                                            ) : activity.participants.length <
                                            activity.maxParticipants ? (
                                                <Button
                                                    size="small"
                                                    component={Link}
                                                    to={`/event/${activity._id}`}
                                                >
                                                    {t(
                                                        "home.seeMoreAndSignUp"
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="small"
                                                    component={Link}
                                                    to={`/event/${activity._id}`}
                                                >
                                                    {t("home.seeMore")}
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <Button size="small" disabled>
                                            {t("home.seeNoMore")}
                                        </Button>
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
                    {carouselImages.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <Box
                                sx={{
                                    height: { xs: 300, md: 500 },
                                    backgroundImage: `url(${slide})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>

            {!loading && <ActivitiesSection />}
        </>
    );
}

export default App;
