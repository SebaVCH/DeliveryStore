package domain

type Cart struct {
	ID         int     `gorm:"primaryKey"`
	BuyerID    int     `gorm:"not null"`
	Buyer      Usuario `gorm:"foreignKey:BuyerID;references:ID;not null"`
	IDProduct  int     `gorm:"not null"`
	Product    Product `gorm:"foreignKey:IDProduct;references:ID;not null"`
	Quantity   int     `gorm:"not null"`
	FinalPrice float64 `gorm:"not null"`
	Payed      bool    `gorm:"not null"`
}
