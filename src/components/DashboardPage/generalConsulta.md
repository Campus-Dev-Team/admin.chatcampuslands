Aquí te presento la documentación esencial del componente GeneralConsult:

# Documentación del Componente GeneralConsult

## Descripción General
GeneralConsult es un componente React que maneja la visualización y análisis de datos de usuarios del ChatBot Iza. Permite filtrar usuarios por ciudad, cargar datos desde archivos Excel, y exportar informes completos.

## Estados Principales
```javascript
const [ciudad, setCiudad] = useState("Bucaramanga");
const [filteredData, setFilteredData] = useState([]);
const [spentAmount, setSpentAmount] = useState(0);
const [stats, setStats] = useState({
  totalUsers: 0,
  registeredUsers: 0,
  conversionRate: 0,
  costPerUser: 0
});
```

## Flujo Principal de Datos

1. **Carga Inicial y Filtrado**
   - El componente recibe datos a través de `FiltrosReportes`
   - Los datos se procesan en `handleDataFetched`
   - Se calculan estadísticas automáticamente

2. **Procesamiento de Usuarios**
```javascript
const getUsersList = (data) => {
  // Obtiene usuarios del localStorage
  const storedData = localStorage.getItem("mergedUsers");
  
  // Separa usuarios en registrados y no registrados
  // basado en la coincidencia de números telefónicos
  return { registered: [...], unregistered: [...] };
}
```

3. **Cálculo de Estadísticas**
```javascript
const calculateStats = (data) => {
  // 1. Filtra por ciudad seleccionada
  const cityFilteredData = data.filter(user => user.city === ciudad);
  
  // 2. Calcula usuarios registrados
  const registeredCount = /* usuarios que coinciden con localStorage */
  
  // 3. Calcula métricas
  const conversionRate = (registeredCount.length / totalUsers) * 100;
  const costPerUser = spentAmount / data.length;
}
```

## Flujos Clave

### 1. Carga de Archivos Excel
```javascript
const handleUpload = async () => {
  // 1. Procesa archivos de ambas ciudades
  const bogotaData = await processExcelFile(files.usuariosBogota, 'Bogotá');
  const bucaramangaData = await processExcelFile(files.usuariosBucaramanga, 'Bucaramanga');
  
  // 2. Combina los datos
  const mergedUsers = [...bogotaData, ...bucaramangaData];
  
  // 3. Guarda en localStorage
  localStorage.setItem('mergedUsers', JSON.stringify(mergedUsers));
}
```

### 2. Exportación a Excel
```javascript
const exportToExcel = () => {
  // 1. Prepara datos de estadísticas
  const generalStats = [/* métricas generales */];
  
  // 2. Prepara datos de usuarios
  const usersData = [...registered, ...unregistered].map(user => ({
    'Estado': registered.includes(user) ? 'Registrado' : 'No Registrado',
    // ... otros campos
  }));
  
  // 3. Crea libro Excel con dos hojas
  // - Estadísticas Generales
  // - Detalle de Usuarios
}
```

## Normalización de Datos
El componente utiliza una función clave para normalizar números telefónicos:
```javascript
const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  const phoneStr = phone.toString();
  return phoneStr.startsWith('57') ? phoneStr.slice(2) : phoneStr;
};
```
Esta función es crucial para la comparación correcta entre usuarios registrados y no registrados.

## Almacenamiento Local
- El componente utiliza localStorage para persistir datos de usuarios registrados
- Clave: 'mergedUsers'
- Los datos se actualizan al cargar nuevos archivos Excel

## Interacciones Principales
1. **Cambio de Ciudad**
   - Trigger: Select de ciudad
   - Efecto: Recalcula estadísticas y filtra usuarios

2. **Carga de Archivos**
   - Trigger: Modal con inputs de archivo
   - Efecto: Procesa Excel y actualiza localStorage

3. **Exportación**
   - Trigger: Botón "Exportar Excel"
   - Efecto: Genera archivo Excel con estadísticas y usuarios

## Puntos Importantes
1. Los números telefónicos se normalizan para comparación (eliminando prefijo '57')
2. Las estadísticas se recalculan automáticamente cuando:
   - Cambia la ciudad seleccionada
   - Se actualiza el monto gastado
   - Se cargan nuevos datos
3. Los datos de usuarios registrados se mantienen en localStorage para persistencia

Esta documentación cubre los aspectos más importantes del componente. ¿Hay algún aspecto específico sobre el que necesites más detalles?