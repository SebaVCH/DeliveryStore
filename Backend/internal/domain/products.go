package domain

type Product struct {
	ID           int    `gorm:"primaryKey"`
	Name         string `gorm:"not null"`
	Description  string
	IsVegan      bool    `gorm:"not null"`
	IsVegetarian bool    `gorm:"not null"`
	IsGlutenFree bool    `gorm:"not null"`
	Price        int     `gorm:"not null"`
	Calories     int     `gorm:"not null"`
	Stock        int     `gorm:"not null"`
	Email        string  `gorm:"not null"`
	User         Usuario `gorm:"foreignKey:Email;references:Email"`
}
