# Variables
APP_NAME=trailblazer2
DOCKER_IMAGE=react-app
HEROKU_REGISTRY=registry.heroku.com
HEROKU_PROCESS=web
LOCAL_PORT=3000
HEROKU_PORT=80

# Default target: show help
.PHONY: help
help:
	@echo "Makefile for managing Heroku Docker deployments"
	@echo ""
	@echo "Usage:"
	@echo "  make login       Log in to Heroku"
	@echo "  make container-login Log in to Heroku Container Registry"
	@echo "  make build       Build the Docker image"
	@echo "  make tag         Tag the Docker image for Heroku"
	@echo "  make push        Push the Docker image to Heroku's container registry"
	@echo "  make release     Release the Docker image to Heroku"
	@echo "  make deploy      Full deployment: login, container-login, build, tag, push, and release"
	@echo "  make logs        View Heroku logs"
	@echo "  make open        Open the app in the browser"
	@echo "  make local       Run the app locally on port $(LOCAL_PORT)"
	@echo ""

# Log in to Heroku
.PHONY: login
login:
	heroku login

# Log in to Heroku Container Registry
.PHONY: container-login
container-login:
	heroku container:login

# Build the Docker image
.PHONY: build
build:
	docker build -t $(DOCKER_IMAGE) .

# Tag the Docker image for Heroku
.PHONY: tag
tag:
	docker tag $(DOCKER_IMAGE) $(HEROKU_REGISTRY)/$(APP_NAME)/$(HEROKU_PROCESS)

# Push the Docker image to Heroku
.PHONY: push
push:
	docker push $(HEROKU_REGISTRY)/$(APP_NAME)/$(HEROKU_PROCESS)

# Release the Docker image to Heroku
.PHONY: release
release:
	heroku container:release $(HEROKU_PROCESS) --app $(APP_NAME)

# Full deployment: login, container-login, build, tag, push, and release
.PHONY: deploy
deploy: login container-login build tag push release

# View Heroku logs
.PHONY: logs
logs:
	heroku logs --tail --app $(APP_NAME)

# Open the app in the browser
.PHONY: open
open:
	heroku open --app $(APP_NAME)

# Run the app locally
.PHONY: local
local:
	docker run -p $(LOCAL_PORT):$(HEROKU_PORT) $(DOCKER_IMAGE)
