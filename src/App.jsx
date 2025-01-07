import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);

  const detectarNavegadorYDispositivo = async () => {
    const userAgent = navigator.userAgent;

    // Detectar el navegador
    const navegador =
      userAgent.includes('Chrome') && !userAgent.includes('Edge')
        ? 'Google Chrome'
        : userAgent.includes('Safari') && !userAgent.includes('Chrome')
          ? 'Safari'
          : userAgent.includes('Firefox')
            ? 'Mozilla Firefox'
            : userAgent.includes('Edge')
              ? 'Microsoft Edge'
              : 'Otro navegador';

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
          ? 'Android'
          : /iPhone|iPad|iPod/i.test(userAgent)
            ? 'iOS'
            : 'Otro',
        dispositivo: /iPad/i.test(userAgent) ? 'iPad' : 'Teléfono móvil',
      };
    }

    // Intentar obtener el porcentaje de batería
    const obtenerBateria = async () => {
      if (navigator.getBattery) {
        try {
          const battery = await navigator.getBattery();
          return {
            nivelBateria: Math.round(battery.level * 100),
            cargando: battery.charging,
          };
        } catch (error) {
          console.error(
            'No se pudo obtener la información de la batería:',
            error,
          );
          return { nivelBateria: null, cargando: null };
        }
      } else {
        console.warn(
          'La API Battery Status no está soportada en este navegador.',
        );
        return { nivelBateria: null, cargando: null };
      }
    };

    const bateria = await obtenerBateria();

    return { navegador, esMovil, infoDispositivo, bateria };
  };

  useEffect(() => {
    detectarNavegadorYDispositivo().then((resultado) => {
      setDeviceInfo(resultado);
    });
  }, []);

  return (
    <div className="content">
      <h1>Información del Dispositivo</h1>
      {!deviceInfo ? (
        <p>Cargando información...</p>
      ) : (
        <ul>
          <li>Tipo de navegador: {deviceInfo.navegador}</li>
          <li>Es móvil: {deviceInfo.esMovil ? 'Sí' : 'No'}</li>
          {deviceInfo.esMovil && (
            <>
              <li>Dispositivo: {deviceInfo.infoDispositivo.dispositivo}</li>
              <li>
                Sistema Operativo: {deviceInfo.infoDispositivo.sistemaOperativo}
              </li>
              <li>
                Batería: {deviceInfo.bateria.nivelBateria ?? 'No disponible'}%
              </li>
              <li>Cargando: {deviceInfo.bateria.cargando ? 'Sí' : 'No'}</li>
            </>
          )}
          {!deviceInfo.esMovil && <li>El dispositivo no es móvil.</li>}
        </ul>
      )}
    </div>
  );
};

export default App;
