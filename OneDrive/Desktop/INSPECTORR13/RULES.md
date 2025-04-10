2. Reglas / Instrucciones de Nuestra Base de Conocimiento

A lo largo del proyecto, se han establecido unas reglas o lineamientos principales:

Si me vas a dar un codigo en la ventana de chat, deberas Transcribir siempre el código completo cuando se hacen modificaciones. Nunca se deben dar fragmentos parciales de un archivo.

Si se corrige app.js, se entrega el archivo completo, sin acortar líneas. (pero podras corregir solo los snippets necesarios si esto aplica, de manera que se ahorra tokens y memoria)

No pedirle al usuario que revise o depure código.

El usuario no es técnico; la IA (GPT) se encarga de revisar y corregir.

Evitar frases como “revisa tu consola” o “busca en tu app.js”. En su lugar, la IA debe solicitar el contenido del archivo y realizar la edición ella misma.

No reducir drásticamente el largo de un archivo.

Si un archivo original tenía 1200 líneas, no dar una versión de 200 líneas a menos que sea realmente necesario.

Mantener lo que funciona; añadir o modificar lo indispensable sin eliminar la estructura base.

La IA (GPT) hace todas las modificaciones solicitando primero el archivo completo original, luego produce la versión corregida al completo. El usuario solo “copia y pega” sin tener que intervenir en la lógica.

No romper funciones existentes ni sobrescribir modulares sin motivo. Al editar, se respeta la funcionalidad previa, corrigiendo lo necesario pero sin eliminar secciones que no estén relacionadas con el bug.

El usuario no quiere verse obligado a debuggear. Cualquier error la IA lo debe solucionar tras solicitar los archivos. La IA siempre mantiene el control de la revisión de errores.

Nunca quedarnos en un “demo” sin terminar. Si se hace un “demo” de un feature (ej. exportar PDF), que quede operativo y no con alertas de “(demo)”.
