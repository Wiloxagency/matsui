Server and client. Express and React

Server:
Compilar en el servidor, en el servidor ~/home/test_build
Cambiar las variables de entorno por literales fijas, estas 4:

DATABASE_NAME
MONGODB_URI
MAILTRAP_PASSWORD
FRONTEND_URL = "app2.matsui-color.com"

Cambiar el puerto de 3000 a 3100
para listar PM2 primero colocar la versión por defecto:
nvm use v22.2