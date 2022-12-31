const express = require("express");

const rotas = require("./roteador");

const servidor = express();

servidor.use(express.json());

servidor.use(rotas);

servidor.listen(3000);
