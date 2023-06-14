# Detector de Lenguaje de Señas Peruano con TensorFlow.js

Este proyecto es un detector de lenguaje de señas peruano que utiliza las siguientes tecnologías:

- React.js: Biblioteca de JavaScript para construir interfaces de usuario.
- Express: Marco de aplicaciones web de Node.js para crear el servidor de backend.
- WebRTC: Tecnología para la comunicación en tiempo real entre navegadores.
- TensorFlow.js: Biblioteca de JavaScript basada en TensorFlow para entrenar y desplegar modelos de aprendizaje automático en el navegador.

## Requisitos previos

- Node.js
- NPM

## Instalación

1. Clona este repositorio o descárgalo como archivo ZIP.

2. Navega hasta el directorio raíz del proyecto.

3. Instala las dependencias del proyecto:

```bash
  npm install
```

4. Construye los archivos estáticos para el cliente:

```bash
npm run build
```

5. Inicia el servidor de desarrollo:

```bash
npm start
```

6. Accede al proyecto en tu navegador web:

http://localhost:9000

## Uso

1. Permite el acceso a tu cámara cuando se solicite.

2. Coloca tu mano en frente de la cámara para que el modelo pueda detectar los gestos de la lengua de señas peruana.

3. El modelo procesará los gestos y proporcionará una predicción del signo correspondiente.

## Contribución

1. Haz un fork de este repositorio.

2. Clona el repositorio bifurcado en tu máquina local.

3. Crea una rama para tu función o corrección de errores:

```bash
git checkout -b nombre-de-la-rama
```

4. Realiza los cambios deseados y realiza los commits correspondientes:

```bash
git commit -m "Descripción de los cambios"
```

5. Envía tus cambios al repositorio bifurcado:

```bash
git push origin nombre-de-la-rama
```

6. Abre una solicitud de extracción en el repositorio original.

## Créditos

Este proyecto fue creado por Andy Josue Santisteban Ostos junto a Nicolette Pacheco Contreras y se basa en las siguientes tecnologías:

- React.js
- Express
- WebRTC
- TensorFlow.js

## Licencia

Este proyecto se encuentra bajo la Licencia MIT. Puedes obtener más información en el archivo LICENSE.
