import express from 'express';
const app = express();

app.use(express.json());

const usuarios = [];

app.get('/', (request, response) => {
  return response.send('API CRUD Recados');
});

app.post('/usuario', (request, response) => {
  const temUsuario = usuarios.find(u => u.email === request.body.email);
  if (temUsuario) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'usuário já existe'
    });
  }
  const usuario = {
    id: (new Date).getTime(),
    nome: request.body.nome,
    email: request.body.email,
    senha: request.body.senha,
    logado: false,
    recados: []
  }
  usuarios.push(usuario);
  response.status(200).json({
    sucesso: true,
    resposta: 'usuario adicionado',
    data: usuario
  });
});

app.post('/login', (request, response) => {
  const usuarioIndex = usuarios.findIndex(u => u.email === request.body.email);
  if (usuarioIndex == -1 || usuarios[usuarioIndex].senha !== request.body.senha) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'email ou senha errado'
    });
  }
  usuarios[usuarioIndex].logado = true;
  response.status(200).json({
    sucesso: true,
    resposta: 'login realizado'
  });
});

app.get('/recado', (request, response) => {
  const usuarioIndex = usuarios.findIndex(u => u.id === request.body.idUsuario);
  if (usuarioIndex == -1 || !usuarios[usuarioIndex].logado) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'precisa fazer login'
    });
  }
  const recados = usuarios[usuarioIndex].recados;
  response.status(200).json({
    sucesso: true,
    resposta: 'lista recados',
    data: recados
  });
});

app.get('/recado/:id', (request, response) => {
  const id = Number(request.params.id);
  const usuarioIndex = usuarios.findIndex(u => u.id === request.body.idUsuario);
  if (usuarioIndex == -1 || !usuarios[usuarioIndex].logado) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'precisa fazer login'
    });
  }
  const recado = usuarios[usuarioIndex].recados.find(r => r.id == id);
  if (recado == null) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'recado nao encontrado'
    });
  }
  response.status(200).json({
    sucesso: true,
    resposta: 'detalhe recado',
    data: recado
  });
});

app.post('/recado', (request, response) => {
  const usuarioIndex = usuarios.findIndex(u => u.id === request.body.idUsuario);
  if (usuarioIndex == -1 || !usuarios[usuarioIndex].logado) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'precisa fazer login'
    });
  }
  const recado = {
    id: (new Date()).getTime(),
    titulo: request.body.titulo,
    descricao: request.body.descricao
  }
  usuarios[usuarioIndex].recados.push(recado);
  response.status(200).json({
    sucesso: true,
    resposta: 'adicionado recado',
    data: recado
  });
});

app.put('/recado/:id', (request, response) => {
  const id = Number(request.params.id);
  const usuarioIndex = usuarios.findIndex(u => u.id === request.body.idUsuario);
  if (usuarioIndex == -1 || !usuarios[usuarioIndex].logado) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'precisa fazer login'
    });
  }
  const recadoIndex = usuarios[usuarioIndex].recados.findIndex(r => r.id == id);
  if (recadoIndex == -1) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'recado nao localizado'
    });
  }
  usuarios[usuarioIndex].recados[recadoIndex].titulo = request.body.titulo;
  usuarios[usuarioIndex].recados[recadoIndex].descricao = request.body.descricao;
  response.status(200).json({
    sucesso: true,
    resposta: 'recado atualizado',
    data: usuarios[usuarioIndex].recados[recadoIndex]
  });
});

app.delete('/recado/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const usuarioIndex = usuarios.findIndex(u => u.id === request.body.idUsuario);
  if (usuarioIndex == -1 || !usuarios[usuarioIndex].logado) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'precisa fazer login'
    });
  }
  const recadoIndex = usuarios[usuarioIndex].recados.findIndex(r => r.id == id);
  if (recadoIndex == -1) {
    return response.status(400).json({
      sucesso: false,
      resposta: 'recado nao localizado'
    });
  }
  usuarios[usuarioIndex].recados.splice(recadoIndex, 1);
  response.status(200).json({
    sucesso: true,
    resposta: 'recado deletado'
  });
});


app.listen(3003, () => console.log(`Servidor iniciado na porta 3003`));
