CREATE TABLE user
(
  id                      VARCHAR(255) PRIMARY KEY NOT NULL,
  username                VARCHAR(255)             NOT NULL,
  password                VARCHAR(80)              NOT NULL,
  firstname               NVARCHAR(255),
  lastname                NVARCHAR(255),
  gender                  VARCHAR(255),
  account_non_expired     BOOLEAN                  NOT NULL,
  account_non_locked      BOOLEAN                  NOT NULL,
  creation_date           TIMESTAMP,
  credentials_non_expired BOOLEAN                  NOT NULL,
  enabled                 BOOLEAN                  NOT NULL,
  last_modified_date      TIMESTAMP,
  version_id              INTEGER                  NOT NULL
);
CREATE UNIQUE INDEX UK_user_username ON user (username);

CREATE TABLE user_roles
(
  user_id VARCHAR(255) NOT NULL,
  roles   VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES user (id)
);
