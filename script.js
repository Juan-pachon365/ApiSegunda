// script.js
// Mantén este archivo en la misma carpeta que index.html y style.css

(() => {
  const frases = [
    "Respira. Un momento a la vez — estás haciendo lo mejor que puedes.",
    "No tienes que ser fuerte todo el tiempo. Permitirte sentir también es valentía.",
    "Esto también pasará. Tu valor no se mide por un mal día.",
    "Pedir ayuda es un acto de coraje, no de debilidad.",
    "Date permiso para descansar; cuidarte no es egoísmo.",
    "Pequeños pasos siguen siendo progreso. Celebra lo mínimo hoy.",
    "Tu identidad no es tu ansiedad. Eres más que lo que sientes ahora.",
    "Has sobrevivido a días difíciles antes. Puedes hacerlo otra vez.",
    "Puedes establecer límites y eso está bien. Tu bienestar importa.",
    "Aunque hoy sea duro, hay cosas que aún puedes intentar respirar y seguir."
  ];

  const fraseEl = document.getElementById('frase');
  const nuevaBtn = document.getElementById('nuevaBtn');
  const copiarBtn = document.getElementById('copiarBtn');
  const autoToggleBtn = document.getElementById('autoToggleBtn');
  const telefono = document.getElementById('telefono');

  // Número de contacto inventado
  telefono.textContent = '+57 300 123 4567';
  telefono.href = 'tel:+573001234567';

  let currentIndex = -1;
  let autoInterval = null;
  const AUTO_SECONDS = 7000; // cada 7 segundos

  function mostrarFrase(index, animate = true){
    if (index == null) index = Math.floor(Math.random() * frases.length);
    currentIndex = index % frases.length;
    // animación simple
    if (animate) {
      fraseEl.style.opacity = 0;
      fraseEl.style.transform = 'translateY(6px)';
      setTimeout(() => {
        fraseEl.textContent = frases[currentIndex];
        fraseEl.style.opacity = 1;
        fraseEl.style.transform = 'translateY(0)';
      }, 220);
    } else {
      fraseEl.textContent = frases[currentIndex];
    }
  }

  function mostrarOtra(){
    // evita repetir la misma inmediatamente
    let next = Math.floor(Math.random() * frases.length);
    if (frases.length > 1) {
      while (next === currentIndex) {
        next = Math.floor(Math.random() * frases.length);
      }
    }
    mostrarFrase(next);
  }

  function copiarActual(){
    const text = fraseEl.textContent || '';
    if (!text) return;
    // usa el API de Clipboard si está disponible
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          copiarBtn.textContent = 'Copiado ✓';
          setTimeout(()=> copiarBtn.textContent = 'Copiar', 1600);
        })
        .catch(()=> {
          alert('No fue posible copiar. Selecciona el texto manualmente.');
        });
    } else {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        copiarBtn.textContent = 'Copiado ✓';
        setTimeout(()=> copiarBtn.textContent = 'Copiar', 1600);
      } catch {
        alert('No fue posible copiar. Selecciona el texto manualmente.');
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  function toggleAuto(){
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
      autoToggleBtn.textContent = 'Auto: Off';
      autoToggleBtn.classList.remove('active');
    } else {
      autoInterval = setInterval(mostrarOtra, AUTO_SECONDS);
      autoToggleBtn.textContent = 'Auto: On';
      autoToggleBtn.classList.add('active');
    }
  }

  // eventos
  nuevaBtn.addEventListener('click', mostrarOtra);
  copiarBtn.addEventListener('click', copiarActual);
  autoToggleBtn.addEventListener('click', toggleAuto);

  // Mostrar una frase al cargar (usar última guardada en sessionStorage si existe)
  const savedIndex = sessionStorage.getItem('respira_index');
  if (savedIndex !== null) {
    mostrarFrase(parseInt(savedIndex, 10), false);
  } else {
    mostrarFrase(null, false);
  }

  // guardar en session para que persista en la misma pestaña
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('respira_index', currentIndex);
  });

  // accesibilidad: permite intercambiar frase con barra espaciadora cuando el foco está en la página
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement === document.body) {
      e.preventDefault();
      mostrarOtra();
    }
  });

})();
