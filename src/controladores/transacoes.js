const { saques, depositos, transferencias } = require("../bancodedados");

const { format } = require("date-fns");

const depositar = (req, res) => {
  const { conta, numero_conta, valor } = req.body;

  conta.saldo = conta.saldo + valor;

  depositos.push({
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta,
    valor,
  });

  return res.status(200).send();
};

const sacar = (req, res) => {
  const { conta, numero_conta, valor } = req.body;

  conta.saldo = conta.saldo - valor;

  saques.push({
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta,
    valor,
  });

  return res.status(200).send();
};

const transferir = (req, res) => {
  const {
    contaOrigem,
    contaDestino,
    numero_conta_origem,
    numero_conta_destino,
    valor,
  } = req.body;

  contaOrigem.saldo = contaOrigem.saldo - valor;
  contaDestino.saldo = contaDestino.saldo + valor;

  transferencias.push({
    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    numero_conta_origem,
    numero_conta_destino,
    valor,
  });

  return res.status(200).send();
};

module.exports = {
  depositar,
  sacar,
  transferir,
};
