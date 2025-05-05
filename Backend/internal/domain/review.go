package domain

type Review struct {
	ID       int    `gorm:"primaryKey"`
	Rating   int    `gorm:"not null"`
	Comment  string `gorm:"not null"`
	SellerID int    `gorm:"not null"`
	Seller   Seller `gorm:"foreignKey:SellerID;references:ID"`
	BuyerID  int    `gorm:"not null"`
	Buyer    Buyer  `gorm:"foreignKey:BuyerID;references:ID"`
}
