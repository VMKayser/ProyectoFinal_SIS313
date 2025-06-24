# 🚀 TechStore Galáctico - Centro de Comando Estelar

> **Sistema de gestión de útiles escolares con interfaz galáctica épica y efectos audiovisuales espectaculares**

![Versión](https://img.shields.io/badge/versión-3.0.0-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-4.18+-red?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange?style=for-the-badge)

## ✨ Características Galácticas Épicas

### 🎨 Diseño Visual Espectacular
- 🌟 **Interfaz futurista** con efectos de partículas y nebulosas animadas
- 🎨 **Diseño holográfico** con gradientes espaciales y efectos de neón
- ✨ **Sistema de partículas** dinámico usando Canvas 2D
- 🌌 **Fondo espacial** con estrellas titilantes y nubes cósmicas
- � **Animaciones 3D** y transiciones espectaculares

### 🎵 Sistema de Audio Galáctico
- 🔊 **Música de fondo** galáctica generativa con osciladores
- � **Efectos de sonido** láser, éxito, error y validación
- 🎛️ **Control de volumen** integrado en header con icono temático
- 🌊 **Audio espacial** con filtros y modulación LFO
- 🎪 **Sonidos interactivos** en clicks y validaciones

### 🛸 Modal de Agregar Mega-Épico
- 🚀 **Botón mega-cuántico** en header superior derecho
- 🌟 **Modal galáctico** con animaciones 3D espectaculares
- 🔍 **Escáner holográfico** animado durante uso
- ✅ **Validación en tiempo real** con indicadores visuales/sonoros
- ⚡ **Efectos de partículas** y transiciones cósmicas

### 📊 Gestión de Inventario Avanzada

## 🛠️ Tecnologías del Futuro

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MySQL2** - Conector de base de datos
- **CORS** - Middleware para solicitudes cross-origin
- **dotenv** - Gestión de variables de entorno

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Animaciones y efectos avanzados
- **JavaScript ES6+** - Lógica interactiva
- **Canvas API** - Sistema de partículas
- **Web Audio API** - Efectos sonoros

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 14+ instalado
- MySQL/MariaDB corriendo
- Git (opcional)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/techstore-galactico.git
cd techstore-galactico
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```sql
-- Crear base de datos
CREATE DATABASE techstore_galactico;
USE techstore_galactico;

-- Crear tabla de suministros
CREATE TABLE supplies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO supplies (name, type_id, quantity, price, status_id) VALUES
('Lápiz Cuántico', 1, 100, 1.50, 1),
('Cuaderno Holográfico', 3, 50, 5.99, 1),
('Calculadora Galáctica', 4, 25, 29.99, 1),
('Marcadores de Neón', 2, 75, 8.50, 1),
('Regla Dimensional', 1, 30, 3.25, 2);
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales de base de datos
```

5. **Ejecutar la aplicación**
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

6. **Acceder a la aplicación**
   - Abrir navegador en `http://localhost:3000`
   - ¡Disfrutar de la experiencia galáctica! 🌌

## 📋 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Página principal |
| GET | `/supplies` | Obtener todos los suministros |
| POST | `/supplies` | Crear nuevo suministro |
| PUT | `/supplies/:id` | Actualizar suministro |
| DELETE | `/supplies/:id` | Eliminar suministro |
| GET | `/diagnostic` | Diagnóstico de conexión DB |

## 🎨 Características Visuales

### Efectos Incluidos
- ⭐ **Fondo animado** con estrellas en movimiento
- 🌈 **Texto con gradientes** que cambian de color
- 💫 **Partículas flotantes** generadas dinámicamente
- 🔮 **Efectos holográficos** en tablas y paneles
- ⚡ **Animaciones de hover** en todos los elementos
- 🎵 **Sonidos ambientales** para feedback de usuario

### Paleta de Colores
- **Cyan primario**: `#00ffff`
- **Magenta secundario**: `#ff00ff`
- **Amarillo de acento**: `#ffff00`
- **Verde de estado**: `#00ff00`
- **Rojo de alerta**: `#ff0000`

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=techstore_galactico

# Servidor
PORT=3000
NODE_ENV=development
```

### Personalización de Efectos
```javascript
// En script.js - Ajustar cantidad de partículas
const particleCount = Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 10000));

// Cambiar velocidad de animaciones en style.css
animation: move-twink-back 200s linear infinite;
```

## 📱 Compatibilidad

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ iOS Safari 12+
- ✅ Android Chrome 70+

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🌟 Créditos

- **Fuentes**: [Google Fonts (Orbitron, Exo 2)](https://fonts.google.com/)
- **Iconos**: Emojis nativos del sistema
- **Inspiración**: Ciencia ficción y interfaces futuristas

---

**¡Que la fuerza del código esté contigo! 🚀✨**

*Desarrollado con 💙 para la comunidad galáctica*
