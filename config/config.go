package config

import (
	"fmt"

	"github.com/spf13/viper"
)

func init() {
	fmt.Println("starting with viper")
	viper.SetConfigType("yaml")
	viper.SetConfigName("config")
	viper.AddConfigPath(".")

	viper.ReadInConfig()
}

type config struct {
	ListenAddress string
	PuppetDB      struct {
		Host string
		Port uint64
	}
}

func GetConfig() (config, error) {
	var c config
	err := viper.Unmarshal(&c)
	return c, err
}

func (c *config) GetPuppetDbAddress() string {
	return fmt.Sprintf("http://%s:%d", c.PuppetDB.Host, c.PuppetDB.Port)
}
