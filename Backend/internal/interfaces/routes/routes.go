package routes

import (
	"github.com/SebaVCH/DeliveryStore/internal/interfaces/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORSMiddleware())

	SetupUserRouter(r)
	SetupProductRouter(r)
	SetupSupplierRouter(r)
	SetupPresidentRouter(r)
	SetupOrderRouter(r)
	SetupShippingRouter(r)

	return r
}
