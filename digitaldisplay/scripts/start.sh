#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")/../.."

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Start the application
npm start