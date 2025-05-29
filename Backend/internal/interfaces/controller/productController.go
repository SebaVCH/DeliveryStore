package controllers

import (
	"github.com/SebaVCH/DeliveryStore/internal/usecase"
	"github.com/gin-gonic/gin"
)

type ProductController struct {
	productUseCase usecase.ProductUseCase
}

func NewProductController(useCase usecase.ProductUseCase) *ProductController {
	return &ProductController{
		productUseCase: useCase,
	}
}

func (ctrl *ProductController) CreateProduct(c *gin.Context) {
	ctrl.productUseCase.CreateProduct(c)
}
func (ctrl *ProductController) GetAllProducts(c *gin.Context) {
	ctrl.productUseCase.GetAllProducts(c)
}

func (ctrl *ProductController) GetProductByID(c *gin.Context) {
	ctrl.productUseCase.GetProductByID(c)
}
func (ctrl *ProductController) GetProductsBySellerID(c *gin.Context) {
	ctrl.productUseCase.GetProductsBySellerID(c)
}

func (ctrl *ProductController) RemoveProduct(c *gin.Context) {
	ctrl.productUseCase.RemoveProduct(c)
}

func (ctrl *ProductController) UpdateProduct(c *gin.Context) {
	ctrl.productUseCase.UpdateProduct(c)
}
