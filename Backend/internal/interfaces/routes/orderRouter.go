package routes

import (
	controllers "github.com/SebaVCH/DeliveryStore/internal/interfaces/controller"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupOrderRouter(router *gin.Engine) {
	orderRepo := repository.NewOrderRepository()
	orderUseCase := usecase.NewOrderUseCase(orderRepo)
	orderController := controllers.NewOrderController(orderUseCase)

	protected := router.Group("/sistema/ordenes")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("/", orderController.CreateOrder)
	protected.GET("/", orderController.GetAllOrders)
}
