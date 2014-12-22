INSERT INTO user (id, username, password, firstname, lastname, version_id, account_non_expired, account_non_locked, enabled, credentials_non_expired)
VALUES
  ('aschaefer', 'aschaefer', '$2a$10$EMkcycZ0eSOiYaXbVxHbBu4po598xwJJhSyAlYv/TYSGgs8KyMF5q', 'André', 'Schäfer', 1, 1, 1, 1, 1);
INSERT INTO user_roles (user_id, roles) VALUES ('aschaefer', 'MEDIXX_USER');
INSERT INTO user_roles (user_id, roles) VALUES ('aschaefer', 'MEDIXX_ADMIN');
INSERT INTO user_roles (user_id, roles) VALUES ('aschaefer', 'MEDIXX_SUPER_ADMIN');


