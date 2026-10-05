pipeline {
    agent any

    environment {
        // Tên của Docker image
        IMAGE_NAME = 'english-app-react'
        // Cổng trên máy host để map vào container (tránh 8080 vì Jenkins đang dùng)
        HOST_PORT = '8000'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                // Nếu bạn dùng Git, Jenkins sẽ tự checkout dựa vào cấu hình SCM trong job
                // checkout scm
            }
        }

        stage('Deploy (Docker Compose)') {
            steps {
                echo 'Deploying Fullstack Application...'
                
                // Cài đặt lại docker-compose bản 2.27.0 (ổn định) để tránh lỗi SIGSEGV
                sh '''
                rm -f /usr/local/bin/docker-compose
                curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
                chmod +x /usr/local/bin/docker-compose
                '''

                // Dừng các container cũ
                sh "docker-compose down || true"
                
                // Build và chạy tất cả các services (mongodb, backend, frontend)
                sh "docker-compose up -d --build"
            }
        }
    }

    post {
        success {
            echo "Deploy thành công! Frontend: http://localhost:8000 | Backend API: http://localhost:5000"
        }
        failure {
            echo "Deploy thất bại. Vui lòng kiểm tra log."
        }
    }
}
