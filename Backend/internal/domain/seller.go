package domain

type Seller struct {
	ID        int     `gorm:"primaryKey"`
	StoreName string  `gorm:"not null"`
	Direction string  `gorm:"not null"`
	Email     string  `gorm:"not null"`
	User      Usuario `gorm:"foreignKey:Email;references:Email"`
	Reviews   []Review
}
