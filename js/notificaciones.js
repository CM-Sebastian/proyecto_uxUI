/* ==========================================================
   LÓGICA DEL PANEL DE NOTIFICACIONES
   ========================================================== */

// Datos de prueba
const notificacionesData = [
  {
    id: 1,
    icon: "fa-solid fa-tag",
    titulo: "¡Nuevo convenio disponible!",
    texto: "Obtén un 20% de descuento en suscripciones con Tu Universidad.",
    tiempo: "Hace 5 minutos",
    leido: false
  },
  {
    id: 2,
    icon: "fa-solid fa-credit-card",
    titulo: "Pago procesado con éxito",
    texto: "Tu suscripción mensual se renueva el 5 del próximo mes.",
    tiempo: "Hace 2 horas",
    leido: false
  },
  {
    id: 3,
    icon: "fa-solid fa-percent",
    titulo: "Ahorro acumulado subió",
    texto: "¡Has ahorrado $15.50 esta semana gracias a tus beneficios!",
    tiempo: "Ayer",
    leido: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const btnNotificaciones = document.querySelectorAll('#menu-Notificaciones, .menu-notificaciones-mobile');
  const header = document.querySelector('header');

  if (!btnNotificaciones.length || !header) return;

  // 1. Crear el HTML del panel flotante de forma dinámica
  const panel = document.createElement('div');
  panel.className = 'notifications-panel';
  panel.id = 'notificationsPanel';

  panel.innerHTML = `
    <div class="notifications-header">
      <h3>Notificaciones</h3>
      <button class="mark-all-read" id="btnMarkAllRead">Marcar leídas</button>
    </div>
    <ul class="notifications-list" id="notificationsList">
      ${renderNotificacionesItems()}
    </ul>
    <div class="notifications-footer">
      <a href="#">Ver todas las notificaciones</a>
    </div>
  `;

  // Insertar dentro de header para el posicionamiento top: 100%
  header.appendChild(panel);

  // 2. Alternar visibilidad al hacer clic en el botón del nav
  btnNotificaciones.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('show');
      btn.classList.toggle('active');

      document.querySelectorAll('#menu-Notificaciones, .menu-notificaciones-mobile').forEach((otherBtn) => {
        if (otherBtn !== btn) otherBtn.classList.remove('active');
      });
    });
  });

  // Evitar que al dar clic dentro del panel se cierre
  panel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Cerrar al dar clic fuera del menú/panel
  document.addEventListener('click', () => {
    panel.classList.remove('show');
    document.querySelectorAll('#menu-Notificaciones, .menu-notificaciones-mobile').forEach((btn) => btn.classList.remove('active'));
  });

  // Evento para marcar todas como leídas
  const btnMarkAllRead = panel.querySelector('#btnMarkAllRead');
  if (btnMarkAllRead) {
    btnMarkAllRead.addEventListener('click', () => {
      notificacionesData.forEach(n => n.leido = true);
      const listContainer = panel.querySelector('#notificationsList');
      if (listContainer) listContainer.innerHTML = renderNotificacionesItems();
    });
  }
});

/**
 * Mapea el arreglo de notificaciones a HTML
 */
function renderNotificacionesItems() {
  return notificacionesData.map(item => `
    <li class="notification-item ${item.leido ? '' : 'unread'}">
      <div class="notification-icon">
        <i class="${item.icon}"></i>
      </div>
      <div class="notification-content">
        <p class="notification-title">${item.titulo}</p>
        <p class="notification-text">${item.texto}</p>
        <span class="notification-time">${item.tiempo}</span>
      </div>
    </li>
  `).join('');
}