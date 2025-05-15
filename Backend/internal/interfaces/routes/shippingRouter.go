package routes

import (
	controllers "github.com/SebaVCH/DeliveryStore/internal/interfaces/controller"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupShippingRouter(router *gin.Engine) {

	shippingRepo := repository.NewShippingRepository()
	shippingUseCase := usecase.NewShippingUseCase(shippingRepo)
	shippingController := controllers.NewShippingController(shippingUseCase)

	protected := router.Group("/sistema/envios")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("/", shippingController.CreateShipping)
	protected.GET("/", shippingController.GetAllShipping)
	protected.PUT("/:id", shippingController.UpdateShipping)
}
