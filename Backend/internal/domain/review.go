package domain

type Review struct {
	ID      int     `gorm:"primaryKey"`
	Rating  int     `gorm:"not null"`
	Comment string  `gorm:"not null"`
	BuyerID int     `gorm:"not null"`
	Buyer   Usuario `gorm:"foreignKey:BuyerID;references:ID;not null"`
}
