package usecase

import (
	"net/http"

	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type UserUseCase interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
	Info(c *gin.Context)
	Update(c *gin.Context)
}

type userUseCase struct {
	userRepo repository.UserRepository
}

func NewUserUseCase(repo repository.UserRepository) UserUseCase {
	return &userUseCase{
		userRepo: repo,
	}
}

func (uc *userUseCase) Register(c *gin.Context) {
	var user domain.Usuario

	if err := c.ShouldBindJSON(&user); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al registrar usuario"})
		return
	}

	if uc.userRepo.Exists(user.Email) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Este email ya está en uso"})
		return
	}

	user.Password = utils.HashPassword(user.Password)
	if err := uc.userRepo.Create(user); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error al crear usuario"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Usuario registrado correctamente"})
}

func (uc *userUseCase) Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al leer datos"})
		return
	}

	user, err := uc.userRepo.FindByEmail(input.Email)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Usuario o contraseña incorrectos"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Usuario o contraseña incorrectos"})
		return
	}

	token, err := utils.GenerateToken(user)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al generar token"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"token": token})
}

func (uc *userUseCase) Info(c *gin.Context) {
	email, exists := c.Get("email")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener email"})
		return
	}

	user, err := uc.userRepo.FindByEmail(email.(string))
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Problema al obtener la información del usuario"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"user": user})
}

func (uc *userUseCase) Update(c *gin.Context) {
	email, exists := c.Get("email")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener email"})
		return
	}

	user, err := uc.userRepo.FindByEmail(email.(string))
	if err != nil {
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
			c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Contraseña actual incorrecta"})
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

	if err := uc.userRepo.Update(user, updates); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Error al actualizar el usuario"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Usuario actualizado correctamente"})
}
