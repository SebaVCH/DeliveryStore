package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type ProductRepository interface {
	GetAllProducts() ([]domain.Product, error)
	GetProductsBySellerID(id int) ([]domain.Product, error)
	CreateProduct(product domain.Product) error
	UpdateProduct(id int, product domain.Product) error
	DeleteProduct(id int) error
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository() ProductRepository {
	return &productRepository{
		db: database.DB,
	}
}

func (p productRepository) GetAllProducts() ([]domain.Product, error) {
	var products []domain.Product
	err := p.db.Preload("Seller").Where("eliminated = ?", false).Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}

func (p productRepository) GetProductsBySellerID(id int) ([]domain.Product, error) {
	var products []domain.Product
	err := p.db.Where("eliminated = ? AND seller_id = ?", false, id).Find(&products).Error
	return products, err
}

func (p productRepository) CreateProduct(product domain.Product) error {
	return p.db.Create(&product).Error
}

func (p productRepository) UpdateProduct(id int, product domain.Product) error {
	return p.db.Model(&product).Where("id = ?", id).Updates(product).Error
}

func (p productRepository) DeleteProduct(id int) error {
	err := p.db.Model(&domain.Product{}).Where("id = ?", id).Update("eliminated", true).Error
	return err
}
