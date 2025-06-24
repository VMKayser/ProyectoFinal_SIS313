// script_simple.js - Versión funcional básica
console.log('🌌 Iniciando TechStore Galáctico...');

const API_URL = "/supplies";

// ===== FUNCIONES BÁSICAS DE UTILIDAD =====
function showLoader() {
  const loader = document.getElementById('galactic-loader');
  if (loader) {
    loader.style.display = 'flex';
    loader.style.opacity = '1';
  }
}

function hideLoader() {
  const loader = document.getElementById('galactic-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  }
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-icon">${getNotificationIcon(type)}</span>
    <span class="notification-message">${message}</span>
  `;
  
  container.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

function getNotificationIcon(type) {
  switch(type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    default: return 'ℹ️';
  }
}

// ===== FUNCIONES DE SERVIDOR ACTUAL =====
async function updateCurrentServerIndicator() {
  try {
    const response = await fetch('/current-server');
    const serverInfo = await response.json();
    
    const serverNameElement = document.getElementById('current-server-name');
    const serverIpElement = document.getElementById('current-server-ip');
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    if (serverInfo.status === 'connected') {
      serverNameElement.textContent = serverInfo.server;
      serverIpElement.textContent = `IP: ${serverInfo.ip}`;
      
      statusDot.className = 'status-dot';
      statusText.textContent = 'CONECTADO';
      statusText.className = 'status-text';
      
      console.log(`🔗 Conectado a ${serverInfo.server} (${serverInfo.ip})`);
      
    } else {
      serverNameElement.textContent = 'DESCONECTADO';
      serverIpElement.textContent = 'IP: N/A';
      
      statusDot.className = 'status-dot disconnected';
      statusText.textContent = 'SIN CONEXIÓN';
      statusText.className = 'status-text disconnected';
      
      console.warn('⚠️ No hay conexión a base de datos');
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo servidor actual:', error);
    
    const serverNameElement = document.getElementById('current-server-name');
    const serverIpElement = document.getElementById('current-server-ip');
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    serverNameElement.textContent = 'ERROR DE CONEXIÓN';
    serverIpElement.textContent = 'IP: N/A';
    
    statusDot.className = 'status-dot disconnected';
    statusText.textContent = 'ERROR';
    statusText.className = 'status-text disconnected';
  }
}

// ===== FUNCIONES DE MONITOREO DE SERVIDORES =====
async function updateServerStatus() {
  try {
    const response = await fetch('/diagnostic');
    const diagnostics = await response.json();
    
    updateServerCard('db1-status', diagnostics.servers.server3);
    updateServerCard('db2-status', diagnostics.servers.server4);
    updateNetworkSummary(diagnostics);
    
    console.log('📊 Estado de servidores actualizado');
    
  } catch (error) {
    console.error('❌ Error actualizando estado de servidores:', error);
    updateServerCard('db1-status', { status: 'unknown', message: 'Sin respuesta' });
    updateServerCard('db2-status', { status: 'unknown', message: 'Sin respuesta' });
  }
}

function updateServerCard(elementId, serverData) {
  const statusElement = document.getElementById(elementId);
  if (!statusElement) return;
  
  statusElement.classList.remove('online', 'offline', 'warning', 'unknown');
  
  switch(serverData.status) {
    case 'online':
      statusElement.classList.add('online');
      statusElement.textContent = '🟢 ONLINE';
      break;
    case 'offline':
      statusElement.classList.add('offline');
      statusElement.textContent = '🔴 OFFLINE';
      break;
    case 'warning':
      statusElement.classList.add('warning');
      statusElement.textContent = '🟡 WARNING';
      break;
    default:
      statusElement.classList.add('unknown');
      statusElement.textContent = '⚪ UNKNOWN';
  }
  
  statusElement.title = serverData.message || 'Sin información adicional';
}

function updateNetworkSummary(diagnostics) {
  const generalStatusElement = document.getElementById('general-status');
  if (!generalStatusElement) return;
  
  generalStatusElement.textContent = diagnostics.message || '🟡 FUNCIONANDO';
}

// ===== FUNCIONES CRUD =====
async function loadSupplies() {
  try {
    showLoader();
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const supplies = await response.json();
    displaySupplies(supplies);
    
    hideLoader();
    showNotification('✅ Inventario galáctico sincronizado', 'success');
    
  } catch (error) {
    console.error('❌ Error cargando suministros:', error);
    hideLoader();
    showNotification('❌ Error sincronizando inventario galáctico', 'error');
  }
}

function displaySupplies(supplies) {
  const tableBody = document.querySelector('#supplyTable tbody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  supplies.forEach(supply => {
    const row = document.createElement('tr');
    row.className = 'table-row';
    
    row.innerHTML = `
      <td class="table-cell">${supply.id}</td>
      <td class="table-cell">${supply.name}</td>
      <td class="table-cell">${getTypeText(supply.type_id)}</td>
      <td class="table-cell">${supply.quantity}</td>
      <td class="table-cell">$${parseFloat(supply.price).toFixed(2)}</td>
      <td class="table-cell">${getStatusText(supply.status_id)}</td>
      <td class="table-cell actions-cell">
        <button class="action-btn edit" onclick="editSupply(${supply.id})">✏️</button>
        <button class="action-btn delete" onclick="deleteSupply(${supply.id})">🗑️</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

async function addSupply() {
  try {
    const name = document.getElementById('name').value.trim();
    const type_id = parseInt(document.getElementById('type_id').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const status_id = parseInt(document.getElementById('status_id').value);
    
    if (!name || !type_id || quantity < 0 || price < 0 || !status_id) {
      showNotification('⚠️ Todos los campos son requeridos', 'warning');
      return;
    }
    
    showLoader();
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, type_id, quantity, price, status_id })
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    hideLoader();
    clearForm();
    await loadSupplies();
    
    showNotification('🚀 Suministro agregado al inventario galáctico', 'success');
    
  } catch (error) {
    console.error('❌ Error agregando suministro:', error);
    hideLoader();
    showNotification('❌ Error agregando suministro', 'error');
  }
}

async function deleteSupply(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este suministro?')) {
    return;
  }
  
  try {
    showLoader();
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    hideLoader();
    await loadSupplies();
    
    showNotification('🗑️ Suministro eliminado', 'success');
    
  } catch (error) {
    console.error('❌ Error eliminando suministro:', error);
    hideLoader();
    showNotification('❌ Error eliminando suministro', 'error');
  }
}

function editSupply(id) {
  showNotification('🔧 Función de edición en desarrollo', 'info');
}

// ===== FUNCIONES AUXILIARES =====
function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('type_id').value = '';
  document.getElementById('quantity').value = '';
  document.getElementById('price').value = '';
  document.getElementById('status_id').value = '';
}

function getTypeText(type_id) {
  const types = {
    1: '📚 Cuadernos',
    2: '✏️ Lápices', 
    3: '📝 Bolígrafos',
    4: '📐 Reglas',
    5: '🖍️ Colores',
    6: '📎 Clips',
    7: '✂️ Tijeras',
    8: '🗂️ Carpetas'
  };
  return types[type_id] || `Tipo ${type_id}`;
}

function getStatusText(status_id) {
  const statuses = {
    1: '✅ Disponible',
    2: '⚠️ Agotándose',
    3: '❌ Agotado',
    4: '🔄 En reposición',
    5: '🚫 Descontinuado'
  };
  return statuses[status_id] || `Estado ${status_id}`;
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🌌 Inicializando Sistema TechStore Galáctico...');
  
  try {
    // Ocultar loader inicial después de 2 segundos
    setTimeout(() => {
      hideLoader();
    }, 2000);
    
    // Cargar datos iniciales
    await loadSupplies();
    
    // Actualizar indicadores de servidor
    await updateCurrentServerIndicator();
    await updateServerStatus();
    
    // Iniciar monitoreo automático
    setInterval(updateCurrentServerIndicator, 30000); // Cada 30 segundos
    setInterval(updateServerStatus, 60000); // Cada 60 segundos
    
    console.log('✅ Sistema TechStore Galáctico inicializado');
    showNotification('🌌 Sistema TechStore Galáctico online', 'success');
    
  } catch (error) {
    console.error('❌ Error inicializando sistema:', error);
    showNotification('❌ Error inicializando sistema', 'error');
  }
});

console.log('📡 Script cargado correctamente');
