/**
 * Constantes legales históricas de México
 * ========================================
 * Módulo central compartido por TODAS las calculadoras.
 * 
 * Para actualizar cada año:
 * 1. Agregar nueva entrada al inicio de UMA_HISTORICO (feb, cuando INEGI publica)
 * 2. Agregar nueva entrada al inicio de SMG_HISTORICO (ene, cuando CONASAMI publica)
 * 3. Si cambian las tablas ISR, actualizar TABLA_ISR_MENSUAL
 * 
 * Fuentes:
 * - UMA: DOF / INEGI (se publica en febrero de cada año)
 * - SMG: CONASAMI (se publica en diciembre para el año siguiente)
 * - ISR: SAT / DOF (Art. 96 LISR, se actualiza anualmente)
 * - Vacaciones: Art. 76 LFT (reforma enero 2023)
 */

/* ═══════════════════════════════════════════════════════
   UMA — Unidad de Medida y Actualización
   Fuente: INEGI / DOF
   ═══════════════════════════════════════════════════════ */
export interface UMAData {
    anio: number
    diaria: number
    mensual: number
    anual: number
}

export const UMA_HISTORICO: UMAData[] = [
    { anio: 2026, diaria: 113.14, mensual: 3439.46, anual: 41273.52 },
    { anio: 2025, diaria: 108.57, mensual: 3300.53, anual: 39606.36 },
    { anio: 2024, diaria: 103.74, mensual: 3153.70, anual: 37844.40 },
    { anio: 2023, diaria: 96.22, mensual: 2925.09, anual: 35101.08 },
    { anio: 2022, diaria: 96.22, mensual: 2925.09, anual: 35101.08 },
    { anio: 2021, diaria: 89.62, mensual: 2724.45, anual: 32693.40 },
    { anio: 2020, diaria: 86.88, mensual: 2641.15, anual: 31693.80 },
    { anio: 2019, diaria: 84.49, mensual: 2568.50, anual: 30822.00 },
    { anio: 2018, diaria: 80.60, mensual: 2450.24, anual: 29402.88 },
    { anio: 2017, diaria: 75.49, mensual: 2294.90, anual: 27538.80 },
    { anio: 2016, diaria: 73.04, mensual: 2220.42, anual: 26649.60 },
]

/* ═══════════════════════════════════════════════════════
   SMG — Salario Mínimo General
   Fuente: CONASAMI
   ═══════════════════════════════════════════════════════ */
export interface SMGData {
    anio: number
    general: number         // Resto del país
    fronteraNorte: number   // Zona Libre de la Frontera Norte
}

export const SMG_HISTORICO: SMGData[] = [
    { anio: 2026, general: 278.80, fronteraNorte: 419.88 },
    { anio: 2025, general: 278.80, fronteraNorte: 419.88 },
    { anio: 2024, general: 248.93, fronteraNorte: 374.89 },
    { anio: 2023, general: 207.44, fronteraNorte: 312.41 },
    { anio: 2022, general: 172.87, fronteraNorte: 260.34 },
    { anio: 2021, general: 141.70, fronteraNorte: 213.39 },
    { anio: 2020, general: 123.22, fronteraNorte: 185.56 },
    { anio: 2019, general: 102.68, fronteraNorte: 176.72 },
    { anio: 2018, general: 88.36, fronteraNorte: 88.36 },
    { anio: 2017, general: 80.04, fronteraNorte: 80.04 },
    { anio: 2016, general: 73.04, fronteraNorte: 73.04 },
]

/* ═══════════════════════════════════════════════════════
   Tabla ISR Mensual — Art. 96 LISR
   (se usa para retenciones de nómina, finiquitos, etc.)
   ═══════════════════════════════════════════════════════ */
export interface RangoISR {
    limInf: number
    limSup: number
    cuota: number
    pct: number
}

export const TABLA_ISR_MENSUAL: RangoISR[] = [
    { limInf: 0.01, limSup: 746.04, cuota: 0, pct: 1.92 },
    { limInf: 746.05, limSup: 6332.05, cuota: 14.32, pct: 6.40 },
    { limInf: 6332.06, limSup: 11128.01, cuota: 371.83, pct: 10.88 },
    { limInf: 11128.02, limSup: 12935.82, cuota: 893.63, pct: 16.00 },
    { limInf: 12935.83, limSup: 15487.71, cuota: 1182.88, pct: 17.92 },
    { limInf: 15487.72, limSup: 31236.49, cuota: 1640.18, pct: 21.36 },
    { limInf: 31236.50, limSup: 49233.00, cuota: 5004.12, pct: 23.52 },
    { limInf: 49233.01, limSup: 93993.90, cuota: 9236.89, pct: 30.00 },
    { limInf: 93993.91, limSup: 125325.20, cuota: 22665.17, pct: 32.00 },
    { limInf: 125325.21, limSup: 375975.61, cuota: 32691.18, pct: 34.00 },
    { limInf: 375975.62, limSup: Infinity, cuota: 117912.32, pct: 35.00 },
]

/* ═══════════════════════════════════════════════════════
   Tabla de Vacaciones por Antigüedad — Art. 76 LFT
   Reforma enero 2023
   ═══════════════════════════════════════════════════════ */
export function diasVacacionesLFT(anios: number): number {
    if (anios < 1) return 0
    const tabla: Record<number, number> = {
        1: 12, 2: 14, 3: 16, 4: 18, 5: 20,
        6: 22, 7: 24, 8: 26, 9: 28, 10: 30,
        11: 30, 12: 30, 13: 30, 14: 30, 15: 30,
        16: 32, 17: 32, 18: 32, 19: 32, 20: 32,
        21: 34, 22: 34, 23: 34, 24: 34, 25: 34,
        26: 36, 27: 36, 28: 36, 29: 36, 30: 36,
    }
    if (anios <= 30) return tabla[anios]
    return 36 + Math.floor((anios - 25) / 5) * 2
}

/* Tabla anterior (antes de reforma 2023) — para comparaciones */
export function diasVacacionesAnterior(anios: number): number {
    if (anios < 1) return 0
    const tabla: Record<number, number> = {
        1: 6, 2: 8, 3: 10, 4: 12, 5: 14,
        6: 14, 7: 14, 8: 14, 9: 14, 10: 16,
        11: 16, 12: 16, 13: 16, 14: 16, 15: 18,
        16: 18, 17: 18, 18: 18, 19: 18, 20: 20,
    }
    return tabla[anios] ?? 20 + Math.floor((anios - 20) / 5) * 2
}

/* ═══════════════════════════════════════════════════════
   TIIE — Tasa de Interés Interbancaria de Equilibrio
   (Referencial, promedio anual aproximado)
   ═══════════════════════════════════════════════════════ */
export interface TIIEData {
    anio: number
    tasa28: number    // TIIE 28 días (% anual promedio)
}

export const TIIE_HISTORICO: TIIEData[] = [
    { anio: 2026, tasa28: 10.00 },
    { anio: 2025, tasa28: 10.25 },
    { anio: 2024, tasa28: 11.25 },
    { anio: 2023, tasa28: 11.50 },
    { anio: 2022, tasa28: 7.75 },
    { anio: 2021, tasa28: 4.75 },
    { anio: 2020, tasa28: 5.50 },
    { anio: 2019, tasa28: 8.25 },
]

/* ═══════════════════════════════════════════════════════
   Exenciones ISR — Art. 93 LISR (en UMAs diarias)
   ═══════════════════════════════════════════════════════ */
export const EXENCIONES_ISR = {
    indemnizacion: 90,      // Fr. XIII: 90 UMAs diarias
    primaAntiguedad: 90,    // Fr. XIII: 90 UMAs diarias
    aguinaldo: 30,          // Fr. XIV: 30 UMAs diarias
    primaVacacional: 15,    // Fr. XIV: 15 UMAs diarias
    ptu: 15,                // Fr. XIV: 15 UMAs diarias
    fondoAhorro: 7,         // Fr. XI: 7 UMAs mensuales (distintas)
} as const

/* ═══════════════════════════════════════════════════════
   Helpers — funciones de uso común
   ═══════════════════════════════════════════════════════ */

/** Año actual del sistema */
export const ANIO_ACTUAL = new Date().getFullYear()

/** Obtiene UMA del año especificado (fallback: más reciente) */
export function getUMA(anio?: number): UMAData {
    const a = anio ?? ANIO_ACTUAL
    return UMA_HISTORICO.find(u => u.anio === a) || UMA_HISTORICO[0]
}

/** Obtiene SMG del año especificado (fallback: más reciente) */
export function getSMG(anio?: number): SMGData {
    const a = anio ?? ANIO_ACTUAL
    return SMG_HISTORICO.find(s => s.anio === a) || SMG_HISTORICO[0]
}

/** Obtiene TIIE del año especificado (fallback: más reciente) */
export function getTIIE(anio?: number): TIIEData {
    const a = anio ?? ANIO_ACTUAL
    return TIIE_HISTORICO.find(t => t.anio === a) || TIIE_HISTORICO[0]
}

/** Calcula ISR con tabla mensual Art. 96 LISR */
export function calcularISR(baseGravable: number): number {
    if (baseGravable <= 0) return 0
    for (const rango of TABLA_ISR_MENSUAL) {
        if (baseGravable >= rango.limInf && baseGravable <= rango.limSup) {
            return rango.cuota + ((baseGravable - rango.limInf) * rango.pct / 100)
        }
    }
    const ultimo = TABLA_ISR_MENSUAL[TABLA_ISR_MENSUAL.length - 1]
    return ultimo.cuota + ((baseGravable - ultimo.limInf) * ultimo.pct / 100)
}

/** Formatea número a moneda MXN */
export function fmtMXN(n: number): string {
    return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Lista de años disponibles (para selectors) */
export function getAniosDisponibles(): number[] {
    return UMA_HISTORICO.map(u => u.anio)
}
