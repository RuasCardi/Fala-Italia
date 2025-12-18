#!/bin/bash

# Inicializa o repositório git, se ainda não existir
if [ ! -d ".git" ]; then
  git init
fi

# Adiciona todos os arquivos e faz commit
git add .
git commit -m "Initial commit"

# Adiciona o repositório remoto (ignora erro se já existir)
git remote add origin https://github.com/RuasCardi/Fala-Italia.git 2>/dev/null

# Define a branch principal como main
git branch -M main

# Faz pull para evitar conflitos caso o repositório remoto já tenha arquivos
git pull origin main --allow-unrelated-histories

# Faz push para o repositório remoto
git push -u origin main
