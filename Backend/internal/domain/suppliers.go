package domain

type Supplier struct {
	ID          int     `gorm:"primaryKey"`
	Name        string  `gorm:"not null"`
	Description string  `gorm:"not null"`
	SellerID    int     `gorm:"not null"`
	Seller      Usuario `gorm:"foreignKey:SellerID;references:ID"`
	Eliminated  bool    `gorm:"not null"`
}
