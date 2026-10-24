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
        stage('Security Audit') {
    steps {
        sh 'npm audit --audit-level=high || true'
    }
}
        stage('Build Docker Image') {
    steps {
sh 'docker buildx build --platform linux/amd64 --provenance=false --sbom=false --load -t student-task-manager:latest .'  }
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
        
        stage('Deploy to EC2 Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'ec2-ssh-key-file', variable: 'EC2_SSH_KEY')]) {
                    sh '''
                        chmod 600 "$EC2_SSH_KEY"

                        ssh -i "$EC2_SSH_KEY" \
                            -o IdentitiesOnly=yes \
                            -o BatchMode=yes \
                            -o ConnectTimeout=10 \
                            -o StrictHostKeyChecking=accept-new \
                            ubuntu@3.110.136.125 '
                                set -e

                                ECR_PASSWORD=$(aws ecr get-login-password --region ap-south-1)

                                sudo k3s kubectl create secret docker-registry ecr-secret \
                                    --docker-server=825475389480.dkr.ecr.ap-south-1.amazonaws.com \
                                    --docker-username=AWS \
                                    --docker-password="$ECR_PASSWORD" \
                                    --dry-run=client -o yaml | sudo k3s kubectl apply -f -

                                sudo k3s kubectl set image deployment/student-task-manager \
                                    student-task-manager=825475389480.dkr.ecr.ap-south-1.amazonaws.com/student-task-manager:latest

                                sudo k3s kubectl rollout status deployment/student-task-manager --timeout=180s
                            '
                    '''
                }
            }
        }

    }
}