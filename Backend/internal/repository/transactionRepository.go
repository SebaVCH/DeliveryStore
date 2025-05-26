package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type TransactionRepository interface {
	CreateTransaction(transaction domain.Transaction) error
	GetAllTransactions() ([]domain.Transaction, error)
	GetTransactionTotalAmount() (float64, error)
	GetTransactionTopSellers() ([]domain.Usuario, error)
}

type transactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository() TransactionRepository {
	return &transactionRepository{
		db: database.DB,
	}
}

func (r *transactionRepository) CreateTransaction(transaction domain.Transaction) error {
	return r.db.Create(&transaction).Error
}

func (r *transactionRepository) GetAllTransactions() ([]domain.Transaction, error) {
	var transactions []domain.Transaction
	err := r.db.Find(&transactions).Error
	return transactions, err
}

func (r *transactionRepository) GetTransactionTotalAmount() (float64, error) {
	var total float64
	err := r.db.Model(&domain.Transaction{}).Select("SUM(amount)").Find(&total).Error
	return total, err
}

func (r *transactionRepository) GetTransactionTopSellers() ([]domain.Usuario, error) {
	var users []domain.Usuario

	err := r.db.Table("transactions").
		Select("usuarios.*, COUNT(transactions.id) as total_transactions, SUM(transactions.amount) as total_amount").
		Joins("JOIN usuarios ON usuarios.id = transactions.seller_id").
		Where("usuarios.banned = ?", false).
		Group("usuarios.id").
		Order("total_amount DESC").
		Limit(3).
		Find(&users).Error

	return users, err
}
