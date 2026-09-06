FROM php:8.2-cli
RUN docker-php-ext-install pdo_mysql
WORKDIR /app
CMD ["php", "-d", "upload_max_filesize=8M", "-d", "post_max_size=10M", "-S", "0.0.0.0:8080", "-t", "public"]
