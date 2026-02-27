const fs = require('fs');

// Script genérico para añadir la 20ava plantilla a cualquier JSON que solo tenga 19
const area = process.argv[2];
const file = `scripts/${area}.json`;
const d = JSON.parse(fs.readFileSync(file, 'utf8'));
const S = 'background:#dbeafe;color:#1d4ed8;padding:1px 8px;border-radius:4px;font-weight:600;border:1px solid #bfdbfe;';

const extras = {
    penal: {
        id: 'penal-medida-proteccion-mp-v1',
        slug: 'solicitud-medida-proteccion-urgente',
        title: 'Solicitud de Medida de Proteccion Urgente al MP',
        legalBasis: ['Arts. 137-138 CNPP', 'Ley General de Victimas Art. 27'],
        description: 'Peticion de medidas de proteccion provisionales que dicta el MP antes de acudir al Juez.',
        keywords: ['medida proteccion ministerio publico', 'proteccion victima urgente', 'MP orden proteccion'],
        html: '<div class="header-v1"><h1>Solicitud de Medida de Proteccion Urgente</h1></div>' +
            '<p class="meta-line"><span style="' + S + '">(Ciudad de Mexico)</span>, a <span style="' + S + '">(26 de febrero de 2026)</span></p>' +
            '<div class="section-title">C. AGENTE DEL MINISTERIO PUBLICO</div>' +
            '<p class="indent text-justify"><strong><span style="' + S + '">(Ana Perez)</span></strong> solicita medidas de proteccion urgentes contra <span style="' + S + '">(Jorge Herrera)</span> de conformidad con los articulos 137-138 CNPP: orden de desocupacion del domicilio conyugal, prohibicion de acercarse a menos de <span style="' + S + '">(500 metros)</span> de la victima y de su lugar de trabajo.</p>' +
            '<div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="' + S + '">(La Victima)</span></div></div>'
    },
    fiscal: {
        id: 'fiscal-recurso-revocacion-sat-v1',
        slug: 'recurso-revocacion-sat',
        title: 'Recurso de Revocacion ante el SAT',
        legalBasis: ['Art. 116-128 CFF'],
        description: 'Medio de defensa fiscal para impugnar resoluciones del SAT ante la propia autoridad.',
        keywords: ['recurso revocacion SAT', 'impugnar multa SAT', 'defensa fiscal administrativa'],
        html: '<div class="header-v1"><h1>Recurso de Revocacion</h1></div>' +
            '<p class="meta-line"><span style="' + S + '">(Ciudad de Mexico)</span>, a <span style="' + S + '">(26 de febrero de 2026)</span></p>' +
            '<div class="section-title">C. ADMINISTRADOR DE LA SAT EN TURNO</div>' +
            '<p class="indent text-justify"><strong><span style="' + S + '">(Empresa XYZ SA de CV)</span></strong>, por conducto de su representante, interpone RECURSO DE REVOCACION contra la resolucion fiscal de fecha <span style="' + S + '">(5 de febrero de 2026)</span> que determina credito fiscal por $<span style="' + S + '">(250,000.00)</span>, el cual se impugna por indebida fundamentacion y motivacion.</p>' +
            '<div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="' + S + '">(Contribuyente Recurrente)</span></div></div>'
    },
    inmobiliario: {
        id: 'inmobiliario-contrato-promesa-v1',
        slug: 'contrato-promesa-compraventa-inmueble',
        title: 'Contrato de Promesa de Compraventa de Inmueble',
        legalBasis: ['Arts. 2243-2247 CCDF'],
        description: 'Contrato previo a la escrituración que obliga a ambas partes a formalizar la compraventa.',
        keywords: ['promesa compraventa', 'pre-contrato inmueble', 'enganche inmueble'],
        html: '<div class="header-v1"><h1>Contrato de Promesa de Compraventa</h1></div>' +
            '<p class="meta-line">Celebrado en <span style="' + S + '">(Ciudad de Mexico)</span>, el <span style="' + S + '">(26 de febrero de 2026)</span></p>' +
            '<p class="indent text-justify">El promitente vendedor <strong><span style="' + S + '">(Carlos Ramirez)</span></strong> se obliga a vender al promitente comprador <strong><span style="' + S + '">(Maria Gonzalez)</span></strong> el inmueble ubicado en <span style="' + S + '">(Calle 5 No. 20, Col. Del Valle)</span> por la cantidad de $<span style="' + S + '">(1,800,000.00)</span>, recibiendo en este acto enganche de $<span style="' + S + '">(300,000.00)</span>. La escrituracion se realizara a mas tardar el <span style="' + S + '">(30 de junio de 2026)</span>.</p>' +
            '<div class="signature-block" style="margin-top:50px;"><div class="signature-line"><span style="' + S + '">(Promitente Vendedor y Comprador)</span></div></div>'
    }
};

if (d.length < 20 && extras[area]) {
    d.push(extras[area]);
    fs.writeFileSync(file, JSON.stringify(d, null, 2));
    console.log(area + ' ampliado a: ' + d.length);
} else {
    console.log(area + ' ya tiene: ' + d.length);
}
