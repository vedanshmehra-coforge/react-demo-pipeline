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
                // Installs dependencies and verifies project builds cleanly
                echo 'Building React/Vite Application...'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker container image...'
                sh 'docker build -t my-demo-app:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Stopping old container (if running) and starting new one...'
                sh 'docker stop my-running-app || true'
                sh 'docker rm my-running-app || true'
                sh 'docker run -d --name my-running-app -p 3000:80 my-demo-app:latest'
            }
        }
    }
}