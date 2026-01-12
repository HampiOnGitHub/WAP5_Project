import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const SESSION_DURATION = 2 * 60 * 60 * 1000;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("authUser");
        const loginTime = localStorage.getItem("authUserTime");

        if (storedUser && loginTime) {
            const elapsed = Date.now() - parseInt(loginTime, 10);
            if (elapsed < SESSION_DURATION) {
                setUser(JSON.parse(storedUser));
            } else {
                localStorage.removeItem("authUser");
                localStorage.removeItem("authUserTime");
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("authUser", JSON.stringify(userData));
        localStorage.setItem("authUserTime", Date.now().toString());
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("authUser");
        localStorage.removeItem("authUserTime");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
