package usecase

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type CartUseCase interface {
	CreateCart(c *gin.Context)
	GetAllCarts(c *gin.Context)
	GetTopProducts(c *gin.Context)
	GetCartsByBuyerID(c *gin.Context)
	GetFinalPrice(c *gin.Context)
	PayTheCart(c *gin.Context)
}

type cartUseCase struct {
	repo repository.CartRepository
}

func NewCartUseCase(repo repository.CartRepository) CartUseCase {
	return &cartUseCase{repo: repo}
}

func (uc *cartUseCase) CreateCart(c *gin.Context) {
	var cart domain.Cart
	if err := c.ShouldBindJSON(&cart); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Formato de carrito inválido"})
		return
	}

	if err := uc.repo.CreateCart(cart); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, gin.H{"message": "Carrito creado"})
}

func (uc *cartUseCase) GetAllCarts(c *gin.Context) {
	carts, err := uc.repo.GetAllCarts()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, carts)
}

func (uc *cartUseCase) GetTopProducts(c *gin.Context) {
	quantity := c.Param("quantity")
	if quantity == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Cantidad inválida"})
		return
	}
	topProducts, err := uc.repo.GetTopProducts(quantity)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Cantidad inválida"})
		return
	}
	c.IndentedJSON(http.StatusOK, topProducts)
}

func (uc *cartUseCase) GetCartsByBuyerID(c *gin.Context) {
	buyerID := c.Param("id")
	if buyerID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID de comprador inválido"})
		return
	}

	carts, err := uc.repo.GetCartsByBuyerID(buyerID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener los carritos del comprador"})
		return
	}

	c.IndentedJSON(http.StatusOK, carts)
}

func (uc *cartUseCase) GetFinalPrice(c *gin.Context) {
	buyerID := c.Param("id")
	if buyerID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID de comprador inválido"})
		return
	}
	finalPrice, err := uc.repo.GetFinalPrice(buyerID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al calcular el precio final"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": finalPrice})
}

func (uc *cartUseCase) PayTheCart(c *gin.Context) {
	buyerID := c.Param("id")
	if buyerID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID de comprador inválido"})
		return
	}

	balance, err := uc.repo.GetBuyerBalance(buyerID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener el saldo"})
		return
	}

	finalPrice, err := uc.repo.GetFinalPrice(buyerID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al calcular el precio final"})
		return
	}

	if balance < finalPrice {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Saldo insuficiente"})
		return
	}

	err = uc.repo.PayTheCart(buyerID, finalPrice)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al procesar el pago del carrito"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Pago del carrito procesado con éxito"})
}
