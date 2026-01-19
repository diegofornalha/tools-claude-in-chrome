#!/bin/bash
# Script para iniciar o servidor de histórico

echo "🚀 Iniciando servidor de histórico..."
echo "📁 Arquivo: /Users/2a/.claude/history.jsonl"
echo "🌐 URL: http://localhost:3000/history.jsonl"
echo ""

node /Users/2a/.claude/history-server.js
