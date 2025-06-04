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
	protected.GET("/", shippingController.UndeliveredShipments)
	protected.GET("/entregados", shippingController.DeliveredShipments)
	protected.GET("/entregados/:id", shippingController.GetCompletedByDeliveryID)
	protected.GET("/:id", shippingController.GetIncompletedByDeliveryID)
	protected.PATCH("actualizarEnvio/:id", shippingController.UpdateShipping)
}
