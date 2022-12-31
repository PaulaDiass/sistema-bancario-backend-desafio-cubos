const { banco, contas } = require("./bancodedados");

const verificarSenhaBanco = (req, res, next) => {
  const senha = req.query.senha_banco;

  if (!senha || senha != banco.senha) {
    return res.status(401).json({
      mensagem: "A senha do banco informada é inválida.",
    });
  }

  next();
};

const verificarContaUrl = (req, res, next) => {
  const conta = contas.find((conta) => {
    return conta.numero == Number(req.params.numeroConta);
  });

  if (!conta) {
    return res.status(404).json({
      mensagem: "Conta bancária não encontada.",
    });
  }

  req.body.conta = conta;

  next();
};

const verificarDadosUsuario = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({
      mensagem:
        "Nome, CPF, data de nascimento, telefone, e-mail e senha são obrigatórios.",
    });
  }

  const cpfJaExiste = contas.find((conta) => {
    return conta.usuario.cpf == cpf;
  });
  if (cpfJaExiste) {
    return res.status(400).json({
      mensagem: "O CPF informado já existe cadastrado!",
    });
  }

  const emailJaExiste = contas.find((conta) => {
    return conta.usuario.email == email;
  });
  if (emailJaExiste) {
    return res.status(400).json({
      mensagem: "O e-mail informado já existe cadastrado!",
    });
  }

  next();
};

const verificarSaldo0 = (req, res, next) => {
  const conta = req.body.conta;
  if (conta.saldo != 0) {
    return res.status(400).json({
      mensagem: "A conta só pode ser removida se o saldo for zero.",
    });
  }

  next();
};

const verificarContaSenhaQuery = (req, res, next) => {
  const conta = contas.find((conta) => {
    return conta.numero == Number(req.query.numero_conta);
  });

  if (!conta) {
    return res.status(404).json({
      mensagem: "Conta bancária não encontada.",
    });
  }

  if (conta.usuario.senha != req.query.senha) {
    return res.status(401).json({ mensagem: "Senha incorreta." });
  }

  req.body.conta = conta;

  next();
};

const verificarDadosDeposito = (req, res, next) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta || !valor) {
    return res.status(400).json({
      mensagem: "O número da conta e o valor são obrigatórios.",
    });
  }

  const conta = contas.find((conta) => {
    return conta.numero == numero_conta;
  });

  if (!conta) {
    return res.status(404).json({
      mensagem: "Conta bancária não encontada.",
    });
  }

  if (valor <= 0) {
    return res.status(400).json({
      mensagem: "Valor informado deve ser maior do que zero.",
    });
  }

  req.body.conta = conta;

  next();
};

const verificarDadosSaque = (req, res, next) => {
  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta || !valor || !senha) {
    return res.status(400).json({
      mensagem: "O número da conta, o valor e a senha são obrigatórios.",
    });
  }

  const conta = contas.find((conta) => {
    return conta.numero == numero_conta;
  });

  if (!conta) {
    return res.status(404).json({
      mensagem: "Conta bancária não encontada.",
    });
  }

  if (conta.usuario.senha != senha) {
    return res.status(401).json({ mensagem: "Senha incorreta." });
  }

  if (valor <= 0) {
    return res.status(400).json({
      mensagem: "Valor informado deve ser maior do que zero.",
    });
  }

  if (conta.saldo < valor) {
    return res.status(400).json({
      mensagem: "Saldo insuficiente para saque.",
    });
  }

  req.body.conta = conta;

  next();
};

const verificarDadosSTransferencia = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
    return res.status(400).json({
      mensagem:
        "Os números da conta de origem e destino, o valor e a senha são obrigatórios.",
    });
  }

  const contaOrigem = contas.find((conta) => {
    return conta.numero == numero_conta_origem;
  });

  const contaDestino = contas.find((conta) => {
    return conta.numero == numero_conta_destino;
  });

  if (!contaOrigem || !contaDestino) {
    return res.status(404).json({
      mensagem: "Conta bancária não encontada.",
    });
  }

  if (contaOrigem.usuario.senha != senha) {
    return res.status(401).json({ mensagem: "Senha incorreta." });
  }

  if (valor <= 0) {
    return res.status(400).json({
      mensagem: "Valor informado deve ser maior do que zero.",
    });
  }

  if (contaOrigem.saldo < valor) {
    return res.status(400).json({
      mensagem: "Saldo insuficiente para transferência.",
    });
  }

  req.body.contaOrigem = contaOrigem;
  req.body.contaDestino = contaDestino;

  next();
};

module.exports = {
  verificarSenhaBanco,
  verificarContaUrl,
  verificarDadosUsuario,
  verificarSaldo0,
  verificarContaSenhaQuery,
  verificarDadosDeposito,
  verificarDadosSaque,
  verificarDadosSTransferencia,
};
