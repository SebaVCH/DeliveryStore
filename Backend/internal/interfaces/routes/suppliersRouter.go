package routes

import (
	controllers "github.com/SebaVCH/DeliveryStore/internal/interfaces/controller"
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupSupplierRouter(router *gin.Engine) {
	suppliersRepo := repository.NewSupplierRepository()
	suppliersUseCase := usecase.NewSupplierUseCase(suppliersRepo)
	suppliersController := controllers.NewSupplierController(suppliersUseCase)

	protected := router.Group("/proveedores")
	protected.Use(middleware.AuthMiddleware())
	protected.POST("/", suppliersController.CreateSupplier)
	protected.GET("/", suppliersController.GetAllSuppliers)
	protected.GET("/:id", suppliersController.GetSupplierByID)
	protected.PUT("/:id", suppliersController.UpdateSupplier)
	protected.PATCH("/:id", suppliersController.RemoveSupplier)

}
