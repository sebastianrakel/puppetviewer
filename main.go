package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sebastianrakel/puppetviewer/config"
	"github.com/sebastianrakel/puppetviewer/puppetdb"
)

func main() {
	cfg, err := config.GetConfig()
	if err != nil {
		panic(err)
	}

	fmt.Printf("%#v", cfg)

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST")
		c.Header("Access-Control-Allow-Headers", "*")

		if c.Request.Method == http.MethodOptions {
			fmt.Println("returning cors")
			c.Status(http.StatusNoContent)
			c.Done()
			return
		}

		c.Next()
	})

	r.POST("/pdb/query", func(c *gin.Context) {
		type QueryRequest struct {
			Query string `json:"query"`
		}

		var queryRequest QueryRequest
		c.BindJSON(&queryRequest)

		dbClient := puppetdb.NewClient()

		fmt.Printf("Query: %s\n", queryRequest.Query)

		res, err := dbClient.Query(queryRequest.Query)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.JSON(http.StatusOK, res)
	})

	r.GET("/pdb/fact-names", func(c *gin.Context) {
		dbClient := puppetdb.NewClient()

		res, err := dbClient.GetFactNames()
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.JSON(http.StatusOK, res)
	})

	r.GET("/pdb/event-counts", func(c *gin.Context) {
		dbClient := puppetdb.NewClient()

		res, err := dbClient.GetEventCounts(c.Request.URL.Query())

		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}

		c.JSON(http.StatusOK, res)
	})

	r.GET("/pv/query/saved", func(c *gin.Context) {
		type SavedQuery struct {
			Name  string `json:"name"`
			Query string `json:"query"`
		}

		result := []SavedQuery{
			{
				Name:  "get all facts",
				Query: "facts {}",
			},
		}

		c.JSON(http.StatusOK, result)
	})

	r.Run()
}
