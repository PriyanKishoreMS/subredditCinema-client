import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
	accessToken: string | null;
	refreshToken: string | null;
	user: {
		username: string;
		id: string;
		avatar: string;
	} | null;
	login: (
		tokens: { accessToken: string; refreshToken: string },
		user: { username: string; id: string; avatar: string }
	) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [accessToken, setAccessToken] = useState<string | null>(
		localStorage.getItem("accessToken")
	);
	const [refreshToken, setRefreshToken] = useState<string | null>(
		localStorage.getItem("refreshToken")
	);
	const [user, setUser] = useState<AuthContextType["user"]>(
		accessToken
			? {
					username: localStorage.getItem("username") || "",
					id: localStorage.getItem("id") || "",
					avatar: localStorage.getItem("avatar") || "",
				}
			: null
	);

	const login = (
		tokens: { accessToken: string; refreshToken: string },
		userData: { username: string; id: string; avatar: string }
	) => {
		setAccessToken(tokens.accessToken);
		setRefreshToken(tokens.refreshToken);
		setUser(userData);
		localStorage.setItem("username", userData.username);
		localStorage.setItem("avatar", userData.avatar);
		localStorage.setItem("id", userData.id);
		localStorage.setItem("accessToken", tokens.accessToken);
		localStorage.setItem("refreshToken", tokens.refreshToken);
	};

	const logout = () => {
		setAccessToken(null);
		setRefreshToken(null);
		setUser(null);
		localStorage.removeItem("username");
		localStorage.removeItem("avatar");
		localStorage.removeItem("id");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	};

	useEffect(() => {
		setUser(
			accessToken
				? {
						username: localStorage.getItem("username") || "",
						id: localStorage.getItem("id") || "",
						avatar: localStorage.getItem("avatar") || "",
					}
				: null
		);
		setAccessToken(localStorage.getItem("accessToken"));
		console.log("here starting");
	}, []);

	return (
		<AuthContext.Provider
			value={{ accessToken, refreshToken, user, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
