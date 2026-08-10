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
                bat 'npm install --legacy-peer-deps'
                bat 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker container image...'
                bat '"C:\\Users\\vedansh\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t my-demo-app:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Stopping old container (if running) and starting new one...'
                bat '"C:\\Users\\vedansh\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" rm -f my-running-app || exit 0'
                // Port mapping is now 3000:3000
                bat '"C:\\Users\\vedansh\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" run -d --name my-running-app -p 3000:3000 my-demo-app:latest'
            }
        }
    }
}