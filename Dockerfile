FROM python:3.10-alpine
WORKDIR /app
RUN apk update && apk --no-cache add openssl bash curl &&\
    chmod +x app.py start.sh
ENV TZ Asia/Shanghai
COPY . .
EXPOSE 3000
RUN pip install -r requirements.txt
CMD ["python3", "/app/web.py"]
