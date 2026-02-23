"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
    templateId: string;
    title: string;
    price: number;
    className?: string;
    children: React.ReactNode;
}

export default function CheckoutButton({ templateId, title, price, className, children }: CheckoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const handleCheckout = async () => {
        if (!session) {
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: templateId,
                    title: title,
                    price: price,
                }),
            });

            const data = await res.json();

            if (data.init_point) {
                // Redirigir al usuario al Checkout de Clip
                window.location.href = data.init_point;
            } else {
                console.error("Error al generar link de pago Clip:", data);
                alert("Hubo un error al iniciar el pago. Intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error en checkout:", error);
            alert("Error de conexión. Intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            className={className}
            disabled={loading}
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Procesando...
                </span>
            ) : children}
        </button>
    );
}
