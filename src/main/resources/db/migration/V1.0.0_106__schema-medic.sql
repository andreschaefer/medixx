CREATE TABLE medics
(
  id   VARCHAR(255) PRIMARY KEY NOT NULL,
  user VARCHAR(255)             NOT NULL,
  date TIMESTAMP                NOT NULL
);
CREATE UNIQUE INDEX UK_medics_user ON medics (user);

CREATE TABLE stock
(
  id          VARCHAR(255) PRIMARY KEY NOT NULL,
  name        NVARCHAR(255)            NOT NULL,
  date        TIMESTAMP                NOT NULL,
  stock       INTEGER                  NOT NULL,
  consumption INTEGER                  NOT NULL
);

CREATE TABLE medics_stocks (
  medics VARCHAR(255) NOT NULL,
  stocks VARCHAR(255) NOT NULL
);

ALTER TABLE medics_stocks ADD CONSTRAINT FK_medics_stocks_stocks FOREIGN KEY (stocks) REFERENCES stock;
ALTER TABLE medics_stocks ADD CONSTRAINT FK_medics_stocks_medics FOREIGN KEY (medics) REFERENCES medics;


