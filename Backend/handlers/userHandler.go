package handlers

import (
	"github.com/SebaVCH/DeliveryStore/database"
	"github.com/SebaVCH/DeliveryStore/models"
	"github.com/SebaVCH/DeliveryStore/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

func UserRegister(c *gin.Context) {

	var user models.Usuario

	if err := c.ShouldBindJSON(&user); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al registrar usuario"})
		return
	}
	if err := database.DB.Where("email = ?", user.Email).First(&user).Error; err == nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Este email ya esta en uso"})
		return
	}

	user.Password = utils.HashPassword(user.Password)
	database.DB.Create(&user)
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Usuario registrado correctamente"})

}

func UserLogin(c *gin.Context) {
	var user models.Usuario
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al leer datos"})
		return
	}

	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Usuario o contraseña incorrectos 1"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Usuario o contraseña incorrectos 2"})
		return
	}

	token, err := utils.GenerateToken(user)

	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al generar token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"email": user.Email,
			"name":  user.Name,
		}})

}

func UserInfo(c *gin.Context) {
	var user models.Usuario
	email, exists := c.Get("email")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener email"})
		return
	}
	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Problema al obtener la informacion del usuario"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"user": user})
}

func UserUpdate(c *gin.Context) {

	email, exists := c.Get("email")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener email"})
		return
	}

	var user models.Usuario
	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Usuario no encontrado"})
		return
	}

	var updateData struct {
		Name              string `json:"name"`
		ActualPassword    string `json:"password"`
		NewPassword       string `json:"new_password"`
		RepeatNewPassword string `json:"repeat_new_password"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Datos de actualización inválidos"})
		return
	}

	updates := make(map[string]interface{})

	if updateData.Name != "" {
		updates["name"] = updateData.Name
	}

	if updateData.ActualPassword != "" || updateData.NewPassword != "" || updateData.RepeatNewPassword != "" {

		if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(updateData.ActualPassword)) != nil {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Datos de actualización inválidos"})
			return
		}

		if updateData.NewPassword != updateData.RepeatNewPassword {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Las nuevas claves no coinciden"})
			return
		}

		if len(updateData.NewPassword) < 8 {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "La nueva clave debe tener al menos 8 caracteres"})
			return
		}

		updates["password"] = utils.HashPassword(updateData.NewPassword)
	}

	if len(updates) == 0 {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "No se proporcionaron datos válidos para actualizar"})
		return
	}

	if err := database.DB.Model(&user).Updates(updates).Error; err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error al actualizar el usuario"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Usuario actualizado correctamente"})
}
