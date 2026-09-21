pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    def scannerHome = tool 'SonarScanner'
                    sh "${scannerHome}/bin/sonar-scanner"
                }
            }
        }
    }
}