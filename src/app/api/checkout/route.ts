import { NextResponse } from 'next/server';

// Clip API V2 — Checkout Redireccionado
// Docs: https://developer.clip.mx/reference/createnewpaymentlink
const CLIP_API_KEY = process.env.CLIP_API_KEY || '';
const CLIP_SECRET_KEY = process.env.CLIP_SECRET_KEY || '';

function getClipAuthToken(): string {
    const credentials = `${CLIP_API_KEY}:${CLIP_SECRET_KEY}`;
    return Buffer.from(credentials).toString('base64');
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { itemId, title, price } = body;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://machoteslegales.mx';

        const clipResponse = await fetch('https://api.payclip.com/v2/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${getClipAuthToken()}`,
            },
            body: JSON.stringify({
                amount: Number(price),
                currency: 'MXN',
                purchase_description: title,
                redirection_url: {
                    success: `${baseUrl}/pago/exito?item=${itemId}`,
                    error: `${baseUrl}/pago/fallo`,
                    default: `${baseUrl}/pago/pendiente`,
                },
                metadata: {
                    me_reference_id: itemId,
                    customer_info: {
                        name: 'Cliente',
                        email: '',
                    },
                },
                override_settings: {
                    payment_method: ['CARD'],
                },
            }),
        });

        const data = await clipResponse.json();

        if (!clipResponse.ok) {
            console.error('Error Clip API:', data);
            return NextResponse.json(
                { error: 'Error generando link de pago', details: data },
                { status: clipResponse.status }
            );
        }

        // Clip devuelve payment_request_url para redirigir al usuario
        return NextResponse.json({
            id: data.id || data.payment_request_id,
            init_point: data.payment_request_url,
        });
    } catch (error) {
        console.error('Error en checkout Clip:', error);
        return NextResponse.json(
            { error: 'Error generando link de pago' },
            { status: 500 }
        );
    }
}
