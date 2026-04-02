/**
 * @fileoverview Utilidades para el formateo de fechas
 * @module utils/formatDate
 */

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

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

function getMonthName(month) {
    return months[month - 1];
}

module.exports = { formatDate, getMonthName };