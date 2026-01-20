const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw err;
    }

    return res.json();
}
