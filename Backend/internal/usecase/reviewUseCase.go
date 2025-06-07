package usecase

import (
	"github.com/SebaVCH/DeliveryStore/internal/domain"
	"github.com/SebaVCH/DeliveryStore/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type ReviewUseCase interface {
	CreateReview(c *gin.Context)
	GetAllReviews(c *gin.Context)
	DeleteReview(c *gin.Context)
}

type reviewUseCase struct {
	reviewRepo repository.ReviewRepository
}

func NewReviewUseCase(repo repository.ReviewRepository) ReviewUseCase {
	return &reviewUseCase{
		reviewRepo: repo,
	}
}

func (r reviewUseCase) CreateReview(c *gin.Context) {
	idSTR := c.Param("id")
	if idSTR == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}
	var review domain.Review

	if err := c.ShouldBindJSON(&review); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear reseña"})
		return
	}

	if err := r.reviewRepo.CreateReview(review, idSTR); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al crear reseña"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Reseña creada correctamente"})

}

func (r reviewUseCase) GetAllReviews(c *gin.Context) {
	reviews, err := r.reviewRepo.GetAllReviews()
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al obtener reseñas"})
		return
	}
	c.IndentedJSON(http.StatusOK, reviews)
}

func (r reviewUseCase) DeleteReview(c *gin.Context) {
	idSTR := c.Param("id")
	id, err := strconv.Atoi(idSTR)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID inválido"})
		return
	}
	if err := r.reviewRepo.DeleteReview(id); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Error al eliminar reseña"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Reseña eliminada correctamente"})
}
