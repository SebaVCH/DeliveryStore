package usecase

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type ProductUseCase interface {
	CreateProduct(c *gin.Context)
	GetAllProducts(c *gin.Context)
	GetProductsBySellerID(c *gin.Context)
	RemoveProduct(c *gin.Context)
	UpdateProduct(c *gin.Context)
	GetProductsBySellerID(c *gin.Context)
}

type productUseCase struct {
	productRepo repository.ProductRepository
}

func NewProductUseCase(repo repository.ProductRepository) ProductUseCase {
	return &productUseCase{
		productRepo: repo,
	}
}

func (p productUseCase) CreateProduct(c *gin.Context) {
	var product domain.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear producto"})
		return
	}

	if err := p.productRepo.CreateProduct(product); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear producto"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Producto creado correctamente"})
}

func (p productUseCase) GetAllProducts(c *gin.Context) {
	products, err := p.productRepo.GetAllProducts()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener productos"})
		return
	}
	c.IndentedJSON(http.StatusOK, products)
}
func (p productUseCase) GetProductsBySellerID(c *gin.Context) {
	idSTR := c.Param("id")
	id, err := strconv.Atoi(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}
	products, err := p.productRepo.GetProductsBySellerID(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener productos"})
		return
	}
	c.IndentedJSON(http.StatusOK, products)
}

func (p productUseCase) GetProductsBySellerID(c *gin.Context) {
	idSTR := c.Param("id")
	id, err := strconv.Atoi(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}

	products, err := p.productRepo.GetProductsBySellerID(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener productos"})
		return
	}
	c.IndentedJSON(http.StatusOK, products)
}

func (p productUseCase) RemoveProduct(c *gin.Context) {
	idSTR := c.Param("id")
	id, err := strconv.Atoi(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}
	if err := p.productRepo.DeleteProduct(id); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al eliminar producto"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Producto eliminado correctamente"})
}

func (p productUseCase) UpdateProduct(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}

	var product domain.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Datos inválidos para actualizar"})
		return
	}

	if err := p.productRepo.UpdateProduct(id, product); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al actualizar producto"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Producto actualizado correctamente"})
}
