package usecase

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type ShippingUseCase interface {
	CreateShipping(c *gin.Context)
	UpdateShipping(c *gin.Context)
	GetCompletedByDeliveryID(c *gin.Context)
	GetIncompletedByDeliveryID(c *gin.Context)
	UndeliveredShipments(c *gin.Context)
	DeliveredShipments(c *gin.Context)
}

type shippingUseCase struct {
	shippingRepository repository.ShippingRepository
}

func NewShippingUseCase(repo repository.ShippingRepository) ShippingUseCase {
	return &shippingUseCase{
		shippingRepository: repo,
	}
}

func (s shippingUseCase) CreateShipping(c *gin.Context) {
	var shipping domain.Shipping

	if err := c.ShouldBindJSON(&shipping); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear envio"})
		return
	}
	shipping.DeliveryID = 0
	if err := s.shippingRepository.CreateShipping(shipping); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear envio"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Envio creado correctamente"})
}

func (s shippingUseCase) UndeliveredShipments(c *gin.Context) {
	shippings, err := s.shippingRepository.UndeliveredShipments()

	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener envios"})
		return
	}

	c.IndentedJSON(http.StatusOK, shippings)
}
func (s shippingUseCase) DeliveredShipments(c *gin.Context) {
	shippings, err := s.shippingRepository.DeliveredShipments()

	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener envios"})
		return
	}

	c.IndentedJSON(http.StatusOK, shippings)
}

func (s shippingUseCase) UpdateShipping(c *gin.Context) {
	idSTR := c.Param("id")
	id, err := strconv.Atoi(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}

	var shipping domain.Shipping

	if err := s.shippingRepository.UpdateShipping(id, shipping); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al actualizar envio"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Envio actualizado correctamente"})
}

func (s shippingUseCase) GetCompletedByDeliveryID(c *gin.Context) {
	deliveryIDSTR := c.Param("id")
	deliveryID, err := strconv.Atoi(deliveryIDSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID de entrega inválido"})
		return
	}

	shipping, err := s.shippingRepository.GetCompletedByDeliveryID(deliveryID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener envio por ID de entrega"})
		return
	}

	c.IndentedJSON(http.StatusOK, shipping)
}
func (s shippingUseCase) GetIncompletedByDeliveryID(c *gin.Context) {
	deliveryIDSTR := c.Param("id")
	deliveryID, err := strconv.Atoi(deliveryIDSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID de entrega inválido"})
		return
	}

	shipping, err := s.shippingRepository.GetIncompletedByDeliveryID(deliveryID)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener envio por ID de entrega"})
		return
	}

	c.IndentedJSON(http.StatusOK, shipping)
}
