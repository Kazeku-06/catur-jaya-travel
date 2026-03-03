.PHONY: dev backend frontend install setup help clean-ports

help:
	@echo "Available commands:"
	@echo "  make dev      - Run both Backend and Frontend concurrently"
	@echo "  make backend  - Run Backend server (Laravel)"
	@echo "  make frontend - Run Frontend server (Vite)"
	@echo "  make install  - Install dependencies for both (Wajib Pertama Kali)"
	@echo "  make setup    - Setup project (copy .env, migrate, key generate)"

clean-ports:
	@echo "=== 🧹 Cleaning Ports 8000 & 3000 & 5173... ==="
	@npx -y kill-port 8000 3000 5173 2>/dev/null || true

dev: clean-ports
	@echo "=== 🚀 Starting Papal Application (Laravel + Vite) with FIXED PORTS... ==="
	@BACKEND_PORT=8000 ; \
	FRONTEND_PORT=5173 ; \
	IP_ADDRESS="103.144.209.103" ; \
	echo "Backend will run on port $$BACKEND_PORT" ; \
	echo "Frontend will run on port $$FRONTEND_PORT" ; \
	echo "HINT: Open http://$$IP_ADDRESS:$$FRONTEND_PORT in your browser." ; \
	npx -y concurrently \
		--names "BACKEND,FRONTEND" \
		--prefix-colors "green,cyan" \
		"cd backend && php artisan serve --host=0.0.0.0 --port=$$BACKEND_PORT" \
		"cd frontend && VITE_API_BASE_URL=http://$$IP_ADDRESS:$$BACKEND_PORT/api/v1 npm run dev -- --host 0.0.0.0 --port $$FRONTEND_PORT"

backend:
	@echo "Starting Backend on http://0.0.0.0:8000..."
	@cd backend && php artisan serve --host=0.0.0.0 --port=8000

frontend:
	@echo "Starting Frontend on port 5173..."
	@cd frontend && npm run dev -- --host 0.0.0.0

install:
	@echo "=== 📦 Installing Backend Dependencies... ==="
	@cd backend && composer install
	@echo "=== 📦 Installing Frontend Dependencies... ==="
	@cd frontend && npm install
	@echo "=== ✅ All Dependencies Installed! ==="

setup:
	@echo "Setting up Backend..."
	@cd backend && cp -n .env.example .env || true
	@cd backend && php artisan key:generate
	@cd backend && php artisan migrate
	@echo "Setup complete."
