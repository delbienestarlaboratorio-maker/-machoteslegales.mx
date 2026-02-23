import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const urlOptions = new URL(request.url);

        // 1. Obtener los Headers y la Firma de MercadoPago
        const bodyText = await request.text();
        const signatureHeader = request.headers.get('x-signature');
        const requestId = request.headers.get('x-request-id');

        // Validación básica 1: ¿Es una petición vacía?
        if (!bodyText) {
            return new NextResponse('Bad Request', { status: 400 });
        }

        const body = JSON.parse(bodyText);

        // Validación básica 2: Verificar Webhook secreto si tienes en Producción (Opcional, pero recomendado)
        // const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
        // Si utilizas verificación HmacSHA256 aquí es donde lo harías cruzando el body con tu Secret.

        console.log(`[Webhook MP] Received action: ${body.action} | type: ${body.type}`);

        // 2. Procesar el pago si es tipo 'payment' y su evento es 'payment.created' o 'payment.updated'
        if (body.type === 'payment') {
            const paymentId = body.data.id;
            console.log(`[Webhook MP] Procesando Pago ID: ${paymentId}`);

            // 3. COMUNICACIÓN HACIA TU BACKEND DE PYTHON (FASTAPI)
            // Aquí en lugar de hablar con la BD Directo, Next.js le avisa a Tilde Legal (Python):
            // "Oye, MercadoPago dice que el pago X fue exitoso, dáselo al usuario Y"
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

            // Asumiendo que has protegido este endpoint en Python con algún Token de Servicio interno:
            const pythonRes = await fetch(`${API_URL}/orders/webhook/mercadopago`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.INTERNAL_SERVICE_TOKEN || 'test-service-token'}`
                },
                body: JSON.stringify({ payment_id: paymentId, topic: body.type })
            });

            if (!pythonRes.ok) {
                console.error(`[Webhook MP] Falló al notificar Python: ${pythonRes.statusText}`);
                // Si falla, MP lo reintentará. Devolvemos 500.
                return new NextResponse('Internal Server Error', { status: 500 });
            }
        }

        // 4. Si todo salió bien, respondemos con 200 OK inmediatamente (Obligatorio en Webhooks MP)
        return new NextResponse('OK', { status: 200 });

    } catch (error) {
        console.error('[Webhook MP] Unhandled Exception:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
