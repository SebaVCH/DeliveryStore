package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type SupplierRepository interface {
	GetAll() ([]domain.Supplier, error)
	GetByID(id int) (domain.Supplier, error)
	CreateSupplier(supplier domain.Supplier) error
	DeleteSupplier(id int) error
	UpdateSupplier(id int, supplier domain.Supplier) error
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
	err := s.db.Find(&suppliers).Error
	if err != nil {
		return nil, err
	}
	return suppliers, err
}

func (s supplierRepository) GetByID(id int) (domain.Supplier, error) {
	var supplier domain.Supplier
	err := s.db.Where("id = ?", id).First(&supplier).Error
	return supplier, err
}

func (s supplierRepository) CreateSupplier(supplier domain.Supplier) error {
	return s.db.Create(&supplier).Error
}

func (s supplierRepository) DeleteSupplier(id int) error {
	var supplier domain.Supplier
	err := s.db.Where("id = ?", id).Delete(&supplier).Error
	return err
}

func (s supplierRepository) UpdateSupplier(id int, supplier domain.Supplier) error {
	return s.db.Model(&supplier).Where("id = ?", id).Updates(supplier).Error
}
