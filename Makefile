.PHONY: ui
ui:
	cd ui/puppetviewer-frontend; \
	yarn quasar build

server:
	go build -o puppetviewer

develop-frontend:
	cd ui/puppetviewer-frontend; \
	VUE_APP_BACKEND_BASE_ADDRESS=http://localhost:8081 yarn quasar dev

develop-backend:
	air

all: ui server

clean:
	rm -Rf ui/puppetviewer-frontend/dist puppetviewer tmp/
