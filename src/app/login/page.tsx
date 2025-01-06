"use client";

import React from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

import "../login/style.css";
import "../../css/style.css";

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    Swal.fire({
      title: 'Bienvenido',
      text: 'Por favor, ingrese su DNI:',
      input: 'text',
      inputPlaceholder: 'Ingrese su DNI',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return '¡Por favor ingrese su DNI!';
        } else if (!/^\d+$/.test(value)) {
          return 'El DNI debe contener solo números';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const dni = result.value;

        // Realizar la consulta a PHP para verificar el estado de registro
        fetch("/api/consulta_dni", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dni }),
        })
        .then(response => response.json())
        .then(data => {console.log(data.registro)
          if (data.error) {
             console.log(data)
            Swal.fire('Error', data.error, 'error');
          } else if (data.status === 'nuevo' || data.registro === '0') {
            iniciarRegistro(dni);
          } else if (data.registro === '1') {
            solicitarPassword(dni);
          } else {
            Swal.fire('Error', 'Estado inesperado. Verifique la respuesta del servidor.', 'error');
          }
        })
        .catch(() => Swal.fire('Error', 'No se pudo conectar con el servidor', 'error'));
      }
    });
  };

  const iniciarRegistro = (dni: string) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        Swal.fire({
          title: 'Captura de Foto',
          html: '<video id="video" autoplay muted style="width: 100%; height: auto;"></video>',
          showCancelButton: true,
          confirmButtonText: 'Capturar',
          cancelButtonText: 'Cancelar',
          didOpen: () => {
            const videoElement = document.getElementById('video') as HTMLVideoElement;
            if (videoElement) {
              videoElement.srcObject = stream;
            }
          },
          preConfirm: () => {
            const videoElement = document.getElementById('video') as HTMLVideoElement;
            if (!videoElement || !videoElement.srcObject) {
              return Swal.showValidationMessage('Error al acceder al video');
            }
  
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth || 640; // Valor por defecto si falla
            canvas.height = videoElement.videoHeight || 480;
  
            const context = canvas.getContext('2d');
            if (context) {
              context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            }
  
            const dataUrl = canvas.toDataURL('image/png');
  
            // Detener las pistas de la cámara
            const tracks = (videoElement.srcObject as MediaStream).getTracks();
            tracks.forEach((track) => track.stop());
  
            return dataUrl;
          }
        }).then((photoResult) => {
          if (photoResult.isConfirmed) {
            const photo = photoResult.value as string;
  
            // Enviar la foto al servidor
            return fetch('/api/guardar_foto', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({ dni, photo })
            })
              .then((response) => response.json())
              .then((photoResponse) => {
                if (photoResponse.success) {
                  // Solicitar la contraseña después de guardar la foto
                  return Swal.fire({
                    title: 'Crear contraseña',
                    input: 'password',
                    inputPlaceholder: 'Ingrese su contraseña',
                    confirmButtonText: 'Registrar',
                    showCancelButton: true,
                    inputValidator: (value) => {
                      if (!value || value.length < 6) {
                        return 'La contraseña debe tener al menos 6 caracteres';
                      }
                    }
                  });
                } else {
                  throw new Error('No se pudo guardar la foto');
                }
              });
          }
        }).then((passwordResult) => {
          if (passwordResult?.isConfirmed) {
            const password = passwordResult.value;
  
            // Enviar contraseña al servidor
            return fetch('/api/registrar_usuario', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({ dni, password })
            })
              .then((response) => response.json())
              .then((registrationData) => {
                if (registrationData.success) {
                  Swal.fire('Registro exitoso', 'Usuario registrado', 'success');
                } else {
                  throw new Error(registrationData.error);
                }
              });
          }
        }).catch((error) => {
          console.error(error);
          Swal.fire('Error', error.message || 'Ocurrió un problema', 'error');
        });
      })
      .catch(() => {
        Swal.fire('Error', 'No se pudo acceder a la cámara', 'error');
      });
  };
  





  const solicitarPassword = (dni: string) => {
    Swal.fire({
      title: 'Ingrese su contraseña',
      input: 'password',
      inputPlaceholder: 'Contraseña',
      showCancelButton: true,
      confirmButtonText: 'Validar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return '¡Por favor ingrese su contraseña!';
        }
      }
    }).then((passwordResult) => {
      if (passwordResult.isConfirmed) {
        const password = passwordResult.value;

        fetch('/api/validar_password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ dni, password })
        })
        .then(response => response.json())
        .then(validationData => {
          if (validationData.success) {
            localStorage.setItem('dni', dni);
            router.push('/user');
          } else {
            Swal.fire('Error', 'Contraseña incorrecta. Intente nuevamente.', 'error');
          }
        })
        .catch(() => Swal.fire('Error', 'No se pudo validar la contraseña', 'error'));
      }
    });
  };

  return (
    <div className="page-container">
      <div className="card">
        <button onClick={handleButtonClick} className="btn">INGRESAR</button>
      </div>
    </div>
  );
}
