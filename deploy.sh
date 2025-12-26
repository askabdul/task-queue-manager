#!/bin/bash

# 🚀 Task Queue Manager - Deployment Script
# This script provides easy deployment options for the Task Queue Manager

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project info
PROJECT_NAME="Task Queue Manager"
BUILD_DIR="out"
BUILD_SIZE="840KB"

echo -e "${BLUE}🚀 ${PROJECT_NAME} Deployment Script${NC}"
echo -e "${GREEN}Build size: ${BUILD_SIZE} | Files ready for static hosting${NC}"
echo ""

# Check if out directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build directory '${BUILD_DIR}' not found!${NC}"
    echo -e "${YELLOW}Please run 'npm run build' first to generate the static files.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build directory found with optimized static files${NC}"
echo ""

# Deployment options menu
echo -e "${BLUE}Select deployment option:${NC}"
echo "1. 🌐 Vercel (Recommended)"
echo "2. 📡 Netlify"
echo "3. 🌊 Surge.sh"
echo "4. 🔥 Firebase Hosting"
echo "5. 📁 Local Server (for testing)"
echo "6. 📋 Show manual deployment instructions"
echo "7. 🐳 Docker container"
echo "0. ❌ Exit"
echo ""

read -p "Enter your choice (0-7): " choice

case $choice in
    1)
        echo -e "${BLUE}🌐 Deploying to Vercel...${NC}"
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}Installing Vercel CLI...${NC}"
            npm install -g vercel
        fi
        cd $BUILD_DIR
        echo -e "${GREEN}✨ Starting Vercel deployment...${NC}"
        vercel --prod
        cd ..
        echo -e "${GREEN}✅ Deployment complete! Your app is live on Vercel.${NC}"
        ;;

    2)
        echo -e "${BLUE}📡 Deploying to Netlify...${NC}"
        if ! command -v netlify &> /dev/null; then
            echo -e "${YELLOW}Installing Netlify CLI...${NC}"
            npm install -g netlify-cli
        fi
        echo -e "${GREEN}✨ Starting Netlify deployment...${NC}"
        netlify deploy --prod --dir=$BUILD_DIR
        echo -e "${GREEN}✅ Deployment complete! Your app is live on Netlify.${NC}"
        ;;

    3)
        echo -e "${BLUE}🌊 Deploying to Surge.sh...${NC}"
        if ! command -v surge &> /dev/null; then
            echo -e "${YELLOW}Installing Surge CLI...${NC}"
            npm install -g surge
        fi
        cd $BUILD_DIR
        echo -e "${YELLOW}💡 Tip: Choose a unique domain like 'my-task-queue-demo.surge.sh'${NC}"
        echo -e "${GREEN}✨ Starting Surge deployment...${NC}"
        surge .
        cd ..
        echo -e "${GREEN}✅ Deployment complete! Your app is live on Surge.${NC}"
        ;;

    4)
        echo -e "${BLUE}🔥 Setting up Firebase Hosting...${NC}"
        if ! command -v firebase &> /dev/null; then
            echo -e "${YELLOW}Installing Firebase CLI...${NC}"
            npm install -g firebase-tools
        fi

        # Create firebase.json if it doesn't exist
        if [ ! -f "firebase.json" ]; then
            echo -e "${YELLOW}Creating firebase.json configuration...${NC}"
            cat > firebase.json << EOF
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/_next/static/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
EOF
        fi

        echo -e "${GREEN}✨ Starting Firebase deployment...${NC}"
        firebase deploy
        echo -e "${GREEN}✅ Deployment complete! Your app is live on Firebase.${NC}"
        ;;

    5)
        echo -e "${BLUE}📁 Starting local server for testing...${NC}"
        cd $BUILD_DIR

        # Check for available server options
        if command -v python3 &> /dev/null; then
            echo -e "${GREEN}🐍 Using Python 3 HTTP server...${NC}"
            echo -e "${YELLOW}📱 Open http://localhost:8000 in your browser${NC}"
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            echo -e "${GREEN}🐍 Using Python 2 HTTP server...${NC}"
            echo -e "${YELLOW}📱 Open http://localhost:8000 in your browser${NC}"
            python -m SimpleHTTPServer 8000
        elif command -v node &> /dev/null; then
            if command -v npx &> /dev/null; then
                echo -e "${GREEN}📦 Using Node.js serve package...${NC}"
                echo -e "${YELLOW}📱 Open http://localhost:3000 in your browser${NC}"
                npx serve -s . -l 3000
            else
                echo -e "${RED}❌ Please install 'serve' package: npm install -g serve${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ No suitable server found. Please install Python or Node.js.${NC}"
            exit 1
        fi
        cd ..
        ;;

    6)
        echo -e "${BLUE}📋 Manual Deployment Instructions:${NC}"
        echo ""
        echo -e "${GREEN}📁 Static File Hosting:${NC}"
        echo "1. Copy all files from '${BUILD_DIR}/' to your web server"
        echo "2. Configure your server to redirect all routes to index.html"
        echo ""
        echo -e "${GREEN}🌐 Popular Hosting Services:${NC}"
        echo ""
        echo -e "${YELLOW}GitHub Pages:${NC}"
        echo "• Upload ${BUILD_DIR}/* to gh-pages branch"
        echo "• Enable Pages in repository settings"
        echo ""
        echo -e "${YELLOW}AWS S3:${NC}"
        echo "• Create bucket with static website hosting"
        echo "• Upload ${BUILD_DIR}/* to bucket root"
        echo "• Set index.html as index document"
        echo ""
        echo -e "${YELLOW}Cloudflare Pages:${NC}"
        echo "• Connect your repository"
        echo "• Set build command: npm run build"
        echo "• Set output directory: ${BUILD_DIR}"
        echo ""
        echo -e "${GREEN}📖 Full instructions: See HOSTING.md${NC}"
        ;;

    7)
        echo -e "${BLUE}🐳 Creating Docker container...${NC}"

        # Create Dockerfile
        cat > Dockerfile << EOF
FROM nginx:alpine

# Copy the build files to nginx html directory
COPY ${BUILD_DIR}/ /usr/share/nginx/html/

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri.html \$uri/ /index.html; \
    } \
    location /_next/static/ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

        echo -e "${GREEN}✨ Building Docker image...${NC}"
        docker build -t task-queue-manager .

        echo -e "${GREEN}🚀 Running Docker container...${NC}"
        echo -e "${YELLOW}📱 Open http://localhost:8080 in your browser${NC}"
        echo -e "${YELLOW}Press Ctrl+C to stop the container${NC}"
        docker run -p 8080:80 --rm task-queue-manager
        ;;

    0)
        echo -e "${YELLOW}👋 Deployment cancelled.${NC}"
        exit 0
        ;;

    *)
        echo -e "${RED}❌ Invalid option. Please choose 0-7.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo -e "${BLUE}💡 Your Task Queue Manager is ready to showcase your development skills!${NC}"
echo ""
echo -e "${YELLOW}📊 Features included:${NC}"
echo "✅ Real-time dashboard with mock data"
echo "✅ Queue management interface"
echo "✅ Job creation and monitoring"
echo "✅ Worker management system"
echo "✅ System alerts and notifications"
echo "✅ Dark/Light theme toggle"
echo "✅ Responsive design for all devices"
echo ""
echo -e "${GREEN}Perfect for portfolio demonstrations! 🚀${NC}"
