package repository

import (
	"database/sql"
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
	"strconv"
)

type TransactionRepository interface {
	CreateTransaction(transaction *domain.Transaction) error
	GetAllTransactions() ([]domain.Transaction, error)
	GetTransactionTotalAmount() (float64, error)
	GetTransactionTopSellers(quantity string) ([]domain.Usuario, error)
}

type transactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository() TransactionRepository {
	return &transactionRepository{
		db: database.DB,
	}
}

func (r *transactionRepository) CreateTransaction(transaction *domain.Transaction) error {
	if err := r.db.Create(&transaction).Error; err != nil {
		return err
	}

	var seller domain.Usuario
	if err := r.db.Where("id = ?", transaction.SellerID).First(&seller).Error; err != nil {
		return err
	}
	transaction.Seller = seller
	var buyer domain.Usuario
	if err := r.db.Where("id = ?", transaction.BuyerID).First(&buyer).Error; err != nil {
		return err
	}
	transaction.Buyer = buyer

	return nil
}

func (r *transactionRepository) GetAllTransactions() ([]domain.Transaction, error) {
	var transactions []domain.Transaction
	err := r.db.Preload("Buyer").Preload("Seller").Preload("Product").Find(&transactions).Error
	return transactions, err
}

func (r *transactionRepository) GetTransactionTotalAmount() (float64, error) {
	var total sql.NullFloat64
	err := r.db.Model(&domain.Transaction{}).Select("SUM(amount)").Find(&total).Error
	return total.Float64, err
}

func (r *transactionRepository) GetTransactionTopSellers(quantity string) ([]domain.Usuario, error) {
	var users []domain.Usuario

	query := r.db.Table("transactions").
		Select("usuarios.*, COUNT(transactions.id) as total_transactions, SUM(transactions.amount) as total_amount").
		Joins("JOIN usuarios ON usuarios.id = transactions.seller_id").
		Where("usuarios.banned = ?", false).
		Group("usuarios.id").
		Order("total_amount DESC")

	if quantity != "all" {
		value, err := strconv.Atoi(quantity)
		if err != nil {
			return nil, err
		}
		query = query.Limit(value)
	}

	err := query.Find(&users).Error

	return users, err
}
