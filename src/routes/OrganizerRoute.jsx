import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

function OrganizerRoute() {
    const { user } = useAuth();
    const { activityId } = useParams();
    const [allowed, setAllowed] = useState(null);

    useEffect(() => {
        if (!user) {
            setAllowed(false);
            return;
        }

        const activities = JSON.parse(localStorage.getItem("events")) || [];
        const activity = activities.find(a => a.localId.toString() === activityId);

        if (!activity) {
            setAllowed(false);
            return;
        }

        setAllowed(user.id === activity.creatorId);
    }, [user, activityId]);

    if (allowed === null) return null;

    if (!allowed) {
        return <Navigate to={`/event/${activityId}`} replace />;
    }

    return <Outlet />;
}

export default OrganizerRoute;
