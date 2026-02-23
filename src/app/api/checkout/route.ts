import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Asegúrate de agregar MERCADOPAGO_ACCESS_TOKEN a tu archivo .env.local
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-1234567890123456-012345-00000000000000000000000000000000-000000000'
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { itemId, title, price } = body;

        const preference = new Preference(client);

        // Usamos una URL base que funcione tanto en local como en producción
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4002';

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: itemId,
                        title: title,
                        quantity: 1,
                        unit_price: Number(price),
                        currency_id: 'MXN',
                    },
                ],
                back_urls: {
                    success: `${baseUrl}/pago/exito`,
                    failure: `${baseUrl}/pago/fallo`,
                    pending: `${baseUrl}/pago/pendiente`,
                },
                auto_return: 'approved',
                statement_descriptor: 'MACHOTES LEGALES',
            }
        });

        return NextResponse.json({ id: response.id, init_point: response.init_point });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error generando preferencia de pago' }, { status: 500 });
    }
}
