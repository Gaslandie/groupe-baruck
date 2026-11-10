FROM php:8.2-cli
RUN apt-get update \
    && apt-get install -y --no-install-recommends libonig-dev \
    && docker-php-ext-install pdo_mysql mbstring \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
CMD ["php", "-d", "upload_max_filesize=8M", "-d", "post_max_size=10M", "-S", "0.0.0.0:8080", "-t", "public"]
