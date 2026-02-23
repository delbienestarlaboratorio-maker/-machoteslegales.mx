// Cloudflare Pages Function — Checkout API (Clip Payments)
export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { itemId, title, price } = body;

        const CLIP_API_KEY = context.env.CLIP_API_KEY || '';
        const CLIP_SECRET_KEY = context.env.CLIP_SECRET_KEY || '';
        const baseUrl = context.env.NEXT_PUBLIC_BASE_URL || 'https://machoteslegales.mx';

        const credentials = `${CLIP_API_KEY}:${CLIP_SECRET_KEY}`;
        const authToken = btoa(credentials);

        const clipResponse = await fetch('https://api.payclip.com/v2/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authToken}`,
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
            return new Response(JSON.stringify({ error: 'Error generando link de pago', details: data }), {
                status: clipResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({
            id: data.id || data.payment_request_id,
            init_point: data.payment_request_url,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error generando link de pago' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
