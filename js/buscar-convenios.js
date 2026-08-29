//BUSCAR CONVENIOS — Lógica de la pantalla

document.addEventListener('DOMContentLoaded', () => {

  // 1. Elementos base 
  const tarjetas = document.querySelectorAll('.tarjeta-convenio');
  const todosLosChips = document.querySelectorAll('.chip-filtro');
  const selectCompania = document.getElementById('filtro-compania');
  const selectCuenta = document.getElementById('filtro-cuenta');
  const avisoVacioFavoritos = document.getElementById('estadoVacioFavoritos');
  const btnVerListado = document.getElementById('btnVerListado');
  const inputBuscador = document.getElementById('inputBuscador');
  const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusqueda');
  const chipTodos = document.querySelector('.chip-filtro[data-filtro="todos"]')
                    || document.querySelector('.chip-filtro.active');

  let filtroActivo = 'todos';

  //  2. Filtros (chips + selects + buscador)  
  function aplicarFiltros() {
    const companiaSeleccionada = selectCompania ? selectCompania.value.toLowerCase() : '';
    const cuentaSeleccionada = selectCuenta ? selectCuenta.value.toLowerCase() : '';
    const textoBusqueda = inputBuscador ? inputBuscador.value.trim().toLowerCase() : '';
    let visibles = 0;

    tarjetas.forEach(tarjeta => {
      const esFavorito = tarjeta.querySelector('.btn-favorito').classList.contains('activo');
      const dataCompania = (tarjeta.getAttribute('data-compania') || '').toLowerCase();
      const dataCuenta = (tarjeta.getAttribute('data-cuenta') || '').toLowerCase();
      const dataEstado = (tarjeta.getAttribute('data-estado') || '').toLowerCase();

      let cumpleChip = false;
      if (filtroActivo === 'todos') {
        cumpleChip = true;
      } else if (filtroActivo === 'favoritos') {
        cumpleChip = esFavorito;
      } else if (filtroActivo === 'vence') {
        cumpleChip = (dataEstado === 'vence');
      }

      const cumpleCompania = !companiaSeleccionada || dataCompania === companiaSeleccionada;
      const cumpleCuenta = !cuentaSeleccionada || dataCuenta === cuentaSeleccionada;

      // Busqueda: coincide si el texto aparece en el nombre de la compañía,
      // el tipo de cuenta o la descripción del beneficio.
      let cumpleBusqueda = true;
      if (textoBusqueda) {
        const nombreCompania = (tarjeta.querySelector('.tarjeta-compania')?.textContent || '').toLowerCase();
        const nombreCuenta = (tarjeta.querySelector('.tarjeta-cuenta')?.textContent || '').toLowerCase();
        const beneficio = (tarjeta.querySelector('.tarjeta-beneficio')?.textContent || '').toLowerCase();
        cumpleBusqueda = nombreCompania.includes(textoBusqueda)
                       || nombreCuenta.includes(textoBusqueda)
                       || beneficio.includes(textoBusqueda);
      }

      const cumpleTodo = cumpleChip && cumpleCompania && cumpleCuenta && cumpleBusqueda;
      tarjeta.style.display = cumpleTodo ? 'block' : 'none';
      if (cumpleTodo) visibles++;

      // Si una tarjeta se oculta, ciérrale el panel de descuento si estaba abierto
      if (!cumpleTodo) cerrarDetalle(tarjeta);
    });

    // Estado vacío de favoritos (solo aplica cuando el chip activo es "favoritos")
    if (avisoVacioFavoritos) {
      avisoVacioFavoritos.hidden = !(filtroActivo === 'favoritos' && visibles === 0);
    }
  }

  // Chips (Todos / Favoritos / Vence pronto)
  todosLosChips.forEach(chip => {
    chip.addEventListener('click', () => {
      todosLosChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filtroActivo = chip.getAttribute('data-filtro') || 'todos';
      aplicarFiltros();
    });
  });

  // Selects (Compañía / Cuenta)
  if (selectCompania) selectCompania.addEventListener('change', aplicarFiltros);
  if (selectCuenta) selectCuenta.addEventListener('change', aplicarFiltros);

  // Buscador de texto: filtra mientras el usuario escribe
  if (inputBuscador) {
    inputBuscador.addEventListener('input', aplicarFiltros);
  }

  // Boton de limpiar búsqueda
  if (btnLimpiarBusqueda) {
    btnLimpiarBusqueda.addEventListener('click', () => {
      if (inputBuscador) {
        inputBuscador.value = '';
        inputBuscador.focus();
      }
      aplicarFiltros();
    });
  }

  // Boton Ver todos los convenios y agregar  dentro del aviso vacío
  if (btnVerListado) {
    btnVerListado.addEventListener('click', () => {
      todosLosChips.forEach(c => c.classList.remove('active'));
      if (chipTodos) chipTodos.classList.add('active');
      filtroActivo = 'todos';
      aplicarFiltros();
    });
  }

  //  3. Favoritos (corazón)  
  document.querySelectorAll('.btn-favorito').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('activo');
      
      // Actualizamos el atributo aria-pressed dinámicamente
      const esActivo = btn.classList.contains('activo');
      btn.setAttribute('aria-pressed', esActivo ? 'true' : 'false');
      
      aplicarFiltros();
    });
  });

  //  4. Paneles de descuento expandibles  
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

  tarjetas.forEach(tarjeta => {
    const btn = tarjeta.querySelector('.btn-ver-mas');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const yaAbierta = tarjeta.classList.contains('expandida');

      // Solo una tarjeta expandida a la vez: cierra las demás antes de abrir esta.
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

});