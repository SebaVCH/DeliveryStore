package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type SupplierRepository interface {
	GetAll() ([]domain.Supplier, error)
	GetSuppliersBySellerID(id int) ([]domain.Supplier, error)
	CreateSupplier(supplier domain.Supplier) error
	DeleteSupplier(id int) error
	UpdateSupplier(id int, supplier domain.Supplier) error
	CreateSupplierProduct(product domain.PSRelation) error
	GetSupplierProducts(id int) ([]domain.PSRelation, error)
}

type supplierRepository struct {
	db *gorm.DB
}

func NewSupplierRepository() SupplierRepository {
	return &supplierRepository{
		db: database.DB,
	}
}

func (s supplierRepository) GetAll() ([]domain.Supplier, error) {
	var suppliers []domain.Supplier
	err := s.db.Preload("Seller").Find(&suppliers).Error
	if err != nil {
		return nil, err
	}
	return suppliers, err
}

func (s supplierRepository) CreateSupplierProduct(product domain.PSRelation) error {
	return s.db.Create(&product).Error
}

func (s supplierRepository) GetSupplierProducts(id int) ([]domain.PSRelation, error) {
	var supplierProducts []domain.PSRelation
	err := s.db.Preload("Supplier").Preload("Product").
		Preload("Product.Seller").Preload("Supplier.Seller").
		Where("supplier_id = ?", id).
		Find(&supplierProducts).Error
	if err != nil {
		return nil, err
	}
	return supplierProducts, err
}

func (s supplierRepository) GetSuppliersBySellerID(id int) ([]domain.Supplier, error) {
	var suppliers []domain.Supplier
	err := s.db.Preload("Seller").Where("seller_id = ? AND eliminated = ?", id, false).Find(&suppliers).Error
	if err != nil {
		return nil, err
	}
	return suppliers, err
}

func (s supplierRepository) CreateSupplier(supplier domain.Supplier) error {
	return s.db.Create(&supplier).Error
}

func (s supplierRepository) DeleteSupplier(id int) error {
	err := s.db.Model(&domain.Supplier{}).Where("id = ?", id).Update("eliminated", true).Error
	return err
}

func (s supplierRepository) UpdateSupplier(id int, supplier domain.Supplier) error {
	return s.db.Model(&supplier).Where("id = ?", id).Updates(supplier).Error
}
