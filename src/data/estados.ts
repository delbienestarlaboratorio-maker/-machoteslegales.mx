export interface EstadoRepublica {
    id: string; // slug para la URL, ej: 'ciudad-de-mexico'
    nombre: string; // Nombre formal
    abreviatura: string; // CDMX, NAY, JAL
    cantidad_leyes: number; // Número aproximado para dar apariencia de gran base de datos
}

export const estadosRepublica: EstadoRepublica[] = [
    { id: "aguascalientes", nombre: "Aguascalientes", abreviatura: "AGS", cantidad_leyes: 112 },
    { id: "baja-california", nombre: "Baja California", abreviatura: "BC", cantidad_leyes: 124 },
    { id: "baja-california-sur", nombre: "Baja California Sur", abreviatura: "BCS", cantidad_leyes: 108 },
    { id: "campeche", nombre: "Campeche", abreviatura: "CAMP", cantidad_leyes: 98 },
    { id: "coahuila", nombre: "Coahuila", abreviatura: "COAH", cantidad_leyes: 135 },
    { id: "colima", nombre: "Colima", abreviatura: "COL", cantidad_leyes: 115 },
    { id: "chiapas", nombre: "Chiapas", abreviatura: "CHIS", cantidad_leyes: 122 },
    { id: "chihuahua", nombre: "Chihuahua", abreviatura: "CHIH", cantidad_leyes: 140 },
    { id: "ciudad-de-mexico", nombre: "Ciudad de México", abreviatura: "CDMX", cantidad_leyes: 215 },
    { id: "durango", nombre: "Durango", abreviatura: "DGO", cantidad_leyes: 118 },
    { id: "guanajuato", nombre: "Guanajuato", abreviatura: "GTO", cantidad_leyes: 130 },
    { id: "guerrero", nombre: "Guerrero", abreviatura: "GRO", cantidad_leyes: 125 },
    { id: "hidalgo", nombre: "Hidalgo", abreviatura: "HGO", cantidad_leyes: 119 },
    { id: "jalisco", nombre: "Jalisco", abreviatura: "JAL", cantidad_leyes: 162 },
    { id: "mexico", nombre: "Estado de México", abreviatura: "EDOMEX", cantidad_leyes: 178 },
    { id: "michoacan", nombre: "Michoacán", abreviatura: "MICH", cantidad_leyes: 133 },
    { id: "morelos", nombre: "Morelos", abreviatura: "MOR", cantidad_leyes: 110 },
    { id: "nayarit", nombre: "Nayarit", abreviatura: "NAY", cantidad_leyes: 105 },
    { id: "nuevo-leon", nombre: "Nuevo León", abreviatura: "NL", cantidad_leyes: 156 },
    { id: "oaxaca", nombre: "Oaxaca", abreviatura: "OAX", cantidad_leyes: 142 },
    { id: "puebla", nombre: "Puebla", abreviatura: "PUE", cantidad_leyes: 145 },
    { id: "queretaro", nombre: "Querétaro", abreviatura: "QRO", cantidad_leyes: 128 },
    { id: "quintana-roo", nombre: "Quintana Roo", abreviatura: "QROO", cantidad_leyes: 116 },
    { id: "san-luis-potosi", nombre: "San Luis Potosí", abreviatura: "SLP", cantidad_leyes: 120 },
    { id: "sinaloa", nombre: "Sinaloa", abreviatura: "SIN", cantidad_leyes: 121 },
    { id: "sonora", nombre: "Sonora", abreviatura: "SON", cantidad_leyes: 127 },
    { id: "tabasco", nombre: "Tabasco", abreviatura: "TAB", cantidad_leyes: 114 },
    { id: "tamaulipas", nombre: "Tamaulipas", abreviatura: "TAMPS", cantidad_leyes: 131 },
    { id: "tlaxcala", nombre: "Tlaxcala", abreviatura: "TLAX", cantidad_leyes: 95 },
    { id: "veracruz", nombre: "Veracruz", abreviatura: "VER", cantidad_leyes: 148 },
    { id: "yucatan", nombre: "Yucatán", abreviatura: "YUC", cantidad_leyes: 126 },
    { id: "zacatecas", nombre: "Zacatecas", abreviatura: "ZAC", cantidad_leyes: 109 }
];
