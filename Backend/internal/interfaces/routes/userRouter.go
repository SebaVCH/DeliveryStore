package routes

import (
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/controller"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupUserRouter(router *gin.Engine) {

	userRepo := repository.NewUserRepository()
	userUseCase := usecase.NewUserUseCase(userRepo)
	userController := controllers.NewUserController(userUseCase)

	router.POST("/register", userController.Register)
	router.POST("/login", userController.Login)

	protected := router.Group("/")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/profile", userController.Info)
	protected.PUT("/profile/update", userController.UpdateMyAccount)
}
