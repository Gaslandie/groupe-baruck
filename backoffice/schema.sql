CREATE TABLE IF NOT EXISTS users (
    id CHAR(32) PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(16) NOT NULL,
    active TINYINT NOT NULL DEFAULT 1,
    session_version INT NOT NULL DEFAULT 1,
    created_at VARCHAR(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS articles (
    id CHAR(32) PRIMARY KEY,
    slug VARCHAR(180) NOT NULL UNIQUE,
    title VARCHAR(240) NOT NULL,
    category VARCHAR(32) NOT NULL,
    article_date VARCHAR(10) NOT NULL,
    excerpt TEXT NOT NULL,
    body MEDIUMTEXT NOT NULL,
    cover VARCHAR(255) NOT NULL DEFAULT '',
    cover_alt VARCHAR(500) NOT NULL DEFAULT '',
    gallery MEDIUMTEXT NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'draft',
    version INT NOT NULL DEFAULT 1,
    updated_at VARCHAR(25) NOT NULL,
    updated_by CHAR(32) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media (
    id CHAR(32) PRIMARY KEY,
    filename VARCHAR(100) NOT NULL UNIQUE,
    original_name VARCHAR(255) NOT NULL,
    mime VARCHAR(32) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    bytes INT NOT NULL,
    alt VARCHAR(500) NOT NULL,
    created_at VARCHAR(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_log (
    id CHAR(32) PRIMARY KEY,
    user_id CHAR(32) NULL,
    action VARCHAR(64) NOT NULL,
    subject VARCHAR(240) NOT NULL,
    created_at VARCHAR(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS article_publications (
    article_id CHAR(32) PRIMARY KEY,
    version INT NOT NULL,
    payload MEDIUMTEXT NOT NULL,
    validated_at VARCHAR(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS article_revisions (
    id CHAR(32) PRIMARY KEY,
    article_id CHAR(32) NOT NULL,
    version INT NOT NULL,
    payload MEDIUMTEXT NOT NULL,
    action VARCHAR(64) NOT NULL,
    user_id CHAR(32) NULL,
    created_at VARCHAR(25) NOT NULL,
    UNIQUE KEY article_version (article_id, version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS schema_migrations (
    name VARCHAR(100) PRIMARY KEY,
    applied_at VARCHAR(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
