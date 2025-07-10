function validateNovelty(data, isUpdate = false) {
  if (!isUpdate) {
    if (!data.employeeId) throw new Error('employeeId is required');
    if (!data.conceptId) throw new Error('conceptId is required');
    if (typeof data.value !== 'number') throw new Error('value is required and must be a number');
    if (!data.status) throw new Error('status is required');
  }
  if (data.quantity !== undefined && typeof data.quantity !== 'number') {
    throw new Error('quantity must be a number');
  }
  if (data.value !== undefined && typeof data.value !== 'number') {
    throw new Error('value must be a number');
  }
  // Opcional: validar status válido
  const validStatus = ['PENDING', 'APPLIED', 'CANCELLED'];
  if (data.status && !validStatus.includes(data.status)) {
    throw new Error('Invalid status');
  }
}

module.exports = { validateNovelty }; 