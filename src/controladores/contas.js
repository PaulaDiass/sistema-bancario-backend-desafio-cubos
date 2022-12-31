let { contas, saques, depositos, transferencias } = require("../bancodedados");
let contaBancaria = 1;

const listarContasBancarias = (req, res) => {
  return res.status(200).json(contas);
};

const criarContaBancaria = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const conta = {
    numero: contaBancaria++,
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  contas.push(conta);

  return res.status(201).send();
};

const atualizarDadosUsuario = (req, res) => {
  const { conta, nome, cpf, data_nascimento, telefone, email, senha } =
    req.body;

  conta.usuario.nome = nome;
  conta.usuario.cpf = cpf;
  conta.usuario.data_nascimento = data_nascimento;
  conta.usuario.telefone = telefone;
  conta.usuario.email = email;
  conta.usuario.senha = senha;

  return res.status(200).send();
};

const deletarConta = (req, res) => {
  const conta = req.body.conta;
  const index = contas.indexOf(conta);
  contas.splice(index, 1);

  return res.status(200).send();
};

const saldoConta = (req, res) => {
  const conta = req.body.conta;

  return res.status(200).json({ saldo: conta.saldo });
};

const extratoConta = (req, res) => {
  const numero_conta = req.query.numero_conta;

  const depositosConta = depositos.filter((transacao) => {
    return transacao.numero_conta == numero_conta;
  });

  const saquesConta = saques.filter((transacao) => {
    return transacao.numero_conta == numero_conta;
  });

  const transferenciasEnviadasConta = transferencias.filter((transacao) => {
    return transacao.numero_conta_origem == numero_conta;
  });

  const transferenciasRecebidasConta = transferencias.filter((transacao) => {
    return transacao.numero_conta_destino == numero_conta;
  });

  const extrato = {
    depositos: depositosConta,
    saques: saquesConta,
    transferenciasEnviadas: transferenciasEnviadasConta,
    transferenciasRecebidas: transferenciasRecebidasConta,
  };

  return res.status(200).json(extrato);
};

module.exports = {
  listarContasBancarias,
  criarContaBancaria,
  atualizarDadosUsuario,
  deletarConta,
  saldoConta,
  extratoConta,
};
