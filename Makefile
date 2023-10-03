.PHONY: ui
ui:
	cd ui/puppetviewer-frontend; \
	yarn quasar build

server:
	go build -o puppetviewer

all: ui server

clean:
	rm -Rf ui/puppetviewer-frontend/dist puppetviewer tmp/
