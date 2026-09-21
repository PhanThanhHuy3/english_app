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

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image...'
                // Build docker image từ Dockerfile
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Deploy (Run Container)') {
            steps {
                echo 'Deploying application...'
                // Dừng và xóa container cũ nếu đang chạy để tránh lỗi trùng port/tên
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
                    sh "docker stop ${IMAGE_NAME}-container"
                    sh "docker rm ${IMAGE_NAME}-container"
                }
                
                // Chạy container mới
                sh "docker run -d -p ${HOST_PORT}:80 --name ${IMAGE_NAME}-container ${IMAGE_NAME}"
            }
        }
    }

    post {
        success {
            echo "Deploy thành công! Truy cập ứng dụng tại http://localhost:${HOST_PORT}"
        }
        failure {
            echo "Deploy thất bại. Vui lòng kiểm tra log."
        }
    }
}
