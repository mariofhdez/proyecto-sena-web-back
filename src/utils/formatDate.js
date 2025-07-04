/**
 * @fileoverview Utilidades para el formateo de fechas
 * @module utils/formatDate
 */

/**
 * Convierte una cadena de fecha a formato ISO
 * 
 * @function formatDate
 * @param {string} dateStr - Cadena de fecha a formatear
 * @returns {string|null} Fecha en formato ISO o null si no se proporciona fecha
 */
function formatDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toISOString();
};

module.exports = { formatDate };