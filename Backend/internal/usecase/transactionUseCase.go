package usecase

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type TransactionUseCase interface {
	CreateTransaction(c *gin.Context)
	GetAllTransactions(c *gin.Context)
	GetTransactionTotalAmount(c *gin.Context)
	GetTransactionTopSellers(c *gin.Context)
}

type transactionUseCase struct {
	repo repository.TransactionRepository
}

func NewTransactionUseCase(repo repository.TransactionRepository) TransactionUseCase {
	return &transactionUseCase{repo: repo}
}

func (uc *transactionUseCase) CreateTransaction(c *gin.Context) {
	var transaction domain.Transaction
	if err := c.ShouldBindJSON(&transaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	if err := uc.repo.CreateTransaction(transaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, transaction)
}

func (uc *transactionUseCase) GetAllTransactions(c *gin.Context) {
	transactions, err := uc.repo.GetAllTransactions()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, transactions)
}

func (uc *transactionUseCase) GetTransactionTotalAmount(c *gin.Context) {
	total, err := uc.repo.GetTransactionTotalAmount()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"total_amount": total})
}

func (uc *transactionUseCase) GetTransactionTopSellers(c *gin.Context) {
	users, err := uc.repo.GetTransactionTopSellers()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}
