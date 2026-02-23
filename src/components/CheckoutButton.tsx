"use client";

import { useState } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Asegúrate de agregar NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY a tu .env.local
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || 'TEST-00000000-0000-0000-0000-000000000000');

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
                // Redirigir al usuario al flujo de pago de MercadoPago
                window.location.href = data.init_point;
            } else {
                console.error("Error al generar URL de pago:", data);
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
            {loading ? "Generando pago..." : children}
        </button>
    );
}
