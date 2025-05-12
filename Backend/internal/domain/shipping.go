package domain

import "time"

type Shipping struct {
	ID         int            `gorm:"primaryKey"`
	Status     string         `gorm:"not null"`
	OrderID    int            `gorm:"not null"`
	Order      Order          `gorm:"foreignKey:OrderID;references:ID"`
	Date       time.Time      `gorm:"not null"`
	DeliveryID int            `gorm:"not null"`
	Delivery   DeliveryPerson `gorm:"foreignKey:DeliveryID;references:ID"`
}
