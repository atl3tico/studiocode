#!/bin/bash
if [ "$#" -ne 2 ]; then echo "Uso: $0 <nombre-cliente> <dominio.com>"; exit 1; fi
CLIENT_NAME=$1
DOMAIN=$2
BASE_PATH="clientes/landing-$CLIENT_NAME"

if [ -d "$BASE_PATH" ]; then echo "Error: El directorio $BASE_PATH ya existe."; exit 1; fi

echo "Creando proyecto para $CLIENT_NAME..."
mkdir -p "$BASE_PATH"

# Copia solo archivos necesarios, evitando carpetas .git, .astro, node_modules y otros proyectos
rsync -av --exclude='.git' --exclude='.astro' --exclude='node_modules' --exclude='desarrollo' desarrollo/landing-base/ "$BASE_PATH/"

cd "$BASE_PATH"
git init
echo "# $CLIENT_NAME Landing - $DOMAIN" > README.md
cat <<EFE > .env.local
PUBLIC_STORE_NAME="$CLIENT_NAME"
PUBLIC_DOMAIN="https://$DOMAIN"
EFE

npm install --legacy-peer-deps
echo "Proyecto creado en $BASE_PATH"
