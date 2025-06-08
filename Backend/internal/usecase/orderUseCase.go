package usecase

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type OrderUseCase interface {
	CreateOrder(c *gin.Context)
	GetAllOrders(c *gin.Context)
	SetEliminated(c *gin.Context)
	GetNotEliminatedOrders(c *gin.Context)
}

type orderUseCase struct {
	orderRepo repository.OrderRepository
}

func NewOrderUseCase(repo repository.OrderRepository) OrderUseCase {
	return &orderUseCase{
		orderRepo: repo,
	}
}

func (o orderUseCase) CreateOrder(c *gin.Context) {
	var order domain.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear pedido"})
		return
	}

	err := o.orderRepo.CreateOrder(order)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear pedido"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Pedido creado correctamente"})
}

func (o orderUseCase) GetAllOrders(c *gin.Context) {
	var orders []domain.Order
	orders, err := o.orderRepo.GetAllOrders()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener pedidos"})
		return
	}
	c.IndentedJSON(http.StatusOK, orders)
}

func (o orderUseCase) GetNotEliminatedOrders(c *gin.Context) {
	var orders []domain.Order
	orders, err := o.orderRepo.GetNotEliminatedOrders()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener pedidos"})
		return
	}
	c.IndentedJSON(http.StatusOK, orders)
}

func (o orderUseCase) SetEliminated(c *gin.Context) {
	idSTR := c.Param("id")
	id, err := strconv.Atoi(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}

	err = o.orderRepo.SetEliminated(id)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al eliminar pedido"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Pedido eliminado correctamente"})
}
