package domain

import "time"

type Order struct {
	ID            int       `gorm:"primaryKey"`
	PaymentMethod string    `gorm:"not null"`
	Date          time.Time `gorm:"not null"`
	Status        string    `gorm:"not null"`
	BuyerID       int       `gorm:"not null"`
	Buyer         Buyer     `gorm:"foreignKey:BuyerID;references:ID"`
	SellerID      int       `gorm:"not null"`
	Seller        Seller    `gorm:"foreignKey:SellerID;references:ID"`
}
