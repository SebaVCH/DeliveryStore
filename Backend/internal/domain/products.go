package domain

type Product struct {
	ID           int     `gorm:"primaryKey"`
	Name         string  `gorm:"not null"`
	Description  string  `gorm:"not null"`
	IsVegan      bool    `gorm:"not null"`
	IsVegetarian bool    `gorm:"not null"`
	IsGlutenFree bool    `gorm:"not null"`
	Price        int     `gorm:"not null"`
	Calories     int     `gorm:"not null"`
	ReviewScore  float64 `gorm:"not null,default:0"`
	SellerID     int     `gorm:"not null"`
	User         Usuario `gorm:"foreignKey:SellerID;references:ID;not null"`
	Delivery     string  `gorm:"not null"`
}
