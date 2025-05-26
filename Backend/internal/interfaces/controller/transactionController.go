package controllers

import (
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

type TransactionController struct {
	TransactionUseCase usecase.TransactionUseCase
}

func NewTransactionController(transactionUseCase usecase.TransactionUseCase) *TransactionController {
	return &TransactionController{
		TransactionUseCase: transactionUseCase,
	}
}

func (tc *TransactionController) CreateTransaction(c *gin.Context) {
	tc.TransactionUseCase.CreateTransaction(c)
}

func (tc *TransactionController) GetAllTransactions(c *gin.Context) {
	tc.TransactionUseCase.GetAllTransactions(c)
}

func (tc *TransactionController) GetTransactionTotalAmount(c *gin.Context) {
	tc.TransactionUseCase.GetTransactionTotalAmount(c)
}

func (tc *TransactionController) GetTransactionTopSellers(c *gin.Context) {
	tc.TransactionUseCase.GetTransactionTopSellers(c)
}
