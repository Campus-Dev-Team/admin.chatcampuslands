# admin.chatcampuslands
Este repositorio contiene el desarrollo del módulo administrativo de "Iza", el chatbot de Campuslands. Este módulo permite la gestión y configuración de las funcionalidades del chatbot, brindando herramientas para su administración eficiente.

# modulo de filtrado de datos (FiltrosReportes.jsx)

Aquí tienes un ejemplo de documentación para incluir en el README sobre el proceso de normalización de datos:

---

## Proceso de Normalización de Datos

Este modulo ademas del filtrado de los datos por las fechas de incio y fin, incluye un proceso de **normalización de datos** para estructurar y simplificar la información que se recibe de diferentes fuentes (usuarios y mensajes), consolidándola en un formato más organizado y utilizable.

### Objetivo del Proceso
El objetivo es combinar datos de usuarios y sus mensajes asociados en una estructura normalizada, donde cada usuario tenga una lista de mensajes relacionados. Este formato facilita consultas y operaciones posteriores.

---

### Entrada de Datos
El proceso recibe dos conjuntos de datos:
1. **Usuarios**: Información básica de los usuarios, incluyendo su identificación, nombre, teléfono, disponibilidad, entre otros.
2. **Mensajes**: Información sobre los mensajes enviados por los usuarios, incluyendo el ID del mensaje, el ID del usuario que lo envió, contenido, y la hora.

#### Ejemplo de Datos Recibidos
**Usuarios**:
```json
[
  {
    "id": 847,
    "username": "Luis Miguel",
    "telefono": 574505321701,
    "age": 38,
    "availability": "no",
    "contact_way": "mensaje",
    "city": "Bucaramanga"
  },
  {
    "id": 847,
    "username": "Luis Miguel",
    "telefono": 574505321701,
    "age": 38,
    "availability": "no",
    "contact_way": "mensaje",
    "city": "Bucaramanga"
  },
  {
    "id": 1276,
    "username": "Santiago Laguado",
    "telefono": 578257645372,
    "age": 40,
    "availability": "no",
    "contact_way": null,
    "city": "Bucaramanga"
  }
]
```

**Mensajes**:
```json
[
  {
    "messageId": 279,
    "userId": 847,
    "content": "Me gustaría inscribirme",
    "messageTime": "2025-01-23T13:18:33"
  },
  {
    "messageId": 278,
    "userId": 1276,
    "content": "Quiero saber cómo funcionan los pagos",
    "messageTime": "2025-01-23T13:12:41"
  }
]
```

---

### Salida de Datos
El proceso normaliza los datos combinando la información de los usuarios con sus mensajes. El resultado final es un arreglo donde cada usuario tiene una lista de sus mensajes asociados.

#### Ejemplo de Datos Entregados
```json
[
  {
    "UserId": 847,
    "Username": "Luis Miguel",
    "PhoneNumber": 574505321701,
    "Age": 38,
    "Availability": "no",
    "ContactWay": "mensaje",
    "City": "Bucaramanga",
    "Messages": [
      {
        "Message": "Me gustaría inscribirme",
        "MessageId": 279,
        "Time": "2025-01-23T13:18:33"
      }
    ]
  },
  {
    "UserId": 1276,
    "Username": "Santiago Laguado",
    "PhoneNumber": 578257645372,
    "Age": 40,
    "Availability": "no",
    "ContactWay": null,
    "City": "Bucaramanga",
    "Messages": [
      {
        "Message": "Quiero saber cómo funcionan los pagos",
        "MessageId": 278,
        "Time": "2025-01-23T13:12:41"
      }
    ]
  }
]
```

---

### Beneficios del Proceso
1. **Estructura consolidada**: Permite manejar la información de forma más intuitiva, agrupando los mensajes por usuario.
2. **Consultas simplificadas**: Es más fácil acceder a los mensajes de un usuario específico.
3. **Preparación para análisis**: Ideal para realizar análisis posteriores, como métricas de interacción o reportes.
