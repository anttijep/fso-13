CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL
);

insert into blogs (author, url, title) values ('testauthor', 'testurl', 'testtitle');
insert into blogs (author, url, title) values ('secondauthor', 'secondurl', 'secondtitle');

