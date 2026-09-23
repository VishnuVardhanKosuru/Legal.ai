#!/bin/bash
# ==============================================================================
# Legal.ai — Google Cloud Run Automated Deployment Script
# ==============================================================================

set -e

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
REGION="us-central1"
SERVICE_NAME="legal-ai"

if [ -z "$PROJECT_ID" ]; then
  echo "⚠️ Google Cloud Project ID not set. Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "🚀 Deploying Legal.ai to Google Cloud Run (Project: $PROJECT_ID, Region: $REGION)..."

# 1. Enable required GCP service APIs
echo "📦 Enabling required Google Cloud APIs..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  --project="$PROJECT_ID"

# 2. Build and Deploy container via Cloud Build
echo "🏗️ Building container and deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production"

echo "✅ Legal.ai successfully deployed to Google Cloud Run!"
gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)'
