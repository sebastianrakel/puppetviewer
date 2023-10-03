package main

import (
	"embed"
)

//go:embed ui/puppetviewer-frontend/dist/spa
var uiFS embed.FS
