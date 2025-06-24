const API_URL = "/supplies";

// ===== SISTEMA DE PARTÍCULAS GALÁCTICAS =====
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    
    this.resizeCanvas();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    const particleCount = Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 10000));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        color: this.getRandomColor(),
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }
  
  getRandomColor() {
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0066'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      // Movimiento
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Efecto de pulsación
      particle.opacity += Math.sin(Date.now() * particle.pulseSpeed) * 0.01;
      
      // Rebotar en los bordes
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
      
      // Dibujar partícula
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0.1, Math.min(0.8, particle.opacity));
      this.ctx.fillStyle = particle.color;
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// ===== EFECTOS DE SONIDO GALÁCTICOS =====
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.backgroundMusic = null;
    this.musicGainNode = null;
    this.sfxGainNode = null;
  }
  
  async enableAudio() {
    try {
      // Crear contexto de audio
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Crear nodos de ganancia para música y efectos
      this.musicGainNode = this.audioContext.createGain();
      this.sfxGainNode = this.audioContext.createGain();
      
      this.musicGainNode.connect(this.audioContext.destination);
      this.sfxGainNode.connect(this.audioContext.destination);
      
      this.musicGainNode.gain.value = this.musicVolume;
      this.sfxGainNode.gain.value = this.sfxVolume;
      
      this.enabled = true;
      
      // Iniciar música de fondo después de la primera interacción
      setTimeout(() => this.startBackgroundMusic(), 1000);
      
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  }
  
  // Música de fondo galáctica generativa
  async startBackgroundMusic() {
    if (!this.enabled || !this.musicEnabled) return;
    
    try {
      // Crear una música ambient galáctica usando osciladores
      this.createAmbientMusic();
      
    } catch (error) {
      console.log('Error iniciando música:', error);
    }
  }
  
  createAmbientMusic() {
    if (!this.audioContext) return;
    
    // Oscilador principal para drones galácticos
    const mainOsc = this.audioContext.createOscillator();
    const mainGain = this.audioContext.createGain();
    const mainFilter = this.audioContext.createBiquadFilter();
    
    // Configurar filtro paso bajo para efecto espacial
    mainFilter.type = 'lowpass';
    mainFilter.frequency.value = 800;
    mainFilter.Q.value = 5;
    
    mainOsc.type = 'sawtooth';
    mainOsc.frequency.value = 55; // Nota grave
    mainGain.gain.value = 0.12;
    
    // Segundo oscilador para armonías
    const harmOsc1 = this.audioContext.createOscillator();
    const harmGain1 = this.audioContext.createGain();
    
    harmOsc1.type = 'triangle';
    harmOsc1.frequency.value = 82.5; // Quinta perfecta
    harmGain1.gain.value = 0.08;
    
    // Tercer oscilador para octava
    const harmOsc2 = this.audioContext.createOscillator();
    const harmGain2 = this.audioContext.createGain();
    
    harmOsc2.type = 'sine';
    harmOsc2.frequency.value = 110; // Octava
    harmGain2.gain.value = 0.06;
    
    // LFO para modulación de frecuencia
    const lfo1 = this.audioContext.createOscillator();
    const lfoGain1 = this.audioContext.createGain();
    
    lfo1.type = 'sine';
    lfo1.frequency.value = 0.08; // Muy lento para efecto espacial
    lfoGain1.gain.value = 8;
    
    // LFO para modulación de filtro
    const lfo2 = this.audioContext.createOscillator();
    const lfoGain2 = this.audioContext.createGain();
    
    lfo2.type = 'triangle';
    lfo2.frequency.value = 0.12;
    lfoGain2.gain.value = 200;
    
    // Conexiones principales
    mainOsc.connect(mainFilter);
    mainFilter.connect(mainGain);
    mainGain.connect(this.musicGainNode);
    
    harmOsc1.connect(harmGain1);
    harmGain1.connect(this.musicGainNode);
    
    harmOsc2.connect(harmGain2);
    harmGain2.connect(this.musicGainNode);
    
    // Conexiones de modulación
    lfo1.connect(lfoGain1);
    lfoGain1.connect(mainOsc.frequency);
    
    lfo2.connect(lfoGain2);
    lfoGain2.connect(mainFilter.frequency);
    
    // Iniciar todos los osciladores
    mainOsc.start();
    harmOsc1.start();
    harmOsc2.start();
    lfo1.start();
    lfo2.start();
    
    // Crear pads flotantes que aparecen aleatoriamente
    this.createFloatingPads();
    
    // Guardar referencias para control
    this.backgroundMusic = {
      mainOsc,
      harmOsc1,
      harmOsc2,
      lfo1,
      lfo2,
      mainGain,
      harmGain1,
      harmGain2,
      mainFilter
    };
  }
  
  // Crear pads flotantes que aparecen aleatoriamente
  createFloatingPads() {
    const playRandomPad = () => {
      if (!this.enabled || !this.musicEnabled) {
        setTimeout(playRandomPad, 5000);
        return;
      }
      
      const now = this.audioContext.currentTime;
      const frequencies = [164.81, 196.00, 220.00, 246.94, 293.66]; // E3, G3, A3, B3, D4
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
      
      const padOsc = this.audioContext.createOscillator();
      const padGain = this.audioContext.createGain();
      const padFilter = this.audioContext.createBiquadFilter();
      
      padOsc.type = 'triangle';
      padOsc.frequency.value = freq;
      
      padFilter.type = 'lowpass';
      padFilter.frequency.value = 1000;
      padFilter.Q.value = 2;
      
      // Envelope lento y suave
      padGain.gain.setValueAtTime(0, now);
      padGain.gain.linearRampToValueAtTime(0.03, now + 3);
      padGain.gain.setValueAtTime(0.03, now + 8);
      padGain.gain.linearRampToValueAtTime(0, now + 12);
      
      padOsc.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(this.musicGainNode);
      
      padOsc.start(now);
      padOsc.stop(now + 12);
      
      // Programar siguiente pad
      const nextDelay = 8000 + Math.random() * 12000; // 8-20 segundos
      setTimeout(playRandomPad, nextDelay);
    };
    
    // Iniciar el primer pad después de un delay
    setTimeout(playRandomPad, 5000);
  }
  
  // Efecto de disparo galáctico
  playGalacticBlast() {
    if (!this.enabled || !this.sfxEnabled) return;
    
    const now = this.audioContext.currentTime;
    
    // Oscilador principal del disparo
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    const filter1 = this.audioContext.createBiquadFilter();
    
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(600, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.4);
    
    filter1.type = 'bandpass';
    filter1.frequency.value = 1200;
    filter1.Q.value = 15;
    
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    // Segundo oscilador para el "whoosh" espacial
    const osc2 = this.audioContext.createOscillator();
    const gain2 = this.audioContext.createGain();
    const filter2 = this.audioContext.createBiquadFilter();
    
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(1200, now);
    osc2.frequency.exponentialRampToValueAtTime(150, now + 0.3);
    
    filter2.type = 'highpass';
    filter2.frequency.value = 300;
    
    gain2.gain.setValueAtTime(0.3, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    // Conexiones
    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(this.sfxGainNode);
    
    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(this.sfxGainNode);
    
    // Reproducir
    osc1.start(now);
    osc1.stop(now + 0.4);
    osc2.start(now);
    osc2.stop(now + 0.3);
  }
  
  // Sonido de beep mejorado
  playBeep(frequency = 440, duration = 200) {
    if (!this.enabled || !this.sfxEnabled) return;
    
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGainNode);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
    
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
  }
  
  // Efecto de éxito galáctico mejorado
  playSuccessSound() {
    if (!this.enabled || !this.sfxEnabled) return;
    
    const now = this.audioContext.currentTime;
    
    // Secuencia ascendente de tonos con armonías
    const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const harmonies = [659, 784, 988, 1319]; // Terceras mayores
    
    frequencies.forEach((freq, index) => {
      // Tono principal
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 2;
      
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + index * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.25);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGainNode);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.25);
      
      // Armonía
      const harmOsc = this.audioContext.createOscillator();
      const harmGain = this.audioContext.createGain();
      
      harmOsc.type = 'triangle';
      harmOsc.frequency.value = harmonies[index];
      
      harmGain.gain.setValueAtTime(0, now + index * 0.08 + 0.02);
      harmGain.gain.linearRampToValueAtTime(0.1, now + index * 0.08 + 0.06);
      harmGain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.2);
      
      harmOsc.connect(harmGain);
      harmGain.connect(this.sfxGainNode);
      
      harmOsc.start(now + index * 0.08 + 0.02);
      harmOsc.stop(now + index * 0.08 + 0.2);
    });
  }
  
  // Efecto de error galáctico mejorado
  playErrorSound() {
    if (!this.enabled || !this.sfxEnabled) return;
    
    const now = this.audioContext.currentTime;
    
    // Sonido descendente y áspero
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    const filter1 = this.audioContext.createBiquadFilter();
    
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(330, now);
    osc1.frequency.exponentialRampToValueAtTime(110, now + 0.6);
    
    filter1.type = 'lowpass';
    filter1.frequency.value = 500;
    filter1.Q.value = 5;
    
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    
    // Segundo oscilador para distorsión
    const osc2 = this.audioContext.createOscillator();
    const gain2 = this.audioContext.createGain();
    
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(165, now);
    osc2.frequency.exponentialRampToValueAtTime(55, now + 0.8);
    
    gain2.gain.setValueAtTime(0.3, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    
    // Conexiones
    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(this.sfxGainNode);
    
    osc2.connect(gain2);
    gain2.connect(this.sfxGainNode);
    
    // Reproducir
    osc1.start(now);
    osc1.stop(now + 0.6);
    osc2.start(now);
    osc2.stop(now + 0.8);
  }
  
  // Nuevos efectos de sonido
  playTypingSound() {
    if (!this.enabled || !this.sfxEnabled) return;
    
    const now = this.audioContext.currentTime;
    const freq = 800 + Math.random() * 600;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    osc.type = 'square';
    osc.frequency.value = freq;
    
    filter.type = 'highpass';
    filter.frequency.value = 400;
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }
  
  playHoverSound() {
    if (!this.enabled || !this.sfxEnabled) return;
    
    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(660, now + 0.1);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }
  
  playLoadingSound() {
    if (!this.enabled || !this.sfxEnabled) return;
    
    const now = this.audioContext.currentTime;
    
    // Pulsos rítmicos
    for (let i = 0; i < 3; i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = 220 + i * 110;
      
      gain.gain.setValueAtTime(0, now + i * 0.2);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.2 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.15);
      
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      
      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.15);
    }
  }
  
  // Control de volumen
  setMasterVolume(volume) {
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = volume * this.musicVolume;
    }
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = volume * this.sfxVolume;
    }
  }
  
  // Pausar todo
  pauseAll() {
    this.enabled = false;
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = 0;
    }
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = 0;
    }
  }
  
  // Limpiar recursos de audio
  destroy() {
    if (this.backgroundMusic) {
      Object.values(this.backgroundMusic).forEach(node => {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      });
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// ===== SISTEMA DE NOTIFICACIONES =====
class NotificationSystem {
  static show(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getIcon(type)}</span>
        <span class="notification-text">${message}</span>
      </div>
    `;
    
    // Estilos dinámicos
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.9), rgba(102, 0, 255, 0.9))',
      color: '#fff',
      padding: '15px 20px',
      borderRadius: '10px',
      border: '2px solid #00ffff',
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
      zIndex: '10000',
      fontSize: '14px',
      fontFamily: 'Orbitron, monospace',
      transform: 'translateX(400px)',
      transition: 'all 0.3s ease',
      maxWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  
  static getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }
}

// ===== GESTIÓN DE DATOS MEJORADA =====
let particleSystem;
let soundManager;

async function fetchSupplies(showLoader = true) {
  try {
    if (showLoader) {
      showLoadingEffect();
    }
    
    // Agregar timeout para evitar cuelgues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
    
    const res = await fetch(API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const supplies = await res.json();
    const tbody = document.querySelector("#supplyTable tbody");
    tbody.innerHTML = "";
    
    if (supplies.length === 0) {
      // Mostrar mensaje cuando no hay datos
      const row = document.createElement("tr");
      row.innerHTML = `
        <td colspan="7" style="text-align: center; padding: 40px; color: #00ffff; font-family: 'Orbitron', monospace;">
          🌌 No hay suministros en el inventario galáctico
          <br><br>
          <small style="color: #888;">Agrega el primer suministro usando el formulario de abajo</small>
        </td>
      `;
      tbody.appendChild(row);
    } else {
      supplies.forEach((s, index) => {
        const row = document.createElement("tr");
        row.style.animationDelay = `${index * 0.1}s`;
        row.className = 'table-row-animated';
        
        row.innerHTML = `
          <td><span class="data-chip">${s.id}</span></td>
          <td><span class="item-name">${s.name}</span></td>
          <td><span class="type-badge">${getTypeName(s.type_id)}</span></td>
          <td><span class="quantity-display">${s.quantity}</span></td>
          <td><span class="price-display">$${parseFloat(s.price).toFixed(2)}</span></td>
          <td><span class="status-indicator status-${s.status_id}">${getStatusName(s.status_id)}</span></td>
          <td>
            <button onclick="editSupply(${s.id})" class="action-btn edit-btn">✏️ Editar</button>
            <button onclick="deleteSupply(${s.id})" class="action-btn delete-btn">🗑️ Eliminar</button>
          </td>
        `;
        tbody.appendChild(row);
      });
      
      if (showLoader) {
        NotificationSystem.show(`${supplies.length} suministros cargados exitosamente`, 'success');
        // Solo reproducir sonido si soundManager está disponible
        if (soundManager && soundManager.enabled) {
          try {
            soundManager.playSuccessSound();
          } catch (audioError) {
            console.log('Audio no disponible:', audioError);
          }
        }
      }
    }
    
    // SIEMPRE ocultar el loader al final, independientemente de showLoader
    hideLoadingEffect();
    
  } catch (err) {
    // SIEMPRE ocultar el loader en caso de error
    hideLoadingEffect();
    
    console.error('Error fetching supplies:', err);
    
    // Mostrar diferentes mensajes según el tipo de error
    if (err.name === 'AbortError') {
      NotificationSystem.show('Timeout: La conexión está tardando demasiado. Verifica el servidor.', 'error');
    } else if (err.message.includes('Failed to fetch')) {
      NotificationSystem.show('Error de conexión: No se puede conectar al servidor.', 'error');
    } else {
      NotificationSystem.show(`Error al cargar los suministros: ${err.message}`, 'error');
    }
    
    // Mostrar mensaje de error en la tabla
    const tbody = document.querySelector("#supplyTable tbody");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: #ff6666; font-family: 'Orbitron', monospace;">
            ⚠️ Error de conexión con la base de datos
            <br><br>
            <small style="color: #888;">
              Verifica que el servidor esté corriendo en el puerto 3000<br>
              y que la base de datos esté configurada correctamente
            </small>
          </td>
        </tr>
      `;
    }
    
    // Solo reproducir sonido de error si soundManager está disponible
    // Solo reproducir sonido si soundManager está disponible
    if (soundManager && soundManager.enabled) {
      try {
        soundManager.playErrorSound();
      } catch (audioError) {
        console.log('Audio no disponible:', audioError);
      }
    }
  }
}

async function addSupply() {
  const data = {
    name: document.getElementById("name").value.trim(),
    type_id: parseInt(document.getElementById("type_id").value),
    quantity: parseInt(document.getElementById("quantity").value),
    price: parseFloat(document.getElementById("price").value),
    status_id: parseInt(document.getElementById("status_id").value)
  };

  // Validación mejorada
  if (!data.name) {
    NotificationSystem.show('El nombre del artículo es requerido', 'warning');
    document.getElementById("name").focus();
    return;
  }
  
  if (!document.getElementById("type_id").value) {
    NotificationSystem.show('Debe seleccionar un tipo', 'warning');
    document.getElementById("type_id").focus();
    return;
  }
  
  if (!document.getElementById("quantity").value || isNaN(data.quantity) || data.quantity < 0) {
    NotificationSystem.show('La cantidad debe ser un número válido mayor o igual a 0', 'warning');
    document.getElementById("quantity").focus();
    return;
  }
  
  if (!document.getElementById("price").value || isNaN(data.price) || data.price < 0) {
    NotificationSystem.show('El precio debe ser un número válido mayor o igual a 0', 'warning');
    document.getElementById("price").focus();
    return;
  }
  
  if (!document.getElementById("status_id").value) {
    NotificationSystem.show('Debe seleccionar un estado', 'warning');
    document.getElementById("status_id").focus();
    return;
  }

  try {
    showLoadingEffect();
    
    // Agregar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    // Limpiar formulario
    clearForm();
    
    // Recargar datos sin loader adicional
    await refreshSuppliesData();
    
    NotificationSystem.show('Suministro agregado exitosamente', 'success');
    if (soundManager && soundManager.enabled) {
      soundManager.playSuccessSound();
    }
    
    // Efecto visual en el botón
    createButtonEffect();
    
  } catch (err) {
    hideLoadingEffect();
    console.error('Error adding supply:', err);
    
    if (err.name === 'AbortError') {
      NotificationSystem.show('Timeout: La operación está tardando demasiado', 'error');
    } else {
      NotificationSystem.show('Error al agregar el suministro', 'error');
    }
    if (soundManager && soundManager.enabled) {
      soundManager.playErrorSound();
    }
  } finally {
    // Asegurar que el loader se oculte siempre
    setTimeout(() => {
      hideLoadingEffect();
    }, 100);
  }
}

async function deleteSupply(id) {
  if (!confirm('🚀 ¿Confirmar eliminación de este suministro galáctico?')) {
    return;
  }
  
  try {
    showLoadingEffect();
    
    const response = await fetch(`${API_URL}/${id}`, { 
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    // Recargar datos sin loader adicional
    await refreshSuppliesData();
    NotificationSystem.show('Suministro eliminado exitosamente', 'success');
    if (soundManager && soundManager.enabled) {
      soundManager.playSuccessSound();
    }
    
  } catch (err) {
    hideLoadingEffect();
    console.error('Error deleting supply:', err);
    NotificationSystem.show('Error al eliminar el suministro', 'error');
    if (soundManager && soundManager.enabled) {
      soundManager.playErrorSound();
    }
  } finally {
    // Asegurar que el loader se oculte siempre
    setTimeout(() => {
      hideLoadingEffect();
    }, 100);
  }
}

// ===== FUNCIÓN PARA REFRESCAR DATOS SIN LOADER ADICIONAL =====
async function refreshSuppliesData() {
  try {
    const res = await fetch(API_URL);
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const supplies = await res.json();
    const tbody = document.querySelector("#supplyTable tbody");
    tbody.innerHTML = "";
    
    supplies.forEach((s, index) => {
      const row = document.createElement("tr");
      row.style.animationDelay = `${index * 0.05}s`; // Animación más rápida
      row.className = 'table-row-animated';
      
      row.innerHTML = `
        <td><span class="data-chip">${s.id}</span></td>
        <td><span class="item-name">${s.name}</span></td>
        <td><span class="type-badge">${getTypeName(s.type_id)}</span></td>
        <td><span class="quantity-display">${s.quantity}</span></td>
        <td><span class="price-display">$${parseFloat(s.price).toFixed(2)}</span></td>
        <td><span class="status-indicator status-${s.status_id}">${getStatusName(s.status_id)}</span></td>
        <td>
          <button onclick="editSupply(${s.id})" class="action-btn edit-btn">✏️ Editar</button>
          <button onclick="deleteSupply(${s.id})" class="action-btn delete-btn">🗑️ Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
    
  } catch (err) {
    console.error('Error refreshing supplies:', err);
    NotificationSystem.show('Error al actualizar la tabla', 'error');
  }
}

// ===== FUNCIONES AUXILIARES =====
function getTypeName(typeId) {
  const types = {
    1: 'Escritura',
    2: 'Arte',
    3: 'Organización',
    4: 'Tecnología',
    5: 'Deportes'
  };
  return types[typeId] || `Tipo ${typeId}`;
}

function getStatusName(statusId) {
  const statuses = {
    1: 'Disponible',
    2: 'Agotado',
    3: 'En pedido',
    4: 'Descontinuado'
  };
  return statuses[statusId] || `Estado ${statusId}`;
}

function clearForm() {
  document.getElementById("name").value = '';
  document.getElementById("type_id").value = '';
  document.getElementById("quantity").value = '';
  document.getElementById("price").value = '';
  document.getElementById("status_id").value = '';
  
  // Remover clases de error si existen
  const inputs = document.querySelectorAll('.cyber-input, .cyber-select');
  inputs.forEach(input => {
    input.classList.remove('error');
  });
}

function hideLoadingEffect() {
  // Remover todos los loaders existentes de forma más agresiva
  const loaders = document.querySelectorAll('#galaxyLoader, .galaxy-loader, [id*="loader"]');
  loaders.forEach(loader => {
    if (loader && loader.parentNode) {
      loader.style.opacity = '0';
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 100);
    }
  });
  
  // También buscar por clase o estilo para asegurar que se eliminen todos
  const allLoaders = document.querySelectorAll('[style*="Procesando datos galácticos"], [style*="position: fixed"]');
  allLoaders.forEach(loader => {
    if (loader.innerHTML && loader.innerHTML.includes('Procesando datos galácticos')) {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }
  });
}

// ===== FUNCIÓN DE EMERGENCIA PARA ELIMINAR LOADERS =====
function forceHideAllLoaders() {
  // Eliminar todos los elementos que puedan ser loaders
  const possibleLoaders = document.querySelectorAll('div');
  possibleLoaders.forEach(element => {
    const style = window.getComputedStyle(element);
    const content = element.textContent || '';
    
    // Si el elemento tiene características de loader, eliminarlo
    if (
      (style.position === 'fixed' && style.zIndex >= '9999') ||
      content.includes('Procesando datos galácticos') ||
      content.includes('loader') ||
      element.classList.contains('loader') ||
      element.id.includes('loader')
    ) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
        console.log('Loader eliminado:', element);
      }
    }
  });
}

// Ejecutar automáticamente después de 3 segundos si hay loaders
setTimeout(() => {
  const persistentLoaders = document.querySelectorAll('#galaxyLoader');
  if (persistentLoaders.length > 0) {
    console.log('🧹 Limpiando loaders persistentes...');
    forceHideAllLoaders();
  }
}, 3000);

function showLoadingEffect() {
  // Primero remover cualquier loader existente
  hideLoadingEffect();
  
  // Esperar un poco antes de mostrar el nuevo loader
  setTimeout(() => {
    const loader = document.createElement('div');
    loader.id = 'galaxyLoader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="spinner"></div>
        <div class="loader-text">Procesando datos galácticos...</div>
      </div>
    `;
    
    Object.assign(loader.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '9999',
      color: '#00ffff',
      fontFamily: 'Orbitron, monospace',
      opacity: '0',
      transition: 'opacity 0.2s ease'
    });
    
    document.body.appendChild(loader);
    
    // Animar entrada
    setTimeout(() => {
      loader.style.opacity = '1';
    }, 50);
  }, 50);
}

function createButtonEffect() {
  const button = document.querySelector('.quantum-button');
  button.style.transform = 'scale(1.1)';
  button.style.boxShadow = '0 0 50px rgba(0, 255, 255, 1)';
  
  setTimeout(() => {
    button.style.transform = '';
    button.style.boxShadow = '';
  }, 300);
}

// ===== INICIALIZACIÓN MEJORADA =====
document.addEventListener("DOMContentLoaded", async () => {
  // Inicializar sistemas
  try {
    // Verificar estado inicial del servidor
    await checkServerStatus();
    
    // Inicializar sistema de partículas
    particleSystem = new ParticleSystem();
    
    // Inicializar sistema de audio
    soundManager = new SoundManager();
    
    // Cargar suministros
    await fetchSupplies();
    
    console.log('🚀 TechStore Galáctico inicializado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la inicialización:', error);
    NotificationSystem.show('Error al inicializar la aplicación', 'error');
  }
  
  // Efectos adicionales de teclado
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.ctrlKey) {
      e.preventDefault();
      // Activar modo turbo
      document.body.style.filter = 'brightness(1.2) saturate(1.3)';
      setTimeout(() => {
        document.body.style.filter = '';
      }, 200);
    }
  });
});

// ===== FUNCIÓN PARA PROBAR CONEXIÓN =====
async function testConnection(showNotifications = false) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos para prueba
    
    const response = await fetch('/diagnostic', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Conexión exitosa:', result);
      return true;
    } else {
      throw new Error(`Error en diagnóstico: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Error de conexión:', error);
    
    if (showNotifications) {
      if (error.name === 'AbortError') {
        NotificationSystem.show('⚠️ Timeout de conexión. Verifica que el servidor esté corriendo.', 'warning');
      } else {
        NotificationSystem.show('⚠️ No se puede conectar al servidor. Verifica la configuración.', 'warning');
      }
    }
    
    return false;
  }
}

// ===== SISTEMA DE EDICIÓN GALÁCTICO =====
let editingId = null;

function editSupply(id) {
  try {
    // Obtener los datos del suministro de la tabla
    const row = event.target.closest('tr');
    const cells = row.querySelectorAll('td');
    
    const currentData = {
      id: id,
      name: cells[1].querySelector('.item-name').textContent,
      type_id: getTypeIdFromName(cells[2].querySelector('.type-badge').textContent),
      quantity: parseInt(cells[3].querySelector('.quantity-display').textContent),
      price: parseFloat(cells[4].querySelector('.price-display').textContent.replace('$', '')),
      status_id: getStatusIdFromName(cells[5].querySelector('.status-indicator').textContent)
    };
    
    // Mostrar modal de edición
    showEditModal(currentData);
    if (soundManager && soundManager.enabled) {
      soundManager.playGalacticBlast();
    }
    
  } catch (error) {
    console.error('Error al obtener datos para edición:', error);
    NotificationSystem.show('Error al cargar datos para edición', 'error');
  }
}

function showEditModal(data) {
  // Crear modal galáctico
  const modal = document.createElement('div');
  modal.id = 'editModal';
  modal.className = 'galactic-modal';
  
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeEditModal()"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>🛸 EDITAR SUMINISTRO GALÁCTICO</h2>
        <button class="close-btn" onclick="closeEditModal()">✖️</button>
      </div>
      
      <div class="modal-body">
        <div class="edit-form-grid">
          <div class="input-group">
            <label class="cyber-label">NOMBRE DEL ARTÍCULO</label>
            <input type="text" id="edit-name" value="${data.name}" class="cyber-input">
            <div class="input-glow"></div>
          </div>
          
          <div class="input-group">
            <label class="cyber-label">TIPO</label>
            <select id="edit-type_id" class="cyber-select">
              <option value="1" ${data.type_id === 1 ? 'selected' : ''}>📝 Escritura</option>
              <option value="2" ${data.type_id === 2 ? 'selected' : ''}>🎨 Arte</option>
              <option value="3" ${data.type_id === 3 ? 'selected' : ''}>📚 Organización</option>
              <option value="4" ${data.type_id === 4 ? 'selected' : ''}>💻 Tecnología</option>
              <option value="5" ${data.type_id === 5 ? 'selected' : ''}>⚽ Deportes</option>
            </select>
            <div class="input-glow"></div>
          </div>
          
          <div class="input-group">
            <label class="cyber-label">CANTIDAD</label>
            <input type="number" id="edit-quantity" value="${data.quantity}" class="cyber-input" min="0">
            <div class="input-glow"></div>
          </div>
          
          <div class="input-group">
            <label class="cyber-label">PRECIO GALÁCTICO</label>
            <input type="number" step="0.01" id="edit-price" value="${data.price}" class="cyber-input" min="0">
            <div class="input-glow"></div>
          </div>
          
          <div class="input-group">
            <label class="cyber-label">ESTADO OPERATIVO</label>
            <select id="edit-status_id" class="cyber-select">
              <option value="1" ${data.status_id === 1 ? 'selected' : ''}>✅ Disponible</option>
              <option value="2" ${data.status_id === 2 ? 'selected' : ''}>❌ Agotado</option>
              <option value="3" ${data.status_id === 3 ? 'selected' : ''}>⏳ En pedido</option>
              <option value="4" ${data.status_id === 4 ? 'selected' : ''}>🚫 Descontinuado</option>
            </select>
            <div class="input-glow"></div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button onclick="closeEditModal()" class="cancel-btn">
          🚫 CANCELAR
        </button>
        <button onclick="saveEditedSupply(${data.id})" class="save-btn">
          💾 GUARDAR CAMBIOS
        </button>
      </div>
    </div>
  `;
  
  // Agregar estilos dinámicos al modal
  const style = document.createElement('style');
  style.textContent = `
    .galactic-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: modalFadeIn 0.3s ease;
    }
    
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
    }
    
    .modal-content {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 50, 100, 0.3));
      border: 2px solid #00ffff;
      border-radius: 20px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
      animation: modalSlideIn 0.4s ease;
    }
    
    .modal-header {
      background: linear-gradient(90deg, rgba(0, 255, 255, 0.2), rgba(102, 0, 255, 0.2));
      padding: 20px 30px;
      border-bottom: 1px solid #00ffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h2 {
      margin: 0;
      font-family: 'Orbitron', monospace;
      color: #00ffff;
      text-shadow: 0 0 10px #00ffff;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: #ff0066;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 5px;
      transition: all 0.3s ease;
    }
    
    .close-btn:hover {
      color: #ff4488;
      transform: scale(1.2);
    }
    
    .modal-body {
      padding: 30px;
    }
    
    .edit-form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .cyber-select {
      width: 100%;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid rgba(0, 255, 255, 0.5);
      border-radius: 8px;
      padding: 12px 15px;
      color: #00ffff;
      font-family: 'Exo 2', sans-serif;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .cyber-select:focus {
      outline: none;
      border-color: #00ffff;
      background: rgba(0, 255, 255, 0.1);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    }
    
    .modal-footer {
      padding: 20px 30px;
      border-top: 1px solid rgba(0, 255, 255, 0.3);
      display: flex;
      gap: 15px;
      justify-content: flex-end;
    }
    
    .cancel-btn, .save-btn {
      padding: 12px 25px;
      border: none;
      border-radius: 25px;
      font-family: 'Orbitron', monospace;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
    }
    
    .cancel-btn {
      background: linear-gradient(45deg, #666, #888);
      color: white;
      box-shadow: 0 0 10px rgba(102, 102, 102, 0.5);
    }
    
    .cancel-btn:hover {
      background: linear-gradient(45deg, #888, #aaa);
      transform: translateY(-2px);
    }
    
    .save-btn {
      background: linear-gradient(45deg, #00ffff, #0088ff);
      color: #000;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
    }
    
    .save-btn:hover {
      background: linear-gradient(45deg, #44ffff, #44aaff);
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0, 255, 255, 0.7);
    }
    
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes modalSlideIn {
      from { transform: translateY(-50px) scale(0.9); }
      to { transform: translateY(0) scale(1); }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(modal);
  editingId = data.id;
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.style.animation = 'modalFadeOut 0.3s ease';
    setTimeout(() => {
      modal.remove();
      // Remover estilos del modal
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        if (style.textContent.includes('.galactic-modal')) {
          style.remove();
        }
      });
    }, 300);
  }
  editingId = null;
  if (soundManager && soundManager.enabled) {
    soundManager.playBeep(500, 100);
  }
}

async function saveEditedSupply(id) {
  const data = {
    name: document.getElementById("edit-name").value.trim(),
    type_id: parseInt(document.getElementById("edit-type_id").value),
    quantity: parseInt(document.getElementById("edit-quantity").value),
    price: parseFloat(document.getElementById("edit-price").value),
    status_id: parseInt(document.getElementById("edit-status_id").value)
  };

  // Validación
  if (!data.name) {
    NotificationSystem.show('El nombre del artículo es requerido', 'warning');
    return;
  }
  
  if (isNaN(data.type_id) || isNaN(data.quantity) || isNaN(data.price) || isNaN(data.status_id)) {
    NotificationSystem.show('Todos los campos son requeridos', 'warning');
    return;
  }

  if (data.quantity < 0 || data.price < 0) {
    NotificationSystem.show('La cantidad y precio deben ser mayores a 0', 'warning');
    return;
  }

  try {
    showLoadingEffect();
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    closeEditModal();
    await refreshSuppliesData();
    
    NotificationSystem.show('Suministro actualizado exitosamente', 'success');
    if (soundManager && soundManager.enabled) {
      soundManager.playSuccessSound();
    }
    
  } catch (err) {
    hideLoadingEffect();
    console.error('Error updating supply:', err);
    NotificationSystem.show('Error al actualizar el suministro', 'error');
    if (soundManager && soundManager.enabled) {
      soundManager.playErrorSound();
    }
  } finally {
    // Asegurar que el loader se oculte siempre
    setTimeout(() => {
      hideLoadingEffect();
    }, 100);
  }
}

// Funciones auxiliares para conversión de datos
function getTypeIdFromName(typeName) {
  const typeMap = {
    'Escritura': 1,
    'Arte': 2,
    'Organización': 3,
    'Tecnología': 4,
    'Deportes': 5
  };
  return typeMap[typeName] || 1;
}

function getStatusIdFromName(statusName) {
  const statusMap = {
    'Disponible': 1,
    'Agotado': 2,
    'En pedido': 3,
    'Descontinuado': 4
  };
  return statusMap[statusName] || 1;
}

// ===== SISTEMA DE DIAGNÓSTICO DE SERVIDORES =====
async function checkServerStatus() {
  try {
    const response = await fetch('/diagnostic');
    const status = await response.json();
    
    // Mostrar estado en la consola
    console.log('📊 Estado de Servidores:', status);
    
    // Actualizar indicador visual
    updateServerStatusIndicator(status);
    
    return status;
  } catch (error) {
    console.error('❌ Error verificando estado de servidores:', error);
    updateServerStatusIndicator({ status: 'critical', message: 'Error de conexión' });
    return null;
  }
}

function updateServerStatusIndicator(status) {
  const indicator = document.querySelector('.indicator');
  const label = document.querySelector('.indicator-label');
  
  if (!indicator || !label) return;
  
  // Remover clases anteriores
  indicator.classList.remove('online', 'warning', 'error');
  
  switch(status.status) {
    case 'excellent':
      indicator.classList.add('online');
      label.textContent = 'SISTEMA ÓPTIMO';
      label.style.color = '#00ff00';
      break;
    case 'good':
      indicator.classList.add('online');
      label.textContent = 'PRIMARIO ACTIVO';
      label.style.color = '#00ff00';
      break;
    case 'warning':
      indicator.classList.add('warning');
      label.textContent = 'RESPALDO ACTIVO';
      label.style.color = '#ffff00';
      break;
    case 'critical':
      indicator.classList.add('error');
      label.textContent = 'SISTEMA CRÍTICO';
      label.style.color = '#ff0000';
      break;
    default:
      label.textContent = 'ESTADO DESCONOCIDO';
      label.style.color = '#888';
  }
  
  // Mostrar notificación del estado
  if (status.message) {
    NotificationSystem.show(status.message, getNotificationType(status.status));
  }
}

function getNotificationType(status) {
  switch(status) {
    case 'excellent':
    case 'good':
      return 'success';
    case 'warning':
      return 'warning';
    case 'critical':
      return 'error';
    default:
      return 'info';
  }
}

// Verificar estado del servidor cada 10 segundos
setInterval(() => {
  checkServerStatus();
}, 10000);

// ===== EFECTOS ADICIONALES PARA BOTONES =====
function addButtonClickEffects() {
  // Agregar efectos de sonido a todos los botones relevantes
  document.addEventListener('click', (e) => {
    if (e.target.matches('button, .quantum-button, .action-btn')) {
      if (soundManager && soundManager.enabled) {
        soundManager.playGalacticBlast();
      }
      
      // Efecto visual de ondas
      createClickWave(e);
    }
  });
  
  // Efectos de hover
  document.addEventListener('mouseover', (e) => {
    if (e.target.matches('button, .cyber-input, .cyber-select')) {
      if (soundManager && soundManager.enabled) {
        soundManager.playHoverSound();
      }
    }
  });
  
  // Efectos de typing
  document.addEventListener('input', (e) => {
    if (e.target.matches('.cyber-input')) {
      if (soundManager && soundManager.enabled) {
        soundManager.playTypingSound();
      }
    }
  });
}

function createClickWave(e) {
  const wave = document.createElement('div');
  wave.className = 'click-wave';
  wave.style.cssText = `
    position: fixed;
    left: ${e.clientX - 10}px;
    top: ${e.clientY - 10}px;
    width: 20px;
    height: 20px;
    border: 2px solid #00ffff;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    animation: wave-expand 0.6s ease-out forwards;
  `;
  
  document.body.appendChild(wave);
  
  setTimeout(() => {
    document.body.removeChild(wave);
  }, 600);
}

// ===== FUNCIONES DE LOADER =====
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

// ===== SISTEMA DE NOTIFICACIONES =====
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  notification.innerHTML = `
    <div class="notification-icon">${typeIcons[type] || 'ℹ️'}</div>
    <div class="notification-message">${message}</div>
    <div class="notification-close" onclick="this.parentElement.remove()">×</div>
  `;
  
  container.appendChild(notification);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// ===== FUNCIÓN PARA ANIMAR TARJETAS =====
function animateCards() {
  const cards = document.querySelectorAll('.server-card, .inventory-panel, .control-panel');
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

// ===== SISTEMA DE MONITOREO DE SERVIDOR ACTUAL =====
async function updateCurrentServerIndicator() {
  try {
    const response = await fetch('/current-server');
    const serverInfo = await response.json();
    
    const serverNameElement = document.getElementById('current-server-name');
    const serverIpElement = document.getElementById('current-server-ip');
    const connectionStatusElement = document.getElementById('connection-status');
    const statusDot = connectionStatusElement.querySelector('.status-dot');
    const statusText = connectionStatusElement.querySelector('.status-text');
    
    if (serverInfo.status === 'connected') {
      // Actualizar información del servidor
      serverNameElement.textContent = serverInfo.server;
      serverIpElement.textContent = `IP: ${serverInfo.ip}`;
      
      // Actualizar estado de conexión
      statusDot.className = 'status-dot';
      statusText.textContent = 'CONECTADO';
      statusText.className = 'status-text';
      
      // Reproducir sonido de confirmación
      if (window.soundManager) {
        window.soundManager.playSuccess();
      }
      
      console.log(`🔗 Conectado a ${serverInfo.server} (${serverInfo.ip})`);
      
    } else {
      // Estado desconectado
      serverNameElement.textContent = 'DESCONECTADO';
      serverIpElement.textContent = 'IP: N/A';
      
      statusDot.className = 'status-dot disconnected';
      statusText.textContent = 'SIN CONEXIÓN';
      statusText.className = 'status-text disconnected';
      
      // Reproducir sonido de error
      if (window.soundManager) {
        window.soundManager.playError();
      }
      
      console.warn('⚠️ No hay conexión a base de datos');
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo servidor actual:', error);
    
    // Estado de error
    const serverNameElement = document.getElementById('current-server-name');
    const serverIpElement = document.getElementById('current-server-ip');
    const connectionStatusElement = document.getElementById('connection-status');
    const statusDot = connectionStatusElement.querySelector('.status-dot');
    const statusText = connectionStatusElement.querySelector('.status-text');
    
    serverNameElement.textContent = 'ERROR DE CONEXIÓN';
    serverIpElement.textContent = 'IP: N/A';
    
    statusDot.className = 'status-dot disconnected';
    statusText.textContent = 'ERROR';
    statusText.className = 'status-text disconnected';
  }
}

// ===== SISTEMA DE MONITOREO DE SERVIDORES =====
async function updateServerStatus() {
  try {
    const response = await fetch('/diagnostic');
    const diagnostics = await response.json();
    
    // Actualizar estado del servidor primario (Server3)
    updateServerCard('db1-status', diagnostics.servers.server3);
    
    // Actualizar estado del servidor secundario (Server4)
    updateServerCard('db2-status', diagnostics.servers.server4);
    
    // Actualizar resumen de la red
    updateNetworkSummary(diagnostics);
    
    console.log('📊 Estado de servidores actualizado:', diagnostics);
    
  } catch (error) {
    console.error('❌ Error actualizando estado de servidores:', error);
    
    // Marcar servidores como desconocidos en caso de error
    updateServerCard('db1-status', { status: 'unknown', message: 'Sin respuesta' });
    updateServerCard('db2-status', { status: 'unknown', message: 'Sin respuesta' });
  }
}

function updateServerCard(elementId, serverData) {
  const statusElement = document.getElementById(elementId);
  if (!statusElement) return;
  
  // Remover clases anteriores
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
  
  // Agregar tooltip con información adicional
  statusElement.title = serverData.message || 'Sin información adicional';
}

function updateNetworkSummary(diagnostics) {
  const generalStatusElement = document.getElementById('general-status');
  if (!generalStatusElement) return;
  
  generalStatusElement.textContent = diagnostics.message || '🟡 FUNCIONANDO';
  
  // Actualizar clase CSS según el estado
  generalStatusElement.className = 'summary-value';
  if (diagnostics.status === 'excellent') {
    generalStatusElement.classList.add('status-excellent');
  } else if (diagnostics.status === 'good') {
    generalStatusElement.classList.add('status-good');
  } else if (diagnostics.status === 'warning') {
    generalStatusElement.classList.add('status-warning');
  } else if (diagnostics.status === 'critical') {
    generalStatusElement.classList.add('status-critical');
  }
}

// ===== FUNCIÓN PARA CARGAR SUMINISTROS =====
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
    
    if (window.soundManager) {
      window.soundManager.playSuccess();
    }
    
  } catch (error) {
    console.error('❌ Error cargando suministros:', error);
    hideLoader();
    showNotification('❌ Error sincronizando inventario galáctico', 'error');
    
    if (window.soundManager) {
      window.soundManager.playError();
    }
  }
}

// ===== FUNCIÓN PARA MOSTRAR SUMINISTROS EN LA TABLA =====
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
        <button class="action-btn edit" onclick="editSupply(${supply.id})">
          <span class="btn-icon">✏️</span>
        </button>
        <button class="action-btn delete" onclick="deleteSupply(${supply.id})">
          <span class="btn-icon">🗑️</span>
        </button>
      </td>
    `;
    
    // Agregar efecto de aparición
    row.style.opacity = '0';
    row.style.transform = 'translateY(20px)';
    tableBody.appendChild(row);
    
    // Animar la aparición
    setTimeout(() => {
      row.style.transition = 'all 0.3s ease';
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    }, supplies.indexOf(supply) * 50);
  });
}

// ===== FUNCIONES AUXILIARES =====
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

// ===== FUNCIONES DE EDICIÓN Y ELIMINACIÓN =====
async function editSupply(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Suministro no encontrado');
    
    const supply = await response.json();
    
    // Rellenar el formulario con los datos actuales
    document.getElementById('name').value = supply.name;
    document.getElementById('type_id').value = supply.type_id;
    document.getElementById('quantity').value = supply.quantity;
    document.getElementById('price').value = supply.price;
    document.getElementById('status_id').value = supply.status_id;
    
    // Cambiar el botón a modo edición
    const addBtn = document.querySelector('.action-btn.primary');
    addBtn.innerHTML = `
      <span class="btn-icon">🔄</span>
      <span class="btn-text">ACTUALIZAR SUMINISTRO</span>
      <div class="btn-glow"></div>
    `;
    addBtn.onclick = () => updateSupply(id);
    
    showNotification('📝 Modo edición activado', 'info');
    
    if (window.soundManager) {
      window.soundManager.playBeep();
    }
    
  } catch (error) {
    console.error('❌ Error cargando suministro para editar:', error);
    showNotification('❌ Error cargando datos para edición', 'error');
    
    if (window.soundManager) {
      window.soundManager.playError();
    }
  }
}

async function updateSupply(id) {
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
    
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
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
    resetAddButton();
    await loadSupplies();
    
    showNotification('🔄 Suministro actualizado exitosamente', 'success');
    
    if (window.soundManager) {
      window.soundManager.playSuccess();
    }
    
  } catch (error) {
    console.error('❌ Error actualizando suministro:', error);
    hideLoader();
    showNotification('❌ Error actualizando suministro', 'error');
    
    if (window.soundManager) {
      window.soundManager.playError();
    }
  }
}

async function deleteSupply(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este suministro de la galaxia?')) {
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
    
    showNotification('🗑️ Suministro eliminado del inventario galáctico', 'success');
    
    if (window.soundManager) {
      window.soundManager.playSuccess();
    }
    
  } catch (error) {
    console.error('❌ Error eliminando suministro:', error);
    hideLoader();
    showNotification('❌ Error eliminando suministro', 'error');
    
    if (window.soundManager) {
      window.soundManager.playError();
    }
  }
}

// ===== FUNCIONES AUXILIARES DEL FORMULARIO =====
function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('type_id').value = '';
  document.getElementById('quantity').value = '';
  document.getElementById('price').value = '';
  document.getElementById('status_id').value = '';
}

function resetAddButton() {
  const addBtn = document.querySelector('.action-btn.primary');
  addBtn.innerHTML = `
    <span class="btn-icon">🚀</span>
    <span class="btn-text">AGREGAR AL INVENTARIO</span>
    <div class="btn-glow"></div>
  `;
  addBtn.onclick = addSupply;
}

// ===== SISTEMA DE MONITOREO AUTOMÁTICO =====
function startServerMonitoring() {
  // Actualizar indicador de servidor actual cada 30 segundos
  setInterval(updateCurrentServerIndicator, 30000);
  
  // Actualizar estado de servidores cada 60 segundos
  setInterval(updateServerStatus, 60000);
}

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🌌 Inicializando Sistema TechStore Galáctico...');
  
  try {
    // Inicializar efectos visuales
    if (document.getElementById('particles-canvas')) {
      window.particleSystem = new ParticleSystem();
    }
    
    // Inicializar sonidos
    if (window.SoundManager) {
      window.soundManager = new SoundManager();
    }
    
    // Cargar datos iniciales
    await loadSupplies();
    
    // Actualizar indicadores de servidor
    await updateCurrentServerIndicator();
    await updateServerStatus();
    
    // Iniciar monitoreo automático
    startServerMonitoring();
    
    // Ocultar loader inicial
    setTimeout(() => {
      const loader = document.getElementById('galactic-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }
    }, 2000);
    
    // Inicializar animaciones de tarjetas
    animateCards();
    
    console.log('✅ Sistema TechStore Galáctico inicializado correctamente');
    showNotification('🌌 Sistema TechStore Galáctico online', 'success');
    
  } catch (error) {
    console.error('❌ Error inicializando sistema:', error);
    showNotification('❌ Error inicializando sistema galáctico', 'error');
  }
});
