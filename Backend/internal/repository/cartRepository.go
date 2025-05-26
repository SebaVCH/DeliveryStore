package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type CartRepository interface {
	CreateCart(cart domain.Cart) error
	GetAllCarts() ([]domain.Cart, error)
	GetTopProducts() ([]domain.Product, error)
}

type cartRepository struct {
	db *gorm.DB
}

func NewCartRepository() CartRepository {
	return &cartRepository{
		db: database.DB,
	}
}

func (r *cartRepository) CreateCart(cart domain.Cart) error {
	return r.db.Create(&cart).Error
}

func (r *cartRepository) GetAllCarts() ([]domain.Cart, error) {
	var carts []domain.Cart
	err := r.db.Find(&carts).Error
	return carts, err
}

func (r *cartRepository) GetTopProducts() ([]domain.Product, error) {
	var topProducts []domain.Product
	err := r.db.Table("products").
		Joins("JOIN carts ON carts.id_product = products.id").
		Where("carts.payed = ?", true).
		Select("products.*, SUM(carts.quantity) as total_quantity").
		Group("products.id").
		Order("total_quantity DESC").
		Limit(10).
		Find(&topProducts).Error

	return topProducts, err
}
