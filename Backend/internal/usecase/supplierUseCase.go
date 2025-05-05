package usecase

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type SupplierUseCase interface {
	GetAll(c *gin.Context)
	GetByID(c *gin.Context)
	CreateSupplier(c *gin.Context)
	DeleteSupplier(c *gin.Context)
	UpdateSupplier(c *gin.Context)
}

type supplierUseCase struct {
	supplierRepo repository.SupplierRepository
}

func NewSupplierUseCase(repo repository.SupplierRepository) SupplierUseCase {
	return &supplierUseCase{
		supplierRepo: repo,
	}
}

func (s supplierUseCase) GetAll(c *gin.Context) {
	suppliers, err := s.supplierRepo.GetAll()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener proveedores"})
		return
	}
	c.IndentedJSON(http.StatusOK, suppliers)
}

func (s supplierUseCase) GetByID(c *gin.Context) {
	idSTR := c.Param("id")
	id, err := strconv.Atoi(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}

	supplier, err := s.supplierRepo.GetByID(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener proveedor"})
		return
	}
	c.IndentedJSON(http.StatusOK, supplier)
}

func (s supplierUseCase) CreateSupplier(c *gin.Context) {
	var supplier domain.Supplier

	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear proveedor"})
		return
	}

	if err := s.supplierRepo.CreateSupplier(supplier); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear proveedor"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Proveedor creado correctamente"})
}

func (s supplierUseCase) DeleteSupplier(c *gin.Context) {
	idSTR := c.Param("id")
	id, err := strconv.Atoi(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}

	if err := s.supplierRepo.DeleteSupplier(id); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al eliminar proveedor"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Proveedor eliminado correctamente"})
}

func (s supplierUseCase) UpdateSupplier(c *gin.Context) {
	idSTR := c.Param("id")
	id, err := strconv.Atoi(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}

	var supplier domain.Supplier
	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al actualizar proveedor"})
		return
	}

	if err := s.supplierRepo.UpdateSupplier(id, supplier); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al actualizar proveedor"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Proveedor actualizado correctamente"})
}
