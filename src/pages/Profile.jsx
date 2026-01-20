import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";

function Profile() {
    const { t } = useTranslation();
    const { user, accessToken } = useAuth();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const now = new Date();

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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(
                    `api/events`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!res.ok) throw new Error();

                const data = await res.json();
                setActivities(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchEvents();
        }
    }, [accessToken]);

    if (!user) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography>{t("home.loginToCreate")}</Typography>
            </Box>
        );
    }

    const isParticipant = (activity) =>
        activity.participants?.some(
            (p) => p.username === user.username
        );

    const isOrganizer = (activity) =>
        activity.participants?.[0]?.username === user.username;

    const upcomingEvents = activities.filter((activity) => {
        if (!activity.dateAndTime) return false;

        const eventDate = new Date(activity.dateAndTime);
        return (
            eventDate > now &&
            (isOrganizer(activity) || isParticipant(activity))
        );
    });

    const pastEvents = activities.filter((activity) => {
        if (!activity.dateAndTime) return false;

        const eventDate = new Date(activity.dateAndTime);
        return eventDate < now && isParticipant(activity);
    });

    const renderEventCards = (events) => (
        <Grid container spacing={4}>
            {events.map((activity) => (
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
                            height="140"
                            image={
                                cardImages[activity.sport] ||
                                "/images/other.jpg"
                            }
                            alt={activity.sport}
                        />
                        <CardContent>
                            <Typography variant="h5">
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
                            {isParticipant(activity) && (
                                <>
                                    <CheckCircleIcon color="success" />
                                    &nbsp;
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "green",
                                            display: "inline-block",
                                        }}
                                    >
                                        {t("home.signedUpAlready")}
                                    </Typography>
                                    &nbsp;
                                </>
                            )}
                            <Button
                                size="small"
                                component={Link}
                                to={`/event/${activity._id}`}
                            >
                                {t("home.seeMore")}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    if (loading) {
        return <Typography sx={{ p: 4 }}>{t("home.loading")}</Typography>;
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3">
                    {user.username}
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ color: "text.secondary" }}
                >
                    {t("profile.userSince")}{" "}
                    {new Date().toLocaleDateString()}
                </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Upcoming Events */}
            <Typography variant="h4" gutterBottom>
                {t("profile.upcomingEvents")}
            </Typography>

            {upcomingEvents.length === 0 ? (
                <Typography sx={{ mb: 4, color: "text.secondary" }}>
                    {t("profile.noUpcomingEvents")}
                </Typography>
            ) : (
                <Box sx={{ mb: 6 }}>
                    {renderEventCards(upcomingEvents)}
                </Box>
            )}

            <Typography variant="h4" gutterBottom>
                {t("profile.pastEvents")}
            </Typography>

            {pastEvents.length === 0 ? (
                <Typography sx={{ color: "text.secondary" }}>
                    {t("profile.noPastEvents")}
                </Typography>
            ) : (
                renderEventCards(pastEvents)
            )}
        </Box>
    );
}

export default Profile;
