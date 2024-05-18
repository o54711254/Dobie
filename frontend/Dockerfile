# 단계 1: Node.js를 포함한 베이스 이미지 사용
FROM node:20.11.0-alpine as build-stage

# 단계 2: 작업 디렉토리 설정
WORKDIR /app

# 단계 3: package.json과 package-lock.json을 이미지로 복사
COPY package*.json ./

# 단계 4: 프로젝트 의존성 설치
RUN npm install

# 단계 5: 소스 코드를 작업 디렉토리로 복사
COPY . .

# 단계 6: 프로덕션 빌드 생성
RUN npm run build



# step 2 실행 스테이지를 위한 과정
FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
