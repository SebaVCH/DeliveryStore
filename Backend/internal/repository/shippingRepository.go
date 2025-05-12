package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type ShippingRepository interface {
	CreateShipping(shipping domain.Shipping) error
	GetAllShipping() ([]domain.Shipping, error)
	UpdateShipping(id int, shipping domain.Shipping) error
}

type shippingRepository struct {
	db *gorm.DB
}

func NewShippingRepository() ShippingRepository {
	return &shippingRepository{
		db: database.DB,
	}
}

func (s shippingRepository) CreateShipping(shipping domain.Shipping) error {
	return s.db.Create(&shipping).Error
}

func (s shippingRepository) GetAllShipping() ([]domain.Shipping, error) {
	var shippings []domain.Shipping
	err := s.db.Find(&shippings).Error
	if err != nil {
		return nil, err
	}
	return shippings, nil
}

func (s shippingRepository) UpdateShipping(id int, shipping domain.Shipping) error {
	return s.db.Model(&shipping).Where("id = ?", id).Updates(shipping).Error
}
