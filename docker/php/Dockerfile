# ベースイメージ
FROM php:8.2-fpm-alpine

# システム依存パッケージのインストール
RUN apk update && apk add --no-cache \
    mysql-client \
    git \
    unzip \
    icu-dev \
    libxml2-dev \
    bash

# PHP拡張機能のインストール
RUN docker-php-ext-install pdo_mysql opcache \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && docker-php-ext-install bcmath

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# タイムゾーンの設定 (任意)
RUN apk add tzdata \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo "Asia/Tokyo" > /etc/timezone

# 作業ディレクトリの設定
WORKDIR /var/www/html

# ホストの ./laravel-app/ から composer ファイルをコンテナへコピー
COPY laravel-app/composer.json laravel-app/composer.lock /var/www/html/

# 依存関係をインストール
RUN composer install --no-dev --optimize-autoloader