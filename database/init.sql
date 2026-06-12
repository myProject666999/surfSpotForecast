CREATE DATABASE IF NOT EXISTS surf_spot_forecast DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE surf_spot_forecast;

CREATE TABLE IF NOT EXISTS surf_spots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    wave_type ENUM('point_break', 'beach_break', 'reef_break') NOT NULL,
    suitable_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    best_wind_direction VARCHAR(50),
    best_tide VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_level (suitable_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS forecasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spot_id INT NOT NULL,
    forecast_time DATETIME NOT NULL,
    wave_height DECIMAL(5, 2) NOT NULL,
    wave_direction INT,
    wind_speed DECIMAL(5, 2),
    wind_direction INT,
    tide_level DECIMAL(5, 2),
    fetch_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES surf_spots(id) ON DELETE CASCADE,
    UNIQUE KEY uk_spot_time (spot_id, forecast_time, fetch_date),
    INDEX idx_spot_id (spot_id),
    INDEX idx_forecast_time (forecast_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spot_id INT NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    checkin_time DATETIME NOT NULL,
    actual_wave_height DECIMAL(5, 2),
    crowd_level ENUM('empty', 'few', 'moderate', 'crowded', 'very_crowded'),
    rating TINYINT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES surf_spots(id) ON DELETE CASCADE,
    INDEX idx_spot_id (spot_id),
    INDEX idx_checkin_time (checkin_time),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS surf_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spot_id INT NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    log_date DATE NOT NULL,
    board_type VARCHAR(100),
    board_length VARCHAR(20),
    tricks TEXT,
    video_url VARCHAR(500),
    duration INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES surf_spots(id) ON DELETE CASCADE,
    INDEX idx_spot_id (spot_id),
    INDEX idx_user_name (user_name),
    INDEX idx_log_date (log_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
