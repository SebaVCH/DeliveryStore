package domain

type PRRelation struct {
	ID         int     `gorm:"primaryKey"`
	ProductID  int     `gorm:"not null"`
	Product    Product `gorm:"foreignKey:ProductID;references:ID"`
	ReviewID   int     `gorm:"not null"`
	Review     Review  `gorm:"foreignKey:ReviewID;references:ID"`
	Eliminated bool    `gorm:"not null"`
}
