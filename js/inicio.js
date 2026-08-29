document.addEventListener('DOMContentLoaded', () => {
  const tarjetas = document.querySelectorAll('.tarjeta-convenio');

  // Funciones exactas a las de buscar-convenios
  function cerrarDetalle(tarjeta) {
    const btn = tarjeta.querySelector('.btn-ver-mas');
    const detalle = tarjeta.querySelector('.detalle-descuento');
    if (!btn || !detalle) return;
    tarjeta.classList.remove('expandida');
    detalle.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Ver descuento';
  }

  function abrirDetalle(tarjeta) {
    const btn = tarjeta.querySelector('.btn-ver-mas');
    const detalle = tarjeta.querySelector('.detalle-descuento');
    if (!btn || !detalle) return;
    tarjeta.classList.add('expandida');
    detalle.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Ocultar descuento';
  }

  // Asignar el evento a cada tarjeta
  tarjetas.forEach(tarjeta => {
    const btn = tarjeta.querySelector('.btn-ver-mas');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const yaAbierta = tarjeta.classList.contains('expandida');

      // Cierra las demás tarjetas si abres una nueva
      tarjetas.forEach(otra => {
        if (otra !== tarjeta) cerrarDetalle(otra);
      });

      if (yaAbierta) {
        cerrarDetalle(tarjeta);
      } else {
        abrirDetalle(tarjeta);
      }
    });
  });

  // Funcionalidad del corazón de Favoritos con accesibilidad actualizada
  document.querySelectorAll('.btn-favorito').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('activo');
      
      const estaActivo = btn.classList.contains('activo');
      btn.setAttribute('aria-pressed', estaActivo);
    });
  });
});