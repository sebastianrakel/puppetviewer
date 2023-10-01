ui:
	cd ui/puppet-viewer && \
	yarn quasar build
server: ui
	go build -o puppetviewer
