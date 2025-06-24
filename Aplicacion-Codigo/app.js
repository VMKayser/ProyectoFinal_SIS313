// app.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CONFIGURACIÓN DE POOLS CON TOLERANCIA A FALLOS =====
console.log('🚀 Inicializando TechStore Galáctico...');

// Pool 1 - Server3 (Primario)
const pool1 = mysql.createPool({
  host: process.env.DB_HOST_PRIMARY || process.env.DB_HOST || '192.168.1.103',
  user: process.env.DB_USER_PRIMARY || process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD_PRIMARY || process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME_PRIMARY || process.env.DB_NAME || 'libreria',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0
});

// Pool 2 - Server4 (Respaldo)
const pool2 = mysql.createPool({
  host: process.env.DB_HOST_SECONDARY || '192.168.1.104',
  user: process.env.DB_USER_SECONDARY || process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD_SECONDARY || process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME_SECONDARY || process.env.DB_NAME || 'libreria',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0
});

// ===== FUNCIÓN DE CONEXIÓN CON FALLBACK AUTOMÁTICO =====
async function getConnection() {
  try {
    const conn = await pool1.getConnection();
    const primaryHost = process.env.DB_HOST_PRIMARY || process.env.DB_HOST || '192.168.1.103';
    console.log(`🔵 [PRIMARIO] Conectado a Server3 (${primaryHost})`);
    return { connection: conn, server: 'Server3' };
  } catch (err) {
    console.warn("⚠️ [FALLBACK] Error con Server3. Intentando Server4...");
    console.warn(`Error: ${err.message}`);
    
    try {
      const conn = await pool2.getConnection();
      const secondaryHost = process.env.DB_HOST_SECONDARY || '192.168.1.104';
      console.log(`🟢 [RESPALDO] Conectado a Server4 (${secondaryHost})`);
      return { connection: conn, server: 'Server4' };
    } catch (err2) {
      console.error("❌ [CRÍTICO] Ambos servidores están caídos!");
      console.error(`Server3: ${err.message}`);
      console.error(`Server4: ${err2.message}`);
      throw new Error('Todos los servidores de base de datos están inaccesibles');
    }
  }
}

// ===== FUNCIÓN PARA EJECUTAR QUERIES CON TOLERANCIA A FALLOS =====
async function executeQuery(query, params = []) {
  let connectionInfo;
  
  try {
    connectionInfo = await getConnection();
    const [results] = await connectionInfo.connection.execute(query, params);
    
    console.log(`✅ Query ejecutado exitosamente en ${connectionInfo.server}`);
    return results;
    
  } catch (error) {
    console.error(`❌ Error ejecutando query en ${connectionInfo?.server || 'desconocido'}:`, error.message);
    throw error;
    
  } finally {
    if (connectionInfo?.connection) {
      connectionInfo.connection.release();
    }
  }
}

// Middleware básico
app.use(cors());
app.use(express.json());

// ===== RUTAS API PRIMERO =====
// Estas deben ir ANTES que los archivos estáticos

// GET - Obtener todos los suministros
app.get('/supplies', async (req, res) => {
  try {
    const supplies = await executeQuery('SELECT * FROM supplies ORDER BY id');
    console.log(`📦 ${supplies.length} suministros recuperados del inventario galáctico`);
    res.json(supplies);
  } catch (error) {
    console.error('❌ Error obteniendo suministros:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor galáctico',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST - Crear nuevo suministro
app.post('/supplies', async (req, res) => {
  try {
    const { name, type_id, quantity, price, status_id } = req.body;
    
    // Validación
    if (!name || !type_id || quantity === undefined || !price || !status_id) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos para el suministro galáctico' 
      });
    }

    const result = await executeQuery(
      'INSERT INTO supplies (name, type_id, quantity, price, status_id) VALUES (?, ?, ?, ?, ?)',
      [name, type_id, quantity, price, status_id]
    );

    console.log(`✅ Nuevo suministro agregado - ID: ${result.insertId}`);
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Suministro galáctico agregado exitosamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error creando suministro:', error.message);
    res.status(500).json({ 
      error: 'Error agregando suministro al inventario galáctico',
      details: error.message 
    });
  }
});

// PUT - Actualizar suministro
app.put('/supplies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type_id, quantity, price, status_id } = req.body;

    // Validación
    if (!name || !type_id || quantity === undefined || !price || !status_id) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos para actualizar el suministro' 
      });
    }

    const result = await executeQuery(
      'UPDATE supplies SET name = ?, type_id = ?, quantity = ?, price = ?, status_id = ? WHERE id = ?',
      [name, type_id, quantity, price, status_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Suministro no encontrado en el inventario galáctico' 
      });
    }

    console.log(`🔄 Suministro actualizado - ID: ${id}`);
    res.json({ 
      message: 'Suministro galáctico actualizado exitosamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error actualizando suministro:', error.message);
    res.status(500).json({ 
      error: 'Error actualizando suministro galáctico',
      details: error.message 
    });
  }
});

// DELETE - Eliminar suministro
app.delete('/supplies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM supplies WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Suministro no encontrado en el inventario galáctico' 
      });
    }

    console.log(`🗑️ Suministro eliminado - ID: ${id}`);
    res.json({ 
      message: 'Suministro galáctico eliminado exitosamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error eliminando suministro:', error.message);
    res.status(500).json({ 
      error: 'Error eliminando suministro galáctico',
      details: error.message 
    });
  }
});

// ===== ARCHIVOS ESTÁTICOS AL FINAL =====
app.use('/public', express.static('public'));

// Ruta principal que sirve el HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== RUTA PARA OBTENER SERVIDOR ACTUAL =====
app.get('/current-server', async (req, res) => {
  try {
    const connectionInfo = await getConnection();
    const serverHost = connectionInfo.server === 'Server3' 
      ? (process.env.DB_HOST_PRIMARY || process.env.DB_HOST || '192.168.1.103')
      : (process.env.DB_HOST_SECONDARY || '192.168.1.104');
    
    res.json({
      server: connectionInfo.server,
      ip: serverHost,
      status: 'connected',
      timestamp: new Date().toISOString()
    });
    
    // Liberar la conexión
    connectionInfo.connection.release();
    
  } catch (error) {
    res.status(500).json({
      server: 'none',
      ip: 'N/A',
      status: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ===== RUTA DE DIAGNÓSTICO MEJORADA =====
app.get('/diagnostic', async (req, res) => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    servers: {},
    status: 'unknown'
  };

  // Probar Server3
  try {
    const conn1 = await pool1.getConnection();
    await conn1.execute('SELECT 1');
    conn1.release();
    diagnostics.servers.server3 = {
      ip: process.env.DB_HOST_PRIMARY || process.env.DB_HOST || '192.168.1.103',
      status: 'online',
      message: 'Conexión exitosa'
    };
  } catch (err) {
    diagnostics.servers.server3 = {
      ip: process.env.DB_HOST_PRIMARY || process.env.DB_HOST || '192.168.1.103',
      status: 'offline',
      message: err.message
    };
  }

  // Probar Server4
  try {
    const conn2 = await pool2.getConnection();
    await conn2.execute('SELECT 1');
    conn2.release();
    diagnostics.servers.server4 = {
      ip: process.env.DB_HOST_SECONDARY || '192.168.1.104',
      status: 'online',
      message: 'Conexión exitosa'
    };
  } catch (err) {
    diagnostics.servers.server4 = {
      ip: process.env.DB_HOST_SECONDARY || '192.168.1.104',
      status: 'offline',
      message: err.message
    };
  }

  // Determinar estado general
  const server3Online = diagnostics.servers.server3.status === 'online';
  const server4Online = diagnostics.servers.server4.status === 'online';

  if (server3Online && server4Online) {
    diagnostics.status = 'excellent';
    diagnostics.message = '🟢 Ambos servidores operativos - Máxima redundancia';
  } else if (server3Online) {
    diagnostics.status = 'good';
    diagnostics.message = '🔵 Server3 operativo - Funcionando en primario';
  } else if (server4Online) {
    diagnostics.status = 'warning';
    diagnostics.message = '🟡 Solo Server4 operativo - Funcionando en respaldo';
  } else {
    diagnostics.status = 'critical';
    diagnostics.message = '🔴 Ambos servidores caídos - Sistema inoperativo';
  }

  res.json(diagnostics);
});

// ===== INICIO DEL SERVIDOR CON VERIFICACIÓN =====
app.listen(PORT, async () => {
  console.log(`\n🚀 ========================================`);
  console.log(`   TECHSTORE GALÁCTICO INICIADO`);
  console.log(`🌐 Servidor: http://localhost:${PORT}`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`⏰ Timestamp: ${new Date().toLocaleString()}`);
  console.log(`🚀 ========================================\n`);

  // Verificar estado inicial de ambos servidores
  try {
    console.log('🔍 Verificando estado de servidores de base de datos...\n');
    
    // Probar Server3
    try {
      const conn1 = await pool1.getConnection();
      await conn1.execute('SELECT 1');
      conn1.release();
      const primaryHost = process.env.DB_HOST_PRIMARY || process.env.DB_HOST || '192.168.1.103';
      console.log(`   🔵 Server3 (${primaryHost}): ONLINE`);
    } catch (err) {
      const primaryHost = process.env.DB_HOST_PRIMARY || process.env.DB_HOST || '192.168.1.103';
      console.log(`   🔴 Server3 (${primaryHost}): OFFLINE`);
    }
    
    // Probar Server4
    try {
      const conn2 = await pool2.getConnection();
      await conn2.execute('SELECT 1');
      conn2.release();
      const secondaryHost = process.env.DB_HOST_SECONDARY || '192.168.1.104';
      console.log(`   🟢 Server4 (${secondaryHost}): ONLINE`);
    } catch (err) {
      const secondaryHost = process.env.DB_HOST_SECONDARY || '192.168.1.104';
      console.log(`   🔴 Server4 (${secondaryHost}): OFFLINE`);
    }
    
    console.log('\n🎯 Sistema de tolerancia a fallos activado');
    console.log('📊 Usa /diagnostic para ver el estado completo\n');
    
  } catch (error) {
    console.log('⚠️ No se pudo verificar el estado inicial de los servidores');
  }
});

// ===== MANEJO GLOBAL DE ERRORES =====
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
