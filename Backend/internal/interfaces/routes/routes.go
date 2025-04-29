package routes

import (
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	r.POST("/register", usecase.UserRegister)
	r.POST("/login", usecase.UserLogin)

	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/profile", usecase.UserInfo)
	protected.PUT("/profile/update", usecase.UserUpdate)

	return r
}
