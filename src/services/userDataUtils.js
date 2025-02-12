// Utilidad mejorada para normalizar números de teléfono
export const normalizePhoneNumber = (phone) => {
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

// Utilidad para normalizar nombres de campos
export const normalizeUserFields = (user) => {
  if (!user) return null;

  try {
    // Buscar el nombre en diferentes variaciones de la propiedad
    const name = user.name || user.Name || user.username || user.USERNAME || 'Sin nombre';
    
    // Buscar el teléfono en diferentes variaciones de la propiedad y normalizarlo
    const rawPhone = user.phone || user.Phone || user.telefono || user.PHONE;
    const phone = normalizePhoneNumber(rawPhone);
    
    // Si no hay teléfono válido, retornar null
    if (!phone) return null;

    return {
      username: name.trim(),
      phone: phone,
      // Mantener otros campos relevantes si existen
      ...Object.keys(user).reduce((acc, key) => {
        if (!['name', 'Name', 'phone', 'Phone', 'telefono', 'PHONE', 'username', 'USERNAME'].includes(key)) {
          acc[key] = user[key];
        }
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error al normalizar campos de usuario:', error);
    return null;
  }
};

// Utilidad para procesar lista de usuarios
export const processUsersList = (users) => {
  if (!Array.isArray(users)) return [];
  
  try {
    return users
      .map(normalizeUserFields)
      .filter(Boolean) // Filtrar usuarios nulos o inválidos
      .map((user, index) => ({
        id: index + 1,
        ...user
      }));
  } catch (error) {
    console.error('Error al procesar lista de usuarios:', error);
    return [];
  }
};

// Utilidad para añadir prefijo 57 cuando sea necesario
export const add57Prefix = (phone) => {
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