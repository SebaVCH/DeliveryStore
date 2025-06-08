package controllers

import (
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

type SupplierController struct {
	supplierUseCase usecase.SupplierUseCase
}

func NewSupplierController(useCase usecase.SupplierUseCase) *SupplierController {
	return &SupplierController{
		supplierUseCase: useCase,
	}
}

func (ctrl *SupplierController) CreateSupplier(c *gin.Context) {
	ctrl.supplierUseCase.CreateSupplier(c)
}

func (ctrl *SupplierController) GetAllSuppliers(c *gin.Context) {
	ctrl.supplierUseCase.GetAll(c)
}

func (ctrl *SupplierController) GetSuppliersBySellerID(c *gin.Context) {
	ctrl.supplierUseCase.GetSuppliersBySellerID(c)
}

func (ctrl *SupplierController) RemoveSupplier(c *gin.Context) {
	ctrl.supplierUseCase.DeleteSupplier(c)
}
func (ctrl *SupplierController) UpdateSupplier(c *gin.Context) {
	ctrl.supplierUseCase.UpdateSupplier(c)
}

func (ctrl *SupplierController) CreateSupplierProduct(c *gin.Context) {
	ctrl.supplierUseCase.CreateSupplierProduct(c)
}

func (ctrl *SupplierController) GetSupplierProducts(c *gin.Context) {
	ctrl.supplierUseCase.GetSupplierProducts(c)
}
