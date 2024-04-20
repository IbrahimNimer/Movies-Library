CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    original_title varchar(255),
    release_date DATE,
    poster_path varchar(255),
    overview varchar(255),
    comment varchar(255) 
);