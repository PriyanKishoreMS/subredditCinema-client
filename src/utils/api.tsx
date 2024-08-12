import { useAuth } from "../contexts/AuthContext";

const BASE_URL = "http://localhost:3000";

export const useApi = () => {
	const { accessToken, refreshToken, logout } = useAuth();

	const fetchWithToken = async (url: string, options: RequestInit = {}) => {
		if (!accessToken) {
			return fetchWithoutToken(url, options);
		}

		const headers = new Headers(options.headers);
		headers.set("Authorization", `Bearer ${accessToken}`);

		const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });

		if (response.status === 401) {
			console.log("Refreshing token...");
			const refreshResponse = await fetch(`${BASE_URL}/refresh`, {
				headers: { Authorization: `Bearer ${refreshToken}` },
			});

			if (refreshResponse.ok) {
				const { accessToken: newAccessToken } = await refreshResponse.json();
				console.log("Token refreshed successfully");
				localStorage.setItem("accessToken", newAccessToken);
				headers.set("Authorization", `Bearer ${newAccessToken}`);
				return fetch(`${BASE_URL}${url}`, { ...options, headers });
			} else {
				logout();
				throw new Error("Session expired. Please login again.");
			}
		}

		return response;
	};

	const fetchWithoutToken = async (url: string, options: RequestInit = {}) => {
		const headers = new Headers(options.headers);
		const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });

		return response;
	};

	return { fetchWithToken, fetchWithoutToken };
};
