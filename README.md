# 🌐 Proyecto SIS313 - Infraestructura Web Completa

## 📋 Descripción General del Proyecto

**SIS313** es un proyecto de infraestructura web completa que implementa un sistema distribuido con alta disponibilidad, balanceo de carga, replicación de base de datos y servicios DNS. El proyecto incluye aplicaciones Node.js CRUD con frontend web, todo desplegado en una arquitectura de red 192.168.1.xxx.

![Versión](https://img.shields.io/badge/versión-3.0.0-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange?style=for-the-badge)
![NGINX](https://img.shields.io/badge/NGINX-1.22+-red?style=for-the-badge)

---

## 🏗️ Arquitectura del Sistema

### 🌟 Componentes Principales

| Servidor | IP | Función | Servicios | Puerto |
|----------|----|---------|---------|---------| 
| **DNS Primario** | 192.168.1.10 | Servidor DNS maestro | BIND9 | 53 |
| **DNS Secundario** | 192.168.1.11 | Servidor DNS esclavo | BIND9 (slave) | 53 |
| **App Server 1** | 192.168.1.101 | Aplicación Node.js | Express + vsftpd | 3000, 21 |
| **App Server 2** | 192.168.1.102 | Aplicación Node.js | Express + vsftpd | 3000, 21 |
| **DB1 (Maestro)** | 192.168.1.201 | Base de datos principal | MySQL (Master) | 3306 |
| **DB2 (Esclavo)** | 192.168.1.202 | Base de datos replicada | MySQL (Slave) | 3306 |
| **Balanceador** | 192.168.1.252 | Load Balancer | NGINX + TLS | 80, 443 |

### 🔄 Flujo de Datos
```
Cliente → DNS (web.sis313.usfx.bo) → Balanceador NGINX → App1/App2 → DB1 (replica a DB2)
```

### 🌌 Diagrama de Arquitectura
```
                    🌐 Internet
                         |
                    📡 DNS Round Robin
                   /                 \
            🌍 DNS1 (192.168.1.10)   🌎 DNS2 (192.168.1.11)
                         |
                    🚪 Load Balancer
                  (NGINX - 192.168.1.252)
                         |
        ┌────────────────┼────────────────┐
        |                |                |
   🖥️ App1           🖥️ App2          🔄 Failover
 (192.168.1.101)   (192.168.1.102)      Ready
   Express:3000     Express:3000
   vsftpd:21        vsftpd:21
        |                |                
        └────────────────┼────────────────┘
                         |
                🗄️ Database Cluster
               /                    \
        🗄️ DB Master            🗄️ DB Slave
      (192.168.1.201)        (192.168.1.202)
       MySQL:3306             MySQL:3306
```

---

## 🚀 Stack Tecnológico

### Backend
- **Node.js 18+** + Express.js 4.18+
- **MySQL 8.0+** con replicación maestro-esclavo
- **NGINX 1.22+** como proxy reverso y balanceador

### Frontend
- **HTML5** + CSS3 + JavaScript ES6+
- **Interfaz CRUD** responsiva y moderna
- **Bootstrap 5** para diseño responsivo

### Infraestructura
- **BIND9** para resolución DNS
- **vsftpd** para transferencia de archivos FTP
- **RAID1** con mdadm para redundancia de discos
- **TLS/SSL** para comunicación segura

### DevOps & Monitoreo
- **UFW** para configuración de firewall
- **Systemd** para gestión de servicios
- **OpenSSL** para generación de certificados
- **PM2** para gestión de procesos Node.js
- **Log rotation** con logrotate

---

## 📁 Estructura del Proyecto

```
ProyectoFinal_SIS313/
├── Aplicacion-Codigo/                    # Código de la aplicación web
│   ├── app.js                           # Servidor Express principal
│   ├── app_clean.js                     # Versión limpia del servidor
│   ├── index.html                       # Frontend principal
│   ├── package.json                     # Dependencias Node.js
│   ├── README.md                        # Documentación de la app
│   └── public/                          # Archivos estáticos
│       ├── script.js                    # JavaScript frontend
│       ├── script_simple.js             # Versión simplificada
│       └── style.css                    # Estilos CSS
├── Archivos de configuracion de los servicios/
│   ├── aplicacion1/                     # Config App Server 1
│   │   ├── .env                         # Variables de entorno
│   │   ├── ecosystem.config.js          # Configuración PM2
│   │   ├── nginx.conf                   # Proxy reverso local
│   │   └── vsftpd.conf                  # Configuración FTP
│   ├── aplicacion2/                     # Config App Server 2
│   │   ├── .env                         # Variables de entorno
│   │   ├── ecosystem.config.js          # Configuración PM2
│   │   ├── nginx.conf                   # Proxy reverso local
│   │   └── vsftpd.conf                  # Configuración FTP
│   ├── balanceador/                     # Configuración Load Balancer
│   │   ├── nginx.conf                   # Configuración principal NGINX
│   │   ├── ssl.conf                     # Configuración TLS/SSL
│   │   ├── upstream.conf                # Configuración upstream
│   │   └── certificates/                # Certificados SSL
│   ├── basedatos1/                      # MySQL Master
│   │   ├── my.cnf                       # Configuración MySQL maestro
│   │   ├── init.sql                     # Script inicialización DB
│   │   ├── backup.sh                    # Script de respaldo
│   │   └── users.sql                    # Usuarios y permisos
│   ├── basedatos2/                      # MySQL Slave
│   │   ├── my.cnf                       # Configuración MySQL esclavo
│   │   ├── replication.sql              # Setup replicación
│   │   └── monitoring.sh                # Monitoreo replicación
│   ├── dns1/                           # DNS Primario
│   │   ├── named.conf                   # Configuración BIND9
│   │   ├── named.conf.local             # Zonas locales
│   │   ├── db.sis313.usfx.bo           # Zona directa
│   │   ├── db.192.168.1                # Zona inversa
│   │   └── dns-check.sh                 # Script verificación DNS
│   └── dns2/                           # DNS Secundario
│       ├── named.conf                   # Configuración BIND9 slave
│       ├── named.conf.local             # Zonas replicadas
│       └── sync-check.sh                # Verificación sincronización
├── Codigo fuente nodejs/               # Código fuente adicional
│   ├── models/                         # Modelos de datos
│   ├── routes/                         # Rutas de la API
│   ├── controllers/                    # Controladores
│   └── middleware/                     # Middleware personalizado
├── scripts de automatizacion/          # Scripts de automatización
│   ├── setup-infrastructure.sh         # Setup completo
│   ├── deploy-applications.sh          # Despliegue aplicaciones
│   ├── configure-dns.sh               # Configuración DNS
│   ├── setup-mysql-replication.sh     # Setup replicación MySQL
│   ├── configure-nginx.sh             # Configuración NGINX
│   ├── setup-raid.sh                  # Configuración RAID1
│   ├── monitoring.sh                  # Script monitoreo sistema
│   ├── backup-full.sh                 # Backup completo
│   └── restore-system.sh              # Restauración sistema
└── README.md                          # Esta documentación
```

---

## ⚙️ Configuración Detallada de Componentes

### 🌐 1. Configuración DNS (BIND9)

#### DNS Primario (192.168.1.10)
```bash
# Instalación BIND9
sudo apt update && sudo apt install bind9 bind9utils bind9-doc dnsutils -y

# Configuración principal (/etc/bind/named.conf.options)
options {
    directory "/var/cache/bind";
    recursion yes;
    listen-on { 192.168.1.10; 127.0.0.1; };
    allow-transfer { 192.168.1.11; };
    also-notify { 192.168.1.11; };
    forwarders { 8.8.8.8; 8.8.4.4; };
    dnssec-validation auto;
    auth-nxdomain no;
};
```

#### Configuración de Zonas (/etc/bind/named.conf.local)
```bash
zone "sis313.usfx.bo" {
    type master;
    file "/etc/bind/db.sis313.usfx.bo";
    allow-update { none; };
    allow-transfer { 192.168.1.11; };
    also-notify { 192.168.1.11; };
};

zone "1.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.1";
    allow-update { none; };
    allow-transfer { 192.168.1.11; };
};
```

#### Zona Directa (/etc/bind/db.sis313.usfx.bo)
```dns
$TTL    604800
@       IN      SOA     ns1.sis313.usfx.bo. admin.sis313.usfx.bo. (
                        2024062401      ; Serial
                        604800          ; Refresh
                        86400           ; Retry
                        2419200         ; Expire
                        604800 )        ; Negative Cache TTL

; Name servers
@       IN      NS      ns1.sis313.usfx.bo.
@       IN      NS      ns2.sis313.usfx.bo.

; A records
ns1     IN      A       192.168.1.10
ns2     IN      A       192.168.1.11
web     IN      A       192.168.1.252
balanceador IN  A       192.168.1.252
app1    IN      A       192.168.1.101
app2    IN      A       192.168.1.102
db1     IN      A       192.168.1.201
db2     IN      A       192.168.1.202

; CNAME records
www     IN      CNAME   web
api     IN      CNAME   web
admin   IN      CNAME   web
```

#### Zona Inversa (/etc/bind/db.192.168.1)
```dns
$TTL    604800
@       IN      SOA     ns1.sis313.usfx.bo. admin.sis313.usfx.bo. (
                        2024062401      ; Serial
                        604800          ; Refresh
                        86400           ; Retry
                        2419200         ; Expire
                        604800 )        ; Negative Cache TTL

; Name servers
@       IN      NS      ns1.sis313.usfx.bo.
@       IN      NS      ns2.sis313.usfx.bo.

; PTR records
10      IN      PTR     ns1.sis313.usfx.bo.
11      IN      PTR     ns2.sis313.usfx.bo.
101     IN      PTR     app1.sis313.usfx.bo.
102     IN      PTR     app2.sis313.usfx.bo.
201     IN      PTR     db1.sis313.usfx.bo.
202     IN      PTR     db2.sis313.usfx.bo.
252     IN      PTR     web.sis313.usfx.bo.
```

#### DNS Secundario (192.168.1.11)
```bash
# Configuración como esclavo (/etc/bind/named.conf.local)
zone "sis313.usfx.bo" {
    type slave;
    masters { 192.168.1.10; };
    file "/var/cache/bind/db.sis313.usfx.bo";
};

zone "1.168.192.in-addr.arpa" {
    type slave;
    masters { 192.168.1.10; };
    file "/var/cache/bind/db.192.168.1";
};
```

---

### ⚖️ 2. Balanceador de Carga (NGINX)

#### Configuración Principal (/etc/nginx/nginx.conf)
```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time ut="$upstream_response_time"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss application/json;
    
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

#### Configuración Upstream (/etc/nginx/conf.d/upstream.conf)
```nginx
# Upstream para aplicaciones Node.js
upstream app_servers {
    least_conn;  # Algoritmo de balanceo
    server 192.168.1.101:3000 max_fails=3 fail_timeout=30s weight=1;
    server 192.168.1.102:3000 max_fails=3 fail_timeout=30s weight=1;
    
    # Health check endpoint
    keepalive 32;
}

# Upstream para FTP (si se necesita balanceo)
upstream ftp_servers {
    server 192.168.1.101:21;
    server 192.168.1.102:21 backup;
}
```

#### Configuración Virtual Host (/etc/nginx/sites-available/sis313)
```nginx
# Redirección HTTP -> HTTPS
server {
    listen 80;
    server_name web.sis313.usfx.bo www.sis313.usfx.bo;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
}

# Configuración HTTPS principal
server {
    listen 443 ssl http2;
    server_name web.sis313.usfx.bo www.sis313.usfx.bo;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/sis313.crt;
    ssl_certificate_key /etc/ssl/private/sis313.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Root and index
    root /var/www/html;
    index index.html index.htm;
    
    # Main location block
    location / {
        proxy_pass http://app_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://app_servers/health;
        access_log off;
    }
    
    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri @backend;
    }
    
    location @backend {
        proxy_pass http://app_servers;
    }
    
    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /var/www/html;
    }
}
```

#### Generación de Certificados SSL
```bash
#!/bin/bash
# Generar certificado auto-firmado para desarrollo
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/sis313.key \
  -out /etc/ssl/certs/sis313.crt \
  -subj "/C=BO/ST=Chuquisaca/L=Sucre/O=USFX/OU=SIS313/CN=web.sis313.usfx.bo"

# Configurar permisos
sudo chmod 600 /etc/ssl/private/sis313.key
sudo chmod 644 /etc/ssl/certs/sis313.crt

# Verificar certificado
sudo openssl x509 -in /etc/ssl/certs/sis313.crt -text -noout
```

---

### 🗄️ 3. Base de Datos MySQL (Replicación Maestro-Esclavo)

#### Servidor Maestro (192.168.1.201)

##### Configuración MySQL (/etc/mysql/mysql.conf.d/mysqld.cnf)
```ini
[mysqld]
# Configuración básica
user = mysql
bind-address = 0.0.0.0
port = 3306
datadir = /var/lib/mysql
socket = /var/run/mysqld/mysqld.sock

# Configuración de replicación - MASTER
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_format = ROW
binlog_do_db = appdb
binlog_do_db = techstore_galactico
expire_logs_days = 7
max_binlog_size = 100M

# Configuración de rendimiento
innodb_buffer_pool_size = 512M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 1
sync_binlog = 1

# Configuración de red
max_connections = 200
connect_timeout = 10
wait_timeout = 600
max_allowed_packet = 64M

# Logging
general_log = ON
general_log_file = /var/log/mysql/general.log
slow_query_log = ON
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

##### Script de Inicialización (/opt/mysql/init-master.sql)
```sql
-- Crear base de datos principal
CREATE DATABASE IF NOT EXISTS appdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS techstore_galactico CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar base de datos principal
USE appdb;

-- Crear tabla de items
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) DEFAULT 0.00,
    cantidad INT DEFAULT 0,
    categoria VARCHAR(100),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    INDEX idx_estado (estado)
);

-- Insertar datos de ejemplo
INSERT INTO items (nombre, descripcion, precio, cantidad, categoria) VALUES
('Lápiz HB', 'Lápiz para escritura estándar', 1.50, 100, 'Escritura'),
('Cuaderno A4', 'Cuaderno universitario 100 hojas', 12.00, 50, 'Papelería'),
('Calculadora Científica', 'Calculadora para matemáticas avanzadas', 45.00, 25, 'Electrónicos'),
('Marcadores', 'Set de marcadores de colores', 18.50, 75, 'Arte'),
('Regla 30cm', 'Regla plástica transparente', 3.25, 200, 'Medición');

-- Crear usuario para aplicación
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'clavefuerte123';
GRANT SELECT, INSERT, UPDATE, DELETE ON appdb.* TO 'appuser'@'%';

-- Crear usuario para replicación
CREATE USER IF NOT EXISTS 'replica'@'%' IDENTIFIED WITH mysql_native_password BY 'replicapass123';
GRANT REPLICATION SLAVE ON *.* TO 'replica'@'%';

-- Crear usuario para monitoreo
CREATE USER IF NOT EXISTS 'monitor'@'%' IDENTIFIED BY 'monitorpass123';
GRANT PROCESS, REPLICATION CLIENT ON *.* TO 'monitor'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Mostrar estado del master para configurar slave
FLUSH TABLES WITH READ LOCK;
SHOW MASTER STATUS;
UNLOCK TABLES;
```

#### Servidor Esclavo (192.168.1.202)

##### Configuración MySQL (/etc/mysql/mysql.conf.d/mysqld.cnf)
```ini
[mysqld]
# Configuración básica
user = mysql
bind-address = 0.0.0.0
port = 3306
datadir = /var/lib/mysql
socket = /var/run/mysqld/mysqld.sock

# Configuración de replicación - SLAVE
server-id = 2
relay-log = /var/log/mysql/relay-bin
relay-log-index = /var/log/mysql/relay-bin.index
read_only = 1
super_read_only = 1

# Configuración específica de slave
replicate-do-db = appdb
replicate-do-db = techstore_galactico
slave-skip-errors = 1062,1053,1146
relay_log_recovery = 1

# Configuración de rendimiento
innodb_buffer_pool_size = 512M
innodb_log_file_size = 64M

# Configuración de red
max_connections = 200
connect_timeout = 10
wait_timeout = 600
max_allowed_packet = 64M

# Logging
general_log = ON
general_log_file = /var/log/mysql/general.log
slow_query_log = ON
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

##### Script de Configuración Slave (/opt/mysql/setup-slave.sql)
```sql
-- Detener slave si está corriendo
STOP SLAVE;

-- Resetear configuración de slave
RESET SLAVE ALL;

-- Configurar conexión al master
CHANGE MASTER TO
    MASTER_HOST='192.168.1.201',
    MASTER_USER='replica',
    MASTER_PASSWORD='replicapass123',
    MASTER_LOG_FILE='mysql-bin.000001',
    MASTER_LOG_POS=0,
    MASTER_CONNECT_RETRY=10,
    MASTER_RETRY_COUNT=3;

-- Iniciar slave
START SLAVE;

-- Verificar estado
SHOW SLAVE STATUS\G

-- Crear usuario solo lectura para aplicaciones
CREATE USER IF NOT EXISTS 'readonly'@'%' IDENTIFIED BY 'readonlypass123';
GRANT SELECT ON appdb.* TO 'readonly'@'%';
GRANT SELECT ON techstore_galactico.* TO 'readonly'@'%';

FLUSH PRIVILEGES;
```

---

### 💾 4. Configuración RAID1 para Redundancia

#### Script de Configuración RAID (/opt/scripts/setup-raid.sh)
```bash
#!/bin/bash
# Script para configurar RAID1 en servidores de base de datos

echo "🔧 Configurando RAID1 para redundancia de datos..."

# Verificar discos disponibles
echo "Discos disponibles:"
lsblk | grep disk

# Instalar mdadm
sudo apt update
sudo apt install mdadm -y

# Crear arreglo RAID1 (asumiendo /dev/sdb y /dev/sdc)
echo "Creando arreglo RAID1..."
sudo mdadm --create --verbose /dev/md0 \
    --level=1 \
    --raid-devices=2 \
    /dev/sdb /dev/sdc

# Verificar progreso de sincronización
echo "Verificando progreso de sincronización:"
cat /proc/mdstat

# Formatear el arreglo
echo "Formateando RAID1 con ext4..."
sudo mkfs.ext4 /dev/md0

# Crear punto de montaje
sudo mkdir -p /mnt/raid1
sudo mkdir -p /mnt/raid1/mysql
sudo mkdir -p /mnt/raid1/backups

# Montar el arreglo
sudo mount /dev/md0 /mnt/raid1

# Configurar montaje automático
echo '/dev/md0 /mnt/raid1 ext4 defaults,nofail,discard 0 0' | sudo tee -a /etc/fstab

# Guardar configuración RAID
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf

# Configurar permisos
sudo chown -R mysql:mysql /mnt/raid1/mysql
sudo chmod 755 /mnt/raid1

# Verificar configuración
echo "Estado final del RAID:"
sudo mdadm --detail /dev/md0

echo "✅ RAID1 configurado exitosamente"
```

#### Script de Monitoreo RAID (/opt/scripts/monitor-raid.sh)
```bash
#!/bin/bash
# Script de monitoreo del estado de RAID

check_raid_status() {
    local status=$(cat /proc/mdstat | grep "md0" | awk '{print $3}')
    local failed=$(sudo mdadm --detail /dev/md0 | grep "Failed Devices" | awk '{print $4}')
    
    if [ "$failed" != "0" ]; then
        echo "🚨 ALERTA: RAID1 degradado - $failed dispositivo(s) fallido(s)"
        logger "RAID1 ALERT: $failed failed devices detected"
        
        # Enviar notificación (puede integrar con email/slack)
        echo "RAID degradado en $(hostname) - $(date)" >> /var/log/raid-alerts.log
        
        return 1
    else
        echo "✅ RAID1 estado: Saludable - $status"
        return 0
    fi
}

# Verificar estado
check_raid_status

# Mostrar detalles si hay problemas
if [ $? -ne 0 ]; then
    echo "Detalles del RAID:"
    sudo mdadm --detail /dev/md0
    echo ""
    echo "Estado de discos:"
    lsblk | grep -E "(sdb|sdc|md0)"
fi
```

---

### 🚀 5. Aplicaciones Node.js

#### Dependencias del Proyecto (package.json)
```json
{
  "name": "techstore-galactico",
  "version": "3.0.0",
  "description": "Sistema de gestión de útiles escolares con arquitectura distribuida",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop all",
    "pm2:restart": "pm2 restart all",
    "pm2:logs": "pm2 logs"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.5.0"
  },
  "keywords": ["nodejs", "mysql", "crud", "express", "sis313"],
  "author": "César - SIS313 USFX",
  "license": "MIT"
}
```

#### Servidor Express Principal (app.js)
```javascript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const INSTANCE_ID = process.env.INSTANCE_ID || 'app-unknown';

// Middleware de seguridad
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: ['https://web.sis313.usfx.bo', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de conexión a base de datos
const dbConfig = {
  host: process.env.DB_HOST || '192.168.1.201',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'clavefuerte123',
  database: process.env.DB_NAME || 'appdb',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  ssl: false
};

// Pool de conexiones para escritura (master)
const masterDB = mysql.createPool(dbConfig);

// Pool de conexiones para lectura (slave)
const slaveConfig = {
  ...dbConfig,
  host: process.env.DB_SLAVE_HOST || '192.168.1.202',
  user: 'readonly',
  password: 'readonlypass123'
};
const slaveDB = mysql.createPool(slaveConfig);

// Función para seleccionar base de datos según operación
function getDBConnection(operation) {
  const readOperations = ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN'];
  const isReadOperation = readOperations.some(op => 
    operation.toUpperCase().startsWith(op)
  );
  return isReadOperation ? slaveDB : masterDB;
}

// Middleware para verificar conexión a BD
const checkDBConnection = async (req, res, next) => {
  try {
    await masterDB.promise().query('SELECT 1');
    next();
  } catch (error) {
    console.error('Error de conexión a BD:', error);
    res.status(503).json({ 
      error: 'Servicio de base de datos no disponible',
      instance: INSTANCE_ID 
    });
  }
};

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const [masterResult] = await masterDB.promise().query('SELECT 1 as status');
    const [slaveResult] = await slaveDB.promise().query('SELECT 1 as status');
    
    res.json({
      status: 'healthy',
      instance: INSTANCE_ID,
      timestamp: new Date().toISOString(),
      database: {
        master: masterResult[0].status === 1 ? 'connected' : 'disconnected',
        slave: slaveResult[0].status === 1 ? 'connected' : 'disconnected'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '3.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      instance: INSTANCE_ID,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes

// GET - Obtener todos los items
app.get('/api/items', async (req, res) => {
  try {
    const db = getDBConnection('SELECT');
    const [rows] = await db.promise().query(
      'SELECT * FROM items WHERE estado = ? ORDER BY fecha_creacion DESC',
      ['activo']
    );
    
    res.json({
      success: true,
      data: rows,
      count: rows.length,
      instance: INSTANCE_ID
    });
  } catch (error) {
    console.error('Error al obtener items:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      instance: INSTANCE_ID 
    });
  }
});

// GET - Obtener item por ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDBConnection('SELECT');
    const [rows] = await db.promise().query(
      'SELECT * FROM items WHERE id = ? AND estado = ?',
      [id, 'activo']
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item no encontrado',
        instance: INSTANCE_ID 
      });
    }
    
    res.json({
      success: true,
      data: rows[0],
      instance: INSTANCE_ID
    });
  } catch (error) {
    console.error('Error al obtener item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      instance: INSTANCE_ID 
    });
  }
});

// POST - Crear nuevo item
app.post('/api/items', checkDBConnection, async (req, res) => {
  try {
    const { nombre, descripcion, precio, cantidad, categoria } = req.body;
    
    // Validaciones
    if (!nombre || nombre.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'El nombre es requerido',
        instance: INSTANCE_ID 
      });
    }
    
    const db = getDBConnection('INSERT');
    const [result] = await db.promise().query(
      'INSERT INTO items (nombre, descripcion, precio, cantidad, categoria) VALUES (?, ?, ?, ?, ?)',
      [nombre.trim(), descripcion || '', precio || 0, cantidad || 0, categoria || 'General']
    );
    
    res.status(201).json({
      success: true,
      message: 'Item creado exitosamente',
      data: {
        id: result.insertId,
        nombre,
        descripcion,
        precio,
        cantidad,
        categoria
      },
      instance: INSTANCE_ID
    });
  } catch (error) {
    console.error('Error al crear item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      instance: INSTANCE_ID 
    });
  }
});

// PUT - Actualizar item
app.put('/api/items/:id', checkDBConnection, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, cantidad, categoria } = req.body;
    
    // Validaciones
    if (!nombre || nombre.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'El nombre es requerido',
        instance: INSTANCE_ID 
      });
    }
    
    const db = getDBConnection('UPDATE');
    const [result] = await db.promise().query(
      'UPDATE items SET nombre = ?, descripcion = ?, precio = ?, cantidad = ?, categoria = ? WHERE id = ? AND estado = ?',
      [nombre.trim(), descripcion || '', precio || 0, cantidad || 0, categoria || 'General', id, 'activo']
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item no encontrado',
        instance: INSTANCE_ID 
      });
    }
    
    res.json({
      success: true,
      message: 'Item actualizado exitosamente',
      instance: INSTANCE_ID
    });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      instance: INSTANCE_ID 
    });
  }
});

// DELETE - Eliminar item (soft delete)
app.delete('/api/items/:id', checkDBConnection, async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = getDBConnection('UPDATE');
    const [result] = await db.promise().query(
      'UPDATE items SET estado = ? WHERE id = ? AND estado = ?',
      ['inactivo', id, 'activo']
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item no encontrado',
        instance: INSTANCE_ID 
      });
    }
    
    res.json({
      success: true,
      message: 'Item eliminado exitosamente',
      instance: INSTANCE_ID
    });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor',
      instance: INSTANCE_ID 
    });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware de manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Ruta no encontrada',
    instance: INSTANCE_ID 
  });
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Error interno del servidor',
    instance: INSTANCE_ID 
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  masterDB.end();
  slaveDB.end();
  process.exit(0);
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ${INSTANCE_ID} corriendo en puerto ${PORT}`);
  console.log(`🌐 Acceso: http://0.0.0.0:${PORT}`);
  console.log(`💾 BD Master: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`📖 BD Slave: ${slaveConfig.host}:${slaveConfig.port}`);
});

module.exports = app;

---

## 📊 Resumen de Configuración

### 🌐 IPs y Servicios Actualizados

| Servidor | IP | Servicios | Puertos |
|----------|----|-----------|---------| 
| DNS1 | 192.168.1.10 | BIND9 Master | 53 |
| DNS2 | 192.168.1.11 | BIND9 Slave | 53 |
| APP1 | 192.168.1.101 | Node.js + FTP | 3000, 21 |
| APP2 | 192.168.1.102 | Node.js + FTP | 3000, 21 |
| DB1 | 192.168.1.201 | MySQL Master + RAID1 | 3306 |
| DB2 | 192.168.1.202 | MySQL Slave + RAID1 | 3306 |
| LB | 192.168.1.252 | NGINX + SSL | 80, 443 |

### 🔧 Scripts de Automatización Principales

```bash
# Despliegue completo
/opt/scripts/deploy-full.sh

# Verificación del sistema  
/opt/scripts/monitor-system.sh

# Configuración de red
/opt/scripts/setup-network.sh

# Backup completo
/opt/scripts/backup-full.sh
```

### 📁 Estructura de Configuración

```
Archivos de configuracion de los servicios/
├── dns1/ - DNS Master (192.168.1.10)
├── dns2/ - DNS Slave (192.168.1.11)  
├── aplicacion1/ - App Server 1 (192.168.1.101)
├── aplicacion2/ - App Server 2 (192.168.1.102)
├── basedatos1/ - MySQL Master (192.168.1.201)
├── basedatos2/ - MySQL Slave (192.168.1.202)
└── balanceador/ - NGINX LB (192.168.1.252)
```

---

## 🚀 Guía de Despliegue Rápido

### 1. Configuración Inicial
```bash
# En todos los servidores
sudo apt update && sudo apt upgrade -y
sudo apt install git curl wget vim -y

# Configurar IPs estáticas según tabla
sudo nano /etc/netplan/01-netcfg.yaml
sudo netplan apply
```

### 2. DNS Servers
```bash
# DNS1 (192.168.1.10) - Master
sudo apt install bind9 -y
# Configurar zonas master

# DNS2 (192.168.1.11) - Slave  
sudo apt install bind9 -y
# Configurar replicación desde DNS1
```

### 3. Database Servers
```bash
# DB1 (192.168.1.201) - Master
sudo apt install mysql-server mdadm -y
# Configurar RAID1 + MySQL Master

# DB2 (192.168.1.202) - Slave
sudo apt install mysql-server mdadm -y  
# Configurar RAID1 + MySQL Slave
```

### 4. Application Servers
```bash
# APP1 (192.168.1.101) y APP2 (192.168.1.102)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs vsftpd -y
npm install -g pm2

# Desplegar aplicación
git clone <repo> /opt/techstore
cd /opt/techstore && npm install
pm2 start ecosystem.config.js
```

### 5. Load Balancer
```bash
# LB (192.168.1.252)
sudo apt install nginx -y
# Configurar upstream y SSL
sudo systemctl enable nginx
```

---

## 📋 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/items` | Lista todos los items |
| POST | `/api/items` | Crea nuevo item |
| PUT | `/api/items/:id` | Actualiza item |
| DELETE | `/api/items/:id` | Elimina item |
| GET | `/health` | Estado del servidor |

---

## 🛠️ Troubleshooting

### DNS Issues
```bash
# Verificar configuración
sudo named-checkconf
nslookup web.sis313.usfx.bo 192.168.1.10
```

### MySQL Replication
```bash
# Verificar estado slave
mysql -e "SHOW SLAVE STATUS\G"
```

### NGINX Load Balancer
```bash
# Test configuración
sudo nginx -t
curl -I https://web.sis313.usfx.bo
```

### RAID Status
```bash
# Verificar estado
cat /proc/mdstat
sudo mdadm --detail /dev/md0
```

---

## 👥 Información del Proyecto

**Universidad**: USFX - Ingeniería de Sistemas  
**Materia**: SIS313 - Sistemas de Información  
**Estudiante**: César  
**Gestión**: 2024-II  
**Fecha**: Junio 2025

### 🎯 Objetivos Cumplidos
✅ Infraestructura distribuida con IPs 192.168.1.x  
✅ DNS Master-Slave con redundancia  
✅ MySQL Master-Slave con replicación  
✅ Aplicaciones Node.js con balanceo de carga  
✅ RAID1 para redundancia de datos  
✅ SSL/TLS y seguridad implementada  
✅ Scripts de automatización completos  
✅ Monitoreo y troubleshooting  

---

**🌟 Proyecto SIS313 - Infraestructura Web Completa**  
*Desarrollado para USFX con 💙 por César*

**Última actualización**: 24 de Junio, 2025
