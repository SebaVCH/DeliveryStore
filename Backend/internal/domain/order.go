package domain

import "time"

type Order struct {
	ID         int       `gorm:"primaryKey"`
	Date       time.Time `gorm:"not null"`
	Status     string    `gorm:"not null"`
	BuyerID    int       `gorm:"not null"`
	Buyer      Usuario   `gorm:"foreignKey:BuyerID;references:ID"`
	SellerID   int       `gorm:"not null"`
	Seller     Usuario   `gorm:"foreignKey:SellerID;references:ID"`
	Eliminated bool      `gorm:"not null"`
}
