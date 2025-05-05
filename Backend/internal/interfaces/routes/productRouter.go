package routes

import (
	controllers "github.com/SebaVCH/DeliveryStore/internal/interfaces/controller"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupProductRouter(router *gin.Engine) {
	productRepo := repository.NewProductRepository()
	productUseCase := usecase.NewProductUseCase(productRepo)
	productController := controllers.NewProductController(productUseCase)

	protected := router.Group("/user/productos")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("/", productController.CreateProduct)
	protected.GET("/", productController.GetAllProducts)
	protected.GET("/:id", productController.GetProductByID)
	protected.PUT("/:id", productController.UpdateProduct)
	protected.DELETE("/:id", productController.RemoveProduct)
}
