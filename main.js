const data = document.getElementById("navegador");

function detectarNavegadorYDispositivo() {
  const userAgent = navigator.userAgent;

  console.log(userAgent);

  // Detectar el navegador
  const navegador =
    userAgent.includes("Chrome") && !userAgent.includes("Edge")
      ? "Google Chrome"
      : userAgent.includes("Safari") && !userAgent.includes("Chrome")
        ? "Safari"
        : userAgent.includes("Firefox")
          ? "Mozilla Firefox"
          : userAgent.includes("Edge")
            ? "Microsoft Edge"
            : "Otro navegador";

  // Detectar si el usuario está en un dispositivo móvil
  const esMovil =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );

  // Obtener información básica del dispositivo
  let infoDispositivo = {};
  if (esMovil) {
    infoDispositivo = {
      sistemaOperativo: /Android/i.test(userAgent)
        ? "Android"
        : /iPhone|iPad|iPod/i.test(userAgent)
          ? "iOS"
          : "Otro",
      dispositivo: /iPad/i.test(userAgent) ? "iPad" : "Teléfono móvil",
    };
  }

  // Intentar obtener el porcentaje de batería
  async function obtenerBateria() {
    if (navigator.getBattery) {
      try {
        const battery = await navigator.getBattery();
        return {
          nivelBateria: Math.round(battery.level * 100),
          cargando: battery.charging,
        };
      } catch (error) {
        console.error(
          "No se pudo obtener la información de la batería:",
          error,
        );
        return { nivelBateria: null, cargando: null };
      }
    } else {
      console.warn(
        "La API Battery Status no está soportada en este navegador.",
      );
      return { nivelBateria: null, cargando: null };
    }
  }

  return new Promise((resolve) => {
    obtenerBateria().then((bateria) => {
      resolve({ navegador, esMovil, infoDispositivo, bateria });
    });
  });
}

// Uso
detectarNavegadorYDispositivo().then((resultado) => {
  console.log("Navegador:", resultado.navegador);
  console.log("Es móvil:", resultado.esMovil);
  const navegadorData = document.createElement("li");
  const movilData = document.createElement("li");

  navegadorData.textContent = `Tipo de navegador: ${resultado.navegador}`;
  movilData.textContent = `Es móvil: ${resultado.esMovil}`;
  data.appendChild(navegadorData);
  data.appendChild(movilData);

  if (resultado.esMovil) {
    console.log("Información del dispositivo:", resultado.infoDispositivo);
    console.log("Batería:", resultado.bateria);
    const bateriaData = document.createElement("li");
    bateriaData.textContent = `Batería: ${resultado.bateria.nivelBateria}%`;
    const cargandoData = document.createElement("li");
    cargandoData.textContent = `Cargando: ${resultado.bateria.cargando ? "Sí" : "No"}`;
    data.appendChild(cargandoData);
    data.appendChild(bateriaData);
    const dispositivoData = document.createElement("li");
    dispositivoData.textContent = `Información del dispositivo: ${resultado.infoDispositivo.sistemaOperativo} - ${resultado.infoDispositivo.dispositivo}`;
    data.appendChild(dispositivoData);
  } else {
    const bateriaData = document.createElement("li");
    bateriaData.textContent = "El dispositivo no es móvil.";
    data.appendChild(bateriaData);
    console.log("El dispositivo no es móvil, no se puede obtener la batería.");
  }
});
