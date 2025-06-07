package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
	"strconv"
)

type CartRepository interface {
	CreateCart(cart domain.Cart) error
	GetAllCarts() ([]domain.Cart, error)
	GetTopProducts(quantity string) ([]domain.Product, error)
	GetCartsByBuyerID(buyerID string) ([]domain.Cart, error)
	GetFinalPrice(buyerID string) (float64, error)
	PayTheCart(buyerID string, finalPrice float64) error
	GetBuyerBalance(buyerID string) (float64, error)
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
	var product domain.Product
	if err := r.db.First(&product, cart.IDProduct).Error; err != nil {
		return err
	}
	cart.FinalPrice = float64(product.Price * cart.Quantity)
	return r.db.Create(&cart).Error
}

func (r *cartRepository) GetAllCarts() ([]domain.Cart, error) {
	var carts []domain.Cart
	err := r.db.Preload("Buyer").Preload("Product").Find(&carts).Error
	return carts, err
}

func (r *cartRepository) GetTopProducts(quantity string) ([]domain.Product, error) {
	var topProducts []domain.Product

	query := r.db.Table("products").
		Joins("JOIN carts ON carts.id_product = products.id").
		Where("carts.payed = ? AND products.eliminated = ?", true, false).
		Select("products.*, SUM(carts.quantity) as total_quantity").
		Group("products.id").
		Order("total_quantity DESC")

	if quantity != "all" {
		value, err := strconv.Atoi(quantity)
		if err != nil {
			return nil, err
		}
		query = query.Limit(value)
	}

	err := query.Preload("Seller").Find(&topProducts).Error

	return topProducts, err
}

func (r *cartRepository) GetCartsByBuyerID(buyerID string) ([]domain.Cart, error) {
	var carts []domain.Cart
	id, err := strconv.Atoi(buyerID)
	if err != nil {
		return nil, err
	}

	err = r.db.Preload("Product").Preload("Buyer").Preload("Product.Seller").Where("buyer_id = ? AND payed = ?", id, false).Find(&carts).Error
	if err != nil {
		return nil, err
	}

	return carts, nil
}

func (r *cartRepository) GetFinalPrice(buyerID string) (float64, error) {
	var carts []domain.Cart
	id, err := strconv.Atoi(buyerID)
	if err != nil {
		return 0, err
	}

	err = r.db.Where("buyer_id = ? AND payed = ?", id, false).Find(&carts).Error
	if err != nil {
		return 0, err
	}

	finalPrice := 0.0
	for _, cart := range carts {
		finalPrice += cart.FinalPrice
	}

	return finalPrice, nil
}

func (r *cartRepository) PayTheCart(buyerID string, finalPrice float64) error {
	id, err := strconv.Atoi(buyerID)
	if err != nil {
		return err
	}

	var carts []domain.Cart
	if err := r.db.Where("buyer_id = ? AND payed = ?", id, false).Find(&carts).Error; err != nil {
		return err
	}

	for _, cart := range carts {
		if err := r.db.Model(&domain.Product{}).Where("id = ?", cart.IDProduct).Update("quantity_sold", gorm.Expr("COALESCE(quantity_sold,0) + ?", cart.Quantity)).Error; err != nil {
			return err
		}
	}

	if err := r.db.Model(&domain.Cart{}).Where("buyer_id = ? AND payed = ?", id, false).Update("payed", true).Error; err != nil {
		return err
	}
	if err := r.db.Model(&domain.Usuario{}).Where("id = ?", id).Update("balance", gorm.Expr("balance - ?", finalPrice)).Error; err != nil {
		return err
	}

	return nil
}

func (r *cartRepository) GetBuyerBalance(buyerID string) (float64, error) {
	var buyer domain.Usuario
	id, err := strconv.Atoi(buyerID)
	if err != nil {
		return 0, err
	}

	err = r.db.Where("id = ?", id).First(&buyer).Error
	if err != nil {
		return 0, err
	}

	return buyer.Balance, nil
}
