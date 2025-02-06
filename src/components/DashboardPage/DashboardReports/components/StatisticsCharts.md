# Stats Charts Documentation

## Overview
El componente StatsCharts visualiza dos métricas principales:
1. Tasa de conversión diaria
2. Conteo de usuarios por día

## Gráficos

### Gráfico de Línea: Tasa de Conversión
- Muestra el porcentaje de usuarios que se registraron cada día
- El eje Y representa el porcentaje de conversión (0-100%)
- El eje X muestra las fechas

### Gráfico de Barras: Usuarios por Día
- Barras grises: Total de usuarios únicos que escribieron ese día
- Barras cyan: Usuarios registrados por primera vez ese día
- El eje Y muestra el conteo de usuarios
- El eje X muestra las fechas

## Cálculo de Datos

### Usuarios Totales
- Se cuentan usuarios únicos por número de teléfono
- Un usuario que escribe múltiples mensajes en un día cuenta como 1
- Fórmula: `totalUsers = número_de_usuarios_únicos_por_día`

### Usuarios Registrados
- Un usuario solo se cuenta como registrado el primer día que aparece en los datos
- Si un usuario registrado escribe varios días, solo se cuenta en su primer día
- Se verifica contra la lista de `usersBucaramanga` o `usersBogota` según la ciudad seleccionada

### Tasa de Conversión
```
conversionRate = (usuarios_registrados_por_primera_vez / usuarios_totales_del_día) * 100
```

## Filtros y Actualizaciones
- Los datos se recalculan cuando cambia:
  - La ciudad seleccionada
  - Los datos filtrados
  - Los datos de campus
- Incluye animación de carga (300ms) al actualizar datos