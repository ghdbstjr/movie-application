FROM nginx:alpine

# nginx 설정 파일 복사 (우리가 만든 커스텀 conf)
COPY nginx.conf /etc/nginx/nginx.conf

# HTML, JS 파일 복사
COPY ./ /usr/share/nginx/html

# 80 포트 열기
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]