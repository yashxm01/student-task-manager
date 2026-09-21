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
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv(
                        installationName: 'SonarQube',
                        credentialsId: 'sonarqube-token'
                    ) {
                        withEnv(["SCANNER_HOME=${scannerHome}"]) {
                            sh '''
                                set +x
                                "$SCANNER_HOME/bin/sonar-scanner" \
                                  -Dsonar.token="$SONAR_AUTH_TOKEN"
                            '''
                        }
                    }
                }
            }
        }
        stage('Build Docker Image') {
    steps {
        sh 'docker build -t student-task-manager:latest .'
    }
}
        stage('Test AWS Connection') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding',
                     credentialsId: 'aws-ecr-credentials']
                ]) {
                    sh 'aws sts get-caller-identity'
                }
            }
        }
    }
}