import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Tu Cuenta",
            credentials: {
                username: { label: "Correo Electrónico", type: "email", placeholder: "tu@email.com" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Credenciales incompletas");
                }

                try {
                    // Petición al Backend de FastAPI en el puerto 4000
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password
                        })
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.detail || "Correo o contraseña incorrectos");
                    }

                    // data.access_token contiene el JWT expedido por FastAPI
                    // Aquí construimos el objeto usuario que NextAuth guardará en cookie
                    return {
                        id: credentials.username, // Podrías decodificar el JWT para tener el ID real si es necesario
                        email: credentials.username,
                        accessToken: data.access_token,
                        // Suponiendo que tu API devuelve info del usuario o la puedes obtener aquí:
                        // role: data.role 
                    };

                } catch (error: any) {
                    throw new Error(error.message || "Error conectando con el servidor");
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
    callbacks: {
        // En cada petición añadimos el token JWT de FastAPI a la sesión de NextAuth
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || (() => { throw new Error("NEXTAUTH_SECRET es obligatorio. Configúralo en .env.local"); })(),
};
