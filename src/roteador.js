const express = require("express");
const contas = require("./controladores/contas");
const transacoes = require("./controladores/transacoes");
const intermediarios = require("./intermediarios");

const rotas = express();

rotas.get(
  "/contas",
  intermediarios.verificarSenhaBanco,
  contas.listarContasBancarias
);
rotas.post(
  "/contas",
  intermediarios.verificarDadosUsuario,
  contas.criarContaBancaria
);
rotas.put(
  "/contas/:numeroConta/usuario",
  intermediarios.verificarContaUrl,
  intermediarios.verificarDadosUsuario,
  contas.atualizarDadosUsuario
);
rotas.delete(
  "/contas/:numeroConta",
  intermediarios.verificarContaUrl,
  intermediarios.verificarSaldo0,
  contas.deletarConta
);
rotas.get(
  "/contas/saldo",
  intermediarios.verificarContaSenhaQuery,
  contas.saldoConta
);
rotas.get(
  "/contas/extrato",
  intermediarios.verificarContaSenhaQuery,
  contas.extratoConta
);

rotas.post(
  "/transacoes/depositar",
  intermediarios.verificarDadosDeposito,
  transacoes.depositar
);
rotas.post(
  "/transacoes/sacar",
  intermediarios.verificarDadosSaque,
  transacoes.sacar
);
rotas.post(
  "/transacoes/transferir",
  intermediarios.verificarDadosSTransferencia,
  transacoes.transferir
);

module.exports = rotas;
