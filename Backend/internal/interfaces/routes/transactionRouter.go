package routes

import (
	controllers "github.com/SebaVCH/DeliveryStore/internal/interfaces/controller"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

func SetupTransactionRouter(router *gin.Engine) {
	transactionRepo := repository.NewTransactionRepository()
	transactionUseCase := usecase.NewTransactionUseCase(transactionRepo)
	transactionController := controllers.NewTransactionController(transactionUseCase)

	protected := router.Group("/sistema/transacciones")
	protected.POST("/", transactionController.CreateTransaction)
	protected.GET("/", transactionController.GetAllTransactions)
	protected.GET("/topVendedores/:quantity", transactionController.GetTransactionTopSellers)
	protected.GET("/calcularMontoTotal", transactionController.GetTransactionTotalAmount)

}
