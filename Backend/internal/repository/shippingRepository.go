package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
	"time"
)

type ShippingRepository interface {
	CreateShipping(shipping domain.Shipping) error
	UpdateShipping(id int, shipping domain.Shipping) error
	UndeliveredShipments() ([]domain.Shipping, error)
	DeliveredShipments() ([]domain.Shipping, error)
	GetIncompletedByDeliveryID(deliveryID int) ([]domain.Shipping, error)
	GetCompletedByDeliveryID(deliveryID int) ([]domain.Shipping, error)
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

func (s shippingRepository) UndeliveredShipments() ([]domain.Shipping, error) {
	var shippings []domain.Shipping
	err := s.db.Preload("Delivery").Preload("Buyer").Where("status = ?", "en camino...").Find(&shippings).Error
	if err != nil {
		return nil, err
	}
	return shippings, nil
}

func (s shippingRepository) DeliveredShipments() ([]domain.Shipping, error) {
	var shippings []domain.Shipping
	err := s.db.Preload("Delivery").Preload("Buyer").Where("status = ?", "entregado").Find(&shippings).Error
	if err != nil {
		return nil, err
	}
	return shippings, nil
}

func (s shippingRepository) UpdateShipping(id int, shipping domain.Shipping) error {
	updates := map[string]interface{}{
		"Status": "entregado",
		"Date":   time.Now(),
	}
	return s.db.Model(&shipping).Where("id = ?", id).Updates(updates).Error
}

func (s shippingRepository) GetCompletedByDeliveryID(deliveryID int) ([]domain.Shipping, error) {
	var shippings []domain.Shipping
	err := s.db.Preload("Delivery").Preload("Buyer").Where("status = ? AND delivery_id = ?", "entregado", deliveryID).Find(&shippings).Error
	if err != nil {
		return nil, err
	}
	return shippings, nil
}
func (s shippingRepository) GetIncompletedByDeliveryID(deliveryID int) ([]domain.Shipping, error) {
	var shippings []domain.Shipping
	err := s.db.Preload("Delivery").Preload("Buyer").Where("status = ? AND delivery_id = ?", "en camino...", deliveryID).Find(&shippings).Error
	if err != nil {
		return nil, err
	}
	return shippings, nil
}
