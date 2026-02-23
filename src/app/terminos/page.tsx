export default function TerminosPage() {
    return (
        <main className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl">
                <h1 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">Términos y Condiciones de Uso</h1>
                <p className="text-sm text-[var(--color-text-muted)] mb-8">Última actualización: 22 de Febrero de 2026</p>

                <div className="space-y-6 text-[var(--color-text-muted)] text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Limitación de Responsabilidad Legal Substantiva</h2>
                        <p>El comprador, usuario o suscriptor de <b>Machotes Legales</b> entiende explícitamente y acepta sin reservas que los formatos, demandas, contratos, y material jurídico descargados desde esta plataforma son únicamente <b>plantillas de referencia de libre uso ("machotes")</b> basificados en las normas mexicanas.</p>
                        <p className="mt-2 text-white font-semibold">El uso de este sitio NO constituye una asesoría jurídica vinculante ni conforma una relación "Abogado-Cliente". La omisión, defecto o falla procesal al interponer recursos sin la revisión posterior de un perito en derecho es estricta responsabilidad del usuario.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Propiedad Intelectual y Licencia de Uso</h2>
                        <p>Al adquirir una versión <b>V2 (Negocios)</b> o mediante la membresía <b>V3 (Elite)</b>, usted no compra los derechos de autor de las plantillas ni la infraestructura de Inteligencia Artificial ("Tilde IA"). <b>Usted adquiere una Licencia de Uso Individual y Perpetua</b> para utilizar, llenar, litigar, e implementar el archivo para fines lúdicos, académicos o profesionales propios o para sus propios clientes.</p>
                        <p className="mt-2 text-yellow-500 font-semibold border-l-2 border-yellow-500 pl-3">Queda estrictamente prohibida la re-venta, sub-licenciamiento masivo y distribución web en servidores públicos de los machotes generados con nuestro sistema de Inteligencia Artificial.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Políticas de Devolución y Pagos</h2>
                        <p>Debido a la naturaleza asimétrica y la descarga inmediata de productos digitales de propiedad intelectual (un PDF / DOCX libre de marca de agua); <b>Una vez que el sistema ha entregado correctamente su plantilla al panel de usuario o por correo y ésta haya sido descargada, NO SE ACEPTARÁN REEMBOLSOS NI CANCELACIONES del dinero procesado vía Clip.</b></p>
                        <p className="mt-2">Si por motivos técnicos, servidores caídos u omisión, usted efectuó el pago pero la descarga del documento no funcionara en lo absoluto, posee 48 horas a partir del cargo en su tarjeta para notificar soporte técnico.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Jurisdicción y Solución de Controversias</h2>
                        <p>Al utilizar este sitio web, usted se somete, con expresa renuncia de cualquier otro foro, fuero o legislación, al arbitraje de tribunales mercantiles ordinarios en la Ciudad de México para la resolución de cualquier disputa interpretativa de los presentes términos.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
