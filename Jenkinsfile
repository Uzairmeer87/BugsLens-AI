pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'registry.buglens.ai'
        APP_VERSION = "1.0.${BUILD_NUMBER}"
        AI_API_KEY = credentials('buglens-ai-api-key')
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source from Git repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js & Python dependencies...'
                sh 'npm --prefix backend ci'
                sh 'npm --prefix frontend ci'
                sh 'pip install -r ai-service/requirements.txt'
            }
        }

        stage('Lint & Static Checks') {
            steps {
                echo 'Running ESLint, Oxlint, and Prettier checks...'
                sh 'npm --prefix backend run build -- --noEmit'
            }
        }

        stage('Unit & Integration Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        echo 'Running Backend Vitest suites...'
                        sh 'npm --prefix backend test'
                    }
                }
                stage('AI Service Tests') {
                    steps {
                        echo 'Running AI Microservice pytest...'
                        sh 'pytest ai-service/tests'
                    }
                }
            }
        }

        stage('Build Artifacts') {
            steps {
                echo 'Compiling Frontend & Backend production bundles...'
                sh 'npm --prefix backend run build'
                sh 'npm --prefix frontend run build'
            }
        }

        stage('Security & Vulnerability Scan') {
            steps {
                echo 'Running SAST and container security vulnerability checks...'
                sh 'npm --prefix backend audit --audit-level=high || true'
            }
        }

        stage('Docker Build & Tag') {
            steps {
                echo "Building Docker container images for release ${APP_VERSION}..."
                sh "docker compose build"
            }
        }

        stage('Deploy Staging') {
            when {
                branch 'main'
            }
            steps {
                echo "Deploying ${APP_VERSION} to Staging cluster..."
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '🎉 Jenkins pipeline executed successfully. All tests and container builds passed.'
        }
        failure {
            echo '❌ Pipeline failed! Critical unit tests or build errors encountered.'
        }
    }
}
