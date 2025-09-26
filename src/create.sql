CREATE TABLE preguntes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    imatge VARCHAR(255) NOT NULL
);

-- Taula de respostes
DROP TABLE IF EXISTS respostes;
CREATE TABLE respostes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pregunta INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    es_correcta TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (id_pregunta) REFERENCES preguntes(id) ON DELETE CASCADE
);

-- Insercions de preguntes i respostes
INSERT INTO preguntes (text, imatge) VALUES
('De quin país és aquesta bandera?', './img/japon.png'),
('De quin país és aquesta bandera?', './img/australia.png'),
('De quin país és aquesta bandera?', './img/norway.png'),
('De quin país és aquesta bandera?', './img/india.png'),
('De quin país és aquesta bandera?', './img/canada.png'),
('De quin país és aquesta bandera?', './img/sudafrica.png'),
('De quin país és aquesta bandera?', './img/vietnam.png'),
('De quin país és aquesta bandera?', './img/arabiasaudi.png'),
('De quin país és aquesta bandera?', './img/suecia.png'),
('De quin país és aquesta bandera?', './img/turquia.png');

-- Respostes per a cada pregunta
-- Pregunta 1: Japó
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(1, 'Japó', 1),
(1, 'Xina', 0),
(1, 'Corea del Sud', 0),
(1, 'Bangla Desh', 0);

-- Pregunta 2: Austràlia
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(2, 'Austràlia', 1),
(2, 'Nova Zelanda', 0),
(2, 'Fiji', 0),
(2, 'Estats Units', 0);

-- Pregunta 3: Noruega
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(3, 'Noruega', 1),
(3, 'Islàndia', 0),
(3, 'Suècia', 0),
(3, 'Finlàndia', 0);

-- Pregunta 4: Índia
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(4, 'Índia', 1),
(4, 'BanglaDesh', 0),
(4, 'Sri Lanka', 0),
(4, 'Pakistan', 0);

-- Pregunta 5: Canadà
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(5, 'Canadà', 1),
(5, 'Dinamarca', 0),
(5, 'Suïssa', 0),
(5, 'Noruega', 0);

-- Pregunta 6: Sud-àfrica
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(6, 'Sud-àfrica', 1),
(6, 'Zàmbia', 0),
(6, 'Namíbia', 0),
(6, 'Botswana', 0);

-- Pregunta 7: Vietnam
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(7, 'Vietnam', 1),
(7, 'Xina', 0),
(7, 'Corea del Nord', 0),
(7, 'Singapur', 0);

-- Pregunta 8: Aràbia Saudita
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(8, 'Aràbia Saudita', 1),
(8, 'Jordània', 0),
(8, 'Emirats Àrabs Units', 0),
(8, 'Kuwait', 0);

-- Pregunta 9: Suècia
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(9, 'Suècia', 1),
(9, 'Finlàndia', 0),
(9, 'Noruega', 0),
(9, 'Dinamarca', 0);

-- Pregunta 10: Turquia
INSERT INTO respostes (id_pregunta, text, es_correcta) VALUES
(10, 'Turquia', 1),
(10, 'Tunísia', 0),
(10, 'Azerbaidjan', 0),
(10, 'Marroc', 0);