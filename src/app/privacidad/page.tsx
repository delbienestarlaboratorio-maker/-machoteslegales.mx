import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aviso de Privacidad — Machotes Legales",
    description: "Aviso de privacidad integral de Machotes Legales conforme a la LFPDPPP. Datos personales, derechos ARCO, transferencias y contacto.",
    alternates: { canonical: "https://machoteslegales.mx/privacidad" },
    robots: { index: false, follow: true },
};

export default function PrivacidadPage() {
    return (
        <main className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl">
                <h1 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">Aviso de Privacidad Integral</h1>
                <p className="text-sm text-[var(--color-text-muted)] mb-8">Última actualización: 22 de Febrero de 2026</p>

                <div className="space-y-6 text-[var(--color-text-muted)] text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Identidad y Domicilio del Responsable</h2>
                        <p><b>Machotes Legales S.A. de C.V.</b>, en adelante "La Empresa", con domicilio en la Ciudad de México, México; es el responsable del uso y protección de sus datos personales, y al respecto le informamos lo siguiente en cumplimiento estricto con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Datos Personales Recabados</h2>
                        <p>Para llevar a cabo las finalidades descritas en el presente aviso, utilizaremos los siguientes datos personales:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Datos de identificación (Nombre, correo a través de Google OAuth).</li>
                            <li>Datos de contacto y facturación (C.P., RFC y Régimen en caso de solicitar CFDI).</li>
                        </ul>
                        <p className="mt-2 text-[var(--color-accent)]">Importante: Nosotros NO recabamos datos financieros ni números de tarjeta de crédito. Los pagos se procesan exclusivamente en los servidores cifrados de Clip (Payclip, S. de R.L. de C.V.).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Finalidades del Tratamiento de Datos</h2>
                        <p>Sus datos personales serán utilizados primordialmente para:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Creación y administración de su cuenta de usuario premium.</li>
                            <li>Otorgar acceso perpetuo a las descargas de plantillas legales adquiridas (Niveles V2 y V3).</li>
                            <li>Emisión de la factura fiscal correspondiente ante el SAT si así nos lo requiere.</li>
                            <li>Prevención de fraudes y usurpación de identidad tecnológica.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Transferencias de Datos</h2>
                        <p>Le informamos que sus datos personales no son compartidos a terceros ajenos, proveedores comerciales, o agencias de marketing sin su consentimiento expreso. Salvo requerimientos en materia de seguridad ordenadas por jueces locales o federales mexicanos.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Derechos ARCO</h2>
                        <p>Usted tiene derecho a conocer qué datos tenemos (Acceso), pedir la corrección o actualización (Rectificación), que los eliminemos de nuestras bases (Cancelación) oponerse al uso (Oposición). Para esto dirija su correo al departamento legal: privacidad@machoteslegales.mx.</p>
                    </section>

                </div>
            </div>
        </main>
    );
}
