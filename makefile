.PHONY: dev backend frontend install setup help

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev      - Run both Backend and Frontend concurrently"
	@echo "  make backend  - Run Backend server (Laravel)"
	@echo "  make frontend - Run Frontend server (Vite)"
	@echo "  make install  - Install dependencies for both"
	@echo "  make setup    - Setup project (copy .env, migrate, key generate)"

dev:
	@echo "Starting application..."
	@make -j2 backend frontend

backend:
	@echo "Starting Backend on http://localhost:8000..."
	@cd backend && php artisan serve

frontend:
	@echo "Starting Frontend..."
	@cd frontend && npm run dev

install:
	@echo "Installing Backend dependencies..."
	@cd backend && composer install --ignore-platform-req=ext-iconv --ignore-platform-req=ext-gd
	@echo "Installing Frontend dependencies..."
	@cd frontend && npm install

setup:
	@echo "Setting up Backend..."
	@cd backend && cp -n .env.example .env || true
	@cd backend && php artisan key:generate
	@cd backend && php artisan migrate
	@echo "Setup complete."
