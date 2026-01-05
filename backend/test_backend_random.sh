#!/bin/bash

# ---------------------------
# Générer un utilisateur aléatoire
# ---------------------------
USER_PREFIX="user"
RAND_SUFFIX=$(openssl rand -hex 3)   # 6 caractères hexadécimaux
USERNAME="${USER_PREFIX}${RAND_SUFFIX}"
EMAIL="${USERNAME}@test.com"
PASSWORD="123456"

echo "Utilisateur généré : $USERNAME, Email : $EMAIL"

# ---------------------------
# Test /register
# ---------------------------
echo "==== 1️⃣ Test /register ===="
REGISTER_RESPONSE=$(curl -s -X POST http://127.0.0.1:5000/api/auth/register \
-H "Content-Type: application/json" \
-d "{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Pas de token reçu. Vérifie le backend."
  echo "Réponse /register : $REGISTER_RESPONSE"
  exit 1
else
  echo "✅ Token reçu."
fi

# ---------------------------
# Test /login
# ---------------------------
echo "==== 2️⃣ Test /login ===="
LOGIN_RESPONSE=$(curl -s -X POST http://127.0.0.1:5000/api/auth/login \
-H "Content-Type: application/json" \
-d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$LOGIN_TOKEN" == "null" ] || [ -z "$LOGIN_TOKEN" ]; then
  echo "❌ Pas de token reçu lors du login."
  echo "Réponse /login : $LOGIN_RESPONSE"
  exit 1
else
  echo "✅ Token login reçu."
fi

# ---------------------------
# Test /profile
# ---------------------------
echo "==== 3️⃣ Test /profile ===="
PROFILE_RESPONSE=$(curl -s -X GET http://127.0.0.1:5000/api/auth/profile \
-H "Authorization: Bearer $LOGIN_TOKEN" \
-H "Content-Type: application/json")

echo "Réponse /profile : $PROFILE_RESPONSE"
