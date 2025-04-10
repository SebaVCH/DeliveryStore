package main

import "github.com/SebaVCH/DeliveryStore/app"

func main() {

	if err := app.StartBackend(); err != nil {
		panic(err)
	}

}
