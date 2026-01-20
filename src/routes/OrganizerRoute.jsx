import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

function OrganizerRoute() {
    const { user, accessToken } = useAuth();
    const { activityId } = useParams();
    const [allowed, setAllowed] = useState(null);

    useEffect(() => {
        const checkOrganizer = async () => {
            if (!user || !accessToken) {
                setAllowed(false);
                return;
            }

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/events/${activityId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!res.ok) throw new Error();

                const activity = await res.json();

                const isOrganizer =
                    activity.participants?.[0]?.username === user.username;

                setAllowed(isOrganizer);
            } catch (err) {
                console.error(err);
                setAllowed(false);
            }
        };

        checkOrganizer();
    }, [user, accessToken, activityId]);

    if (allowed === null) return null;

    if (!allowed) {
        return <Navigate to={`/event/${activityId}`} replace />;
    }

    return <Outlet />;
}

export default OrganizerRoute;
