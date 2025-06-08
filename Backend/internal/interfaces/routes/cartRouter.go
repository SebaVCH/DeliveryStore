package routes

import (
	controllers "github.com/SebaVCH/DeliveryStore/internal/interfaces/controller"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupCartRouter(router *gin.Engine) {
	cartRepo := repository.NewCartRepository()
	cartUseCase := usecase.NewCartUseCase(cartRepo)
	cartController := controllers.NewCartController(cartUseCase)

	protected := router.Group("/sistema/carrito")
	protected.Use(middleware.AuthMiddleware())
	protected.GET("/topProductos/:quantity", cartController.GetTopProducts)
	protected.GET("/", cartController.GetAllCarts)
	protected.POST("/", cartController.CreateCart)
	protected.GET("/misCompras/:id", cartController.GetCartsByBuyerID)
	protected.GET("/calcularMontoFinal/:id", cartController.GetFinalPrice)
	protected.PATCH("/pagar/:id", cartController.PayTheCart)
}
