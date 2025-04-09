package routes

import (
	"github.com/SebaVCH/DeliveryStore/handlers"
	"github.com/SebaVCH/DeliveryStore/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {

	r := gin.Default()

	r.POST("/register", handlers.UserRegister)
	r.POST("/login", handlers.UserLogin)

	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/profile", handlers.UserInfo)

	return r

}
