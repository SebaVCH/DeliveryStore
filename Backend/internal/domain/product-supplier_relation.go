package domain

type PSRelation struct {
	ID         int      `gorm:"primaryKey"`
	ProductID  int      `gorm:"not null"`
	SupplierID int      `gorm:"not null"`
	Product    Product  `gorm:"foreignKey:ProductID;references:ID"`
	Supplier   Supplier `gorm:"foreignKey:SupplierID;references:ID"`
	Eliminated bool     `gorm:"not null"`
}
