# Tarifario de Precios

Precios por volumen y cotizador de pedidos. En el computador se abre el tarifario completo; en el teléfono, el cotizador.

## Cómo funciona

1. `index.html` es toda la app. Se publica con GitHub Pages y se puede instalar en el teléfono.
2. Los productos, costos, precios y la configuración se guardan en `datos.json`, **cifrados con tu clave** (AES-256-GCM). En GitHub el archivo es ilegible; la app lo descifra en cada dispositivo con la clave.
3. En el computador editas y tocas **Guardar en GitHub** (o Ctrl+S). Para eso la app usa un token de GitHub con permiso solo de escritura en `Contents` de este repositorio, guardado únicamente en ese navegador.
4. El teléfono descarga `datos.json` cada vez que abres la app o vuelves a ella, así que ve los cambios en segundos.

`datos.json` no existe hasta que guardas por primera vez desde el computador.

## Si olvidas la clave

No hay forma de recuperar los datos cifrados. Puedes borrar `datos.json` del repositorio, abrir la app en el computador, crear una clave nueva e importar de nuevo tu CSV.
