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
       sh 'docker build --platform linux/amd64 -t student-task-manager:latest .'
    }
}
        stage('Push Docker Image to ECR') {
    steps {
        withCredentials([
            [$class: 'AmazonWebServicesCredentialsBinding',
             credentialsId: 'aws-ecr-credentials']
        ]) {
            sh '''
                aws ecr get-login-password --region ap-south-1 | \
                docker login --username AWS --password-stdin \
                825475389480.dkr.ecr.ap-south-1.amazonaws.com

                docker tag student-task-manager:latest \
                825475389480.dkr.ecr.ap-south-1.amazonaws.com/student-task-manager:latest

                docker push \
                825475389480.dkr.ecr.ap-south-1.amazonaws.com/student-task-manager:latest
            '''
        }
    }
}
    }
}