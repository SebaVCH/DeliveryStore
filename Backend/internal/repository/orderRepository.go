package repository

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/infrastructure/database"
	"gorm.io/gorm"
)

type OrderRepository interface {
	CreateOrder(order domain.Order) error
	GetAllOrders() ([]domain.Order, error)
	SetEliminated(id int) error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository() OrderRepository {
	return &orderRepository{
		db: database.DB,
	}
}

func (o orderRepository) CreateOrder(order domain.Order) error {
	return o.db.Create(&order).Error
}

func (o orderRepository) GetAllOrders() ([]domain.Order, error) {
	var orders []domain.Order
	err := o.db.Preload("Buyer").Preload("Seller").Where("eliminated = ?", false).Find(&orders).Error
	if err != nil {
		return nil, err
	}
	return orders, nil
}

func (o orderRepository) SetEliminated(id int) error {
	return o.db.Model(&domain.Order{}).Where("id = ?", id).Update("eliminated", true).Error
}
