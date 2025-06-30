# 🚚Delivery-Store

## 👋¡Bienvenido a Delivery Store!

En esta aplicación, tendrás la oportunidad de promocionar tus productos para la venta, adquirir artículos de otros usuarios y dejar tus valoraciones.
## ✨Características

- 🛒 **Publicación de productos**: Sube tus artículos para que otros usuarios puedan verlos y comprarlos fácilmente.

- 🔍 **Búsqueda de productos**: Busca y filtra la gran variedad de productos disponibles, donde pondrás encontrar productos de todo tipo (comestibles y no comestibles).

- ⭐ **Sistema de valoraciones**:  La aplicación cuenta con sistema de valoración de productos y estos también influyen en la valoración del vendedor.

- 🔐 **Autenticación segura**: Por temas de seguridad, la contraseña de los usuarios se encuentra cifrada.

- 📊**Sistema de métricas**: La vista de administrador tiene acceso a ver diversas métricas, entre ellas, top vendedores, top productos vendidos, montos totales de todas las transacciones, etc.

- 🚚**Sistema de órdenes y envió**: La aplicación cuentan con un sistema de órdenes y envíos en caso de adquirir productos que tienen la posibilidad de delivery.

>[!IMPORTANT]  
> Para poder iniciar el compilador seguir los siguientes pasos (teniendo en cuenta que se debe tener instalado Docker y Docker Compose):

## 📖Manual de uso

### Obtener el repositor
Para obtener el repositorio ejecutar
```  
https://github.com/SebaVCH/DeliveryStore.git  
```  

### Compilar el proyecto
Para poder compilar el proyecto, se debe estar en la carpeta raíz (DeliveryStore) y ejecutar el siguiente comando:
```  
docker-compose build  
```  

### Iniciar el proyecto
Para poder iniciar el proyecto, se debe estar en la carpeta raíz (DeliveryStore) y ejecutar el siguiente comando:
```  
docker-compose up  
```  

## Usuarios de prueba
###  usuarios comprador/vendedor:
```  
correo: roberto@gmail.com contraseña: roberto12
```  
```  
correo: test1@gmail.com contraseña: 123
```  

### repartidores:
```  
correo: test2@gmail.com contraseña: 123
```
```  
correo: usuario2@email.com contraseña: password2
```  

### admin:
```  
correo: test@gmail.com contraseña: 123
```
```  
correo: jorquera@gmail.com contraseña: jorge12
```  

>[!WARNING]  
> Dado que se trata de un entorno ficticio (y para facilitar el inicio del proyecto), se removió el archivo ".gitignore" que omitía subir el archivo ".env", por lo que este se incluirá desde un inicio. Se asume que en un entorno real esto no se debe hacer.
  
---
