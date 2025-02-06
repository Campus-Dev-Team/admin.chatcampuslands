# Enviar Mensaje Masivo

## Descripción

Este caso de uso describe el proceso para enviar mensajes masivos a usuarios mediante un sistema web. El usuario puede elegir entre utilizar una base de datos de contactos recopilados automáticamente por **Iza** o cargar su propio listado de números desde un archivo Excel.

------

## Flujo del Usuario (Interfaz Gráfica)

1. **Ingreso a la plataforma:** El usuario accede a la página.
2. **Selección de la sede:** Escoge la base de datos con la que desea trabajar (Bucaramanga o Bogotá).
3. **Selección de plantilla:** Escoge una plantilla de mensaje del listado disponible.
4. **Selección de fuente de contactos:** Decide si desea enviar mensajes a los usuarios recopilados por **Iza** o cargar su propio listado de números mediante un archivo Excel (que debe contener un campo **celular** o **phone**, aún por definir).
5. **Previsualización de datos:** Se muestra la información recopilada, ya sea desde **Iza** o el archivo Excel.
6. **Seleccion del estado:** Se selecciona el estado de los usuarios a quienes se les enviará el mensaje (ejemplo: de 200 usuarios, solo enviar a los que tienen un estado específico en la base de datos de la sede seleccionada).
7. **Envío del mensaje:** Se confirma la acción y se inicia el proceso de envío de mensajes.

------

## Flujo de Ejecución (Backend y Frontend)

### **1️⃣ Ingreso a la Página**

- Se consultan las plantillas almacenadas.
- Se configura por defecto:
  - La sede en **Bucaramanga**.
  - La opción de datos en **Iza**.
- Se obtienen los datos de **Iza**.
- Se renderiza la información en el componente.
- **Nota:** El botón de "Enviar Mensaje" estará deshabilitado hasta que se seleccione una plantilla y un estado.

### **2️⃣ Selección de la Sede**

- Se actualiza la lista de plantillas según la sede seleccionada.

### **3️⃣ Selección de Plantilla**

- Se obtiene el identificador de la plantilla seleccionada.

### **4️⃣ Selección de Fuente de Contactos**

- Si el usuario elige Iza:
  - Se consulta al backend por la lista de usuarios registrados en **Iza**.
  - Se normalizan los números de teléfono agregando el prefijo `+57` si no lo tienen.
  - Se almacenan los números normalizados junto con la información adicional.
- Si el usuario elige cargar un archivo Excel:
  - Se habilita el botón para cargar el archivo.
  - Se procesa el archivo y se extraen los números de teléfono.
  - Se normalizan los números de teléfono agregando el prefijo `+57` si no lo tienen.
  - Se almacenan los números normalizados junto con la información adicional del archivo.

### **5️⃣ Previsualización de Datos**

- Se renderiza la información cargada, mostrando principalmente los números de teléfono.

### **6️⃣ Seleccion del Estado**

- Se obtiene y almacena la selección del estado en el front.

### **7️⃣ Envío del Mensaje**

- Se construye un objeto con los siguientes datos:
  - Listado de números seleccionados.
  - Estado seleccionado.
  - Sede seleccionada.
- Se envía la solicitud al backend para filtrar los números según el estado en la base de datos de la sede elegida.

#### **Flujo en el Backend:**

1. Recibe la solicitud con los datos proporcionados.

2. Consulta la base de datos de la sede seleccionada para obtener los usuarios con el estado especificado.

3. Compara las listas:

   - **Lista 1:** Números enviados desde el frontend.
   - **Lista 2:** Usuarios en la base de datos con el estado seleccionado.
   - Se obtienen los números que coinciden en ambas listas.

4. Excepción:

   Si el estado seleccionado es 

   "No Registrado"

   :

   - Se consulta la base de datos sin filtrar por estado.
   - Se comparan los números y se identifican los que **NO están en la base de datos**.
   - Los números que están en la lista del usuario pero no en la base de datos **se almacenan en el mismo array utilizado en el caso normal**.

5. Se genera la lista final de destinatarios.

6. Se envia la lista final al frontend para preview y confirmacion

7. Se obtiene respuesta del frontend 

8. Se envía la plantilla seleccionada a los números filtrados.

9. El backend devuelve una respuesta con el estado de la solicitud (`200` éxito o `500` error).

