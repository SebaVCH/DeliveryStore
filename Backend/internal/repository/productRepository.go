package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type ProductRepository interface {
	GetAllProducts() ([]domain.Product, error)
	GetProductByID(id int) (domain.Product, error)
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
	err := p.db.Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}

func (p productRepository) GetProductByID(id int) (domain.Product, error) {
	var product domain.Product
	err := p.db.Where("id = ?", id).First(&product).Error
	return product, err
}

func (p productRepository) CreateProduct(product domain.Product) error {
	return p.db.Create(&product).Error
}

func (p productRepository) UpdateProduct(id int, product domain.Product) error {
	return p.db.Model(&product).Where("id = ?", id).Updates(product).Error
}

func (p productRepository) DeleteProduct(id int) error {
	var product domain.Product
	err := p.db.Where("id = ?", id).Delete(&product).Error
	return err
}
