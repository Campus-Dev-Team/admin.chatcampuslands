// Utilidad mejorada para normalizar números de teléfono
const normalizePhoneNumber = (phone) => {
  if (!phone) return null;
  
  try {
    // Convertir a string si no lo es
    let phoneStr = phone.toString();
    
    // Eliminar todos los caracteres no numéricos (espacios, guiones, paréntesis, etc)
    phoneStr = phoneStr.replace(/\D/g, '');
    
    // Si el número comienza con 57, eliminarlo
    if (phoneStr.startsWith('57')) {
      phoneStr = phoneStr.substring(2);
    }
    
    // Si el número tiene más de 10 dígitos, intentar encontrar un número válido
    if (phoneStr.length > 10) {
      // Buscar un patrón de 10 dígitos que comience con 3
      const match = phoneStr.match(/3\d{9}/);
      if (match) {
        phoneStr = match[0];
      } else {
        // Si no encontramos un patrón válido, tomar los últimos 10 dígitos solo si empiezan con 3
        const lastTen = phoneStr.slice(-10);
        if (lastTen.startsWith('3')) {
          phoneStr = lastTen;
        } else {
          return null;
        }
      }
    }
    
    // Validar que sea un número de 10 dígitos y comience con 3
    return (phoneStr.length === 10 && phoneStr.startsWith('3')) ? phoneStr : null;
  } catch (error) {
    console.error('Error al normalizar número de teléfono:', error);
    return null;
  }
};

// Utilidad para añadir prefijo 57 cuando sea necesario
const add57Prefix = (phone) => {
  if (!phone) return null;

  try {
    const normalizedPhone = normalizePhoneNumber(phone);
    // Solo añadir el prefijo si el número es válido
    return normalizedPhone ? `57${normalizedPhone}` : null;
  } catch (error) {
    console.error('Error al añadir prefijo 57:', error);
    return null;
  }
};