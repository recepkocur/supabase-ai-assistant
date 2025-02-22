# Last Update: 2025.02.18

# Yeniden Başlat
restart:
	docker compose -f docker-compose.dev.yml down -v --remove-orphans
	docker compose -f docker-compose.dev.yml up -d --build
	docker logs  api-trigger-ai-assistant-dev -f

# Build
build:
	docker compose -f docker-compose.dev.yml build

# Başlat
up:
	docker compose -f docker-compose.dev.yml up -d

# Kapat
down:
	docker compose -f docker-compose.dev.yml down -v --remove-orphans

# Temizle
clean:
	docker system prune -a

# Log
log:
	docker logs  api-trigger-ai-assistant-dev -f

# Dev Status
ps:
	docker ps --format "\nNames: {{.Names}} \nID: {{.ID}} \nSize: {{.Size}} \nStatus: {{.Status}} \nPorts: {{.Ports}} " | grep -A 3 "Names: api-trigger-ai-assistant-dev "

# Prod Status
ps-prod:
	docker ps --format "\nNames: {{.Names}} \nID: {{.ID}} \nSize: {{.Size}} \nStatus: {{.Status}} \nPorts: {{.Ports}} " | grep -A 3 "Names: api-trigger-ai-assistant "

# Düzeltme
fix:
	docker network create --driver bridge proxy
