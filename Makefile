# Development
up:
	docker compose up -d

down:
	docker compose down

shell:
	docker compose exec app bash

# Production
up-prod:
	docker compose --env-file .env.production up -d

build-prod:
	docker compose --env-file .env.production -f docker-compose.production.yml build
