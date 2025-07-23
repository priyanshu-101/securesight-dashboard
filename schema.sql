-- Cameras table
CREATE TABLE IF NOT EXISTS cameras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    camera_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    ts_start DATETIME NOT NULL,
    ts_end DATETIME NOT NULL,
    thumbnail_url VARCHAR(255),
    resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (camera_id) REFERENCES cameras(id)
); 