pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
            }
        }

        stage('Build & Test Node App') {
            steps {
                echo 'Building React/Vite Application...'
                // Added --legacy-peer-deps to bypass the ESLint version conflict
                bat 'npm install --legacy-peer-deps'
                bat 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker container image...'
                bat 'docker build -t my-demo-app:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Stopping old container (if running) and starting new one...'
                // Using -f forces the removal even if it's running. || exit 0 prevents the build from failing if the container didn't exist yet.
                bat 'docker rm -f my-running-app || exit 0'
                bat 'docker run -d --name my-running-app -p 3000:80 my-demo-app:latest'
            }
        }
    }
}