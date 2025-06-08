package domain

import "time"

type Shipping struct {
	ID         int       `gorm:"primaryKey"`
	Status     string    `gorm:"not null"`
	Date       time.Time `gorm:"not null"`
	DeliveryID int       `gorm:"not null"`
	Delivery   Usuario   `gorm:"foreignKey:DeliveryID;references:ID"`
	BuyerID    int       `gorm:"not null"`
	Buyer      Usuario   `gorm:"foreignKey:BuyerID;references:ID"`
}
