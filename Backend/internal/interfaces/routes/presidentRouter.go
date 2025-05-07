package routes

import (
	controllers "github.com/SebaVCH/DeliveryStore/internal/interfaces/controller"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupPresidentRouter(router *gin.Engine) {

	presidentRepo := repository.NewUserRepository()
	presidentUseCase := usecase.NewUserUseCase(presidentRepo)
	presidentController := controllers.NewUserController(presidentUseCase)

	protected := router.Group("/admin")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/users", presidentController.GetAllUsers)
	protected.POST("/users", presidentController.Register)
	protected.DELETE("/users/:email", presidentController.Delete)
	protected.PUT("/users/:email", presidentController.UpdateAnyAccount)
}
