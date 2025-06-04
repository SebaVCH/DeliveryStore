package domain

import "time"

type Transaction struct {
	ID        int       `gorm:"primaryKey"`
	Amount    float64   `gorm:"not null"`
	Date      time.Time `gorm:"not null"`
	BuyerID   int       `gorm:"not null"`
	Buyer     Usuario   `gorm:"foreignKey:BuyerID;references:ID"`
	SellerID  int       `gorm:"not null"`
	Seller    Usuario   `gorm:"foreignKey:SellerID;references:ID"`
	ProductID int       `gorm:"not null,default:0"`
	Product   Product   `gorm:"foreignKey:ProductID;references:ID"`
}
