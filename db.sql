CREATE TABLE hackers (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    picture TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
);

CREATE TABLE skills (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    hacker_id BIGINT NOT NULL REFERENCES hackers(id),
    name VARCHAR(50) NOT NULL,
    rating INT NOT NULL
);

INSERT INTO hackers (company, email, name, phone, picture) values ('Google', 'bob@gmail.com', 'BOB', '647575565', 'ITS A PIC');