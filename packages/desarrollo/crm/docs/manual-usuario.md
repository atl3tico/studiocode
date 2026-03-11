# Manual de Usuario — Panel Web Negocio

> Versión: 1.0 | Stack: SvelteKit 5 + Supabase + Resend

---

## 1. Acceso al Panel Admin

### URL
```
https://tudominio.com/admin
```

### Credenciales
- Introduce la contraseña de administrador (proporcionada por el equipo técnico).
- La sesión dura **8 horas**. Pasado ese tiempo deberás volver a iniciar sesión.

### Cerrar sesión
- En el panel admin, usa el enlace **"Cerrar sesión"** en la esquina superior derecha.

---

## 2. Gestión de Leads

### ¿Qué es un lead?
Un lead es un contacto que ha rellenado el formulario de tu web (nombre, email, teléfono y mensaje). Cada lead tiene un **estado** que refleja en qué punto está del proceso de venta.

### Acceder a la lista de leads
1. Inicia sesión en `/admin`.
2. Haz clic en **"Leads"** en el menú lateral.
3. Verás la tabla con todos los leads ordenados del más reciente al más antiguo.

### Estados de un lead
| Estado      | Significado                              |
|-------------|------------------------------------------|
| `new`       | Recién llegado, sin gestionar            |
| `contacted` | Ya le has llamado / escrito              |
| `qualified` | Tiene intención real de compra           |
| `lost`      | No interesado o sin respuesta            |
| `won`       | Cliente cerrado                          |

### Cambiar el estado de un lead
1. En la tabla de leads, localiza el lead.
2. Haz clic en el selector de estado de la fila.
3. Elige el nuevo estado. El cambio se guarda automáticamente.

### Filtrar leads
- Usa el desplegable **"Estado"** sobre la tabla para filtrar por estado.
- Usa el campo de búsqueda para filtrar por nombre o email.

### Exportar leads a CSV
1. En la página de leads, haz clic en el botón **"Exportar CSV"**.
2. Se descargará un fichero `leads.csv` con todos los campos visibles.

---

## 3. Gestión de Citas

### ¿Qué es una cita?
Una cita es una reserva de tiempo realizada por un cliente desde el formulario de reserva de tu web. Al confirmarse, el cliente y el negocio reciben un email con el archivo **.ics** para añadirlo al calendario.

### Acceder al calendario de citas
1. En el panel admin, haz clic en **"Citas"**.
2. Verás las citas ordenadas por fecha (próximas primero).

### Estados de una cita
| Estado      | Significado                         |
|-------------|-------------------------------------|
| `pending`   | Reservada, pendiente de confirmar   |
| `confirmed` | Confirmada                          |
| `cancelled` | Cancelada                           |

### Confirmar una cita
1. Localiza la cita en la tabla.
2. Haz clic en **"Confirmar"**. El estado cambia a `confirmed`.

### Cancelar una cita
1. Localiza la cita.
2. Haz clic en **"Cancelar"**. El estado cambia a `cancelled`.
3. Se recomienda avisar al cliente por email o teléfono.

---

## 4. Variables de Entorno (Configuración)

El equipo técnico configura estas variables en el panel de hosting (Vercel / Fly.io). **No las compartas nunca.**

| Variable                | Descripción                                          |
|-------------------------|------------------------------------------------------|
| `PUBLIC_SUPABASE_URL`   | URL de tu proyecto Supabase                          |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio Supabase (nunca en cliente)    |
| `RESEND_API_KEY`        | API Key de Resend para envío de emails               |
| `RESEND_FROM`           | Email remitente (ej. `noreply@tudominio.com`)         |
| `ADMIN_PASSWORD`        | Contraseña del panel admin                           |
| `ADMIN_SECRET`          | Secreto para firmar sesiones (mínimo 32 caracteres)  |

---

## 5. Preguntas frecuentes

**¿Qué pasa si olvido mi contraseña de admin?**
Contacta con tu proveedor técnico para que actualice la variable `ADMIN_PASSWORD` en el hosting y redespliegue.

**¿Los leads llegan por email?**
Sí. Cuando alguien rellena el formulario recibes un email de notificación en la dirección configurada en `RESEND_FROM`.

**¿Puedo añadir más usuarios admin?**
En esta versión sólo hay un usuario administrador. Para múltiples usuarios, solicita la migración a Lucia Auth o Supabase Auth.

**¿Los datos están seguros?**
Sí. Todos los datos se almacenan en Supabase (PostgreSQL cifrado en reposo). El panel admin usa cookies `httpOnly` y `secure` para proteger la sesión.

**¿Qué hago si un lead aparece duplicado?**
El sistema comprueba emails duplicados en el momento del envío. Si aun así aparece un duplicado, cámbia el estado del más antiguo a `lost` para ignorarlo.
