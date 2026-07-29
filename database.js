import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('ficha-rpg.db');

export function inicializarBanco() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS personagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      classe TEXT,
      antecedente TEXT,
      raca TEXT,
      nivel TEXT,
      subclasse TEXT,
      iniciativa TEXT,
      deslocamento TEXT,
      tamanho TEXT,
      aparencia TEXT,
      historia TEXT,
      ideais TEXT,
      vinculos TEXT,
      defeitos TEXT,
      idiomas TEXT
    );
   CREATE TABLE IF NOT EXISTS atributos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personagem_id INTEGER,
      forca TEXT,
      destreza TEXT, 
      constituicao TEXT,
      inteligencia TEXT,
      sabedoria TEXT,
      carisma TEXT,
      imagem TEXT,
      inspiração TEXT,
      FOREIGN KEY (personagem_id) REFERENCES personagens(id)
    );

  CREATE TABLE IF NOT EXISTS ProficienciaPericias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personagem_id INTEGER,
      atletismo BOOLEAN,
      acrobacia BOOLEAN,
      furtividade BOOLEAN,
      prestidigitacao BOOLEAN,
      arcana BOOLEAN,
      historia BOOLEAN,
      investigacao BOOLEAN,
      natureza BOOLEAN,
      religiao BOOLEAN,
      adestramento BOOLEAN,
      intuicao BOOLEAN,
      medicina BOOLEAN,
      percepcao BOOLEAN,
      sobrevivencia BOOLEAN,
      atuacao BOOLEAN,
      enganacao BOOLEAN,
      intimidacao BOOLEAN,
      persuasao BOOLEAN
    );

  CREATE TABLE IF NOT EXISTS Pericias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personagem_id INTEGER,
      atletismo TEXT,
      acrobacia TEXT,
      furtividade TEXT,
      prestidigitacao TEXT,
      arcana TEXT,
      historia TEXT,
      investigacao TEXT,
      natureza TEXT,
      religiao TEXT,
      adestramento TEXT,
      intuicao TEXT,
      medicina TEXT,
      percepcao TEXT,
      sobrevivencia TEXT,
      atuacao TEXT,
      enganacao TEXT,
      intimidacao TEXT,
      persuasao TEXT
    );


  CREATE TABLE IF NOT EXISTS itens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personagem_id INTEGER,
      armaduraleve boolean,
      armaduramedia boolean,
      armadurapesada boolean,
      escudo boolean,
      armas TEXT,
      ferramentas TEXT,
      equipamentos TEXT,
      itemsintonizados1 TEXT,
      itemsintonizados2 TEXT,
      itemsintonizados3 TEXT,
      PC integer,
      PP integer,
      PE integer,
      PO integer,
      PL integer,
      FOREIGN KEY (personagem_id) REFERENCES personagens(id)
    );

  CREATE TABLE IF NOT EXISTS habilidades(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personagem_id INTEGER,
    nome_habilidade TEXT,
    descricao_habilidade TEXT,
    FOREIGN KEY(personagem_id) REFERENCES personagens(id)
  );
  
CREATE TABLE IF NOT EXISTS magias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personagem_id INTEGER,
    cd_evit TEXT,
    bonus_ataque TEXT,
    atribu_conjur TEXT,
    mod_conjur TEXT,
    nome_magia TEXT,
    desc_magia TEXT,
    FOREIGN KEY(personagem_id) REFERENCES personagens(id)
  );

  CREATE TABLE IF NOT EXISTS espacos_magia (
    personagem_id INTEGER PRIMARY KEY,
    slots TEXT, -- Aqui vai virar uma string JSON com o estado de todas as bolinhas
    atribu_conjur TEXT,
    mod_conjur TEXT,
    cd_evit TEXT,
    bonus_ataque TEXT,
    FOREIGN KEY(personagem_id) REFERENCES personagens(id)
);

CREATE TABLE IF NOT EXISTS status_combate (
    personagem_id INTEGER PRIMARY KEY,
    ca TEXT,
    pv_atual TEXT,
    pv_max TEXT,
    ataques TEXT,
    FOREIGN KEY(personagem_id) REFERENCES personagens(id)
);
`);
}

// função para salvar o novo personagem no banco de dados

export function salvarPersonagem(dados) {
  return db.runSync(
    `INSERT INTO personagens (nome, classe, antecedente, raca, nivel, subclasse, iniciativa, deslocamento, tamanho, aparencia, historia, ideais, vinculos, defeitos, idiomas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [dados.nome, dados.classe, dados.antecedente, dados.raca, dados.nivel, dados.subclasse, dados.iniciativa, dados.deslocamento, dados.tamanho, dados.aparencia, dados.historia, dados.ideais, dados.vinculos, dados.defeitos, dados.idiomas]
  );
}

export function atualizarPersonagem(id, dados) {
  db.runSync(
    `UPDATE personagens SET 
      nome=?, classe=?, antecedente=?, raca=?, nivel=?, subclasse=?,
      iniciativa=?, deslocamento=?, tamanho=?,
      aparencia=?, historia=?, ideais=?, vinculos=?, defeitos=?, idiomas=?
     WHERE id=?;`,
    [dados.nome, dados.classe, dados.antecedente, dados.raca, dados.nivel,
     dados.subclasse, dados.iniciativa, dados.deslocamento, dados.tamanho,
     dados.aparencia, dados.historia, dados.ideais,
     dados.vinculos, dados.defeitos, dados.idiomas, id]
  );
}

export function listarPersonagens() {
  return db.getAllSync('SELECT * FROM personagens;');
}

export function deletarPersonagem(id) {
  db.runSync('DELETE FROM personagens WHERE id = ?;', [id]);
}

export function resetarBanco() {
  db.execSync(`DROP TABLE IF EXISTS personagens;`);
  db.execSync(`DROP TABLE IF EXISTS atributos;`);
  db.execSync(`DROP TABLE IF EXISTS Pericias;`);
  db.execSync(`DROP TABLE IF EXISTS ProficienciaPericias;`);
  db.execSync(`DROP TABLE IF EXISTS itens;`);
  db.execSync('DROP TABLE IF EXISTS habilidades');
  db.execSync('DROP TABLE IF EXISTS magias');
  db.execSync('DROP TABLE IF EXISTS espacos_magia');
  db.execSync('DROP TABLE IF EXISTS status_combate');
  inicializarBanco();
}

export function buscarPersonagem(id) {
  return db.getFirstSync('SELECT * FROM personagens WHERE id = ?;', [id]);
}


// função para salvar os atributos do personagem no banco de dados
export function salvarAtributo(idPersonagem, dados) {
  db.runSync(
    `INSERT INTO atributos (personagem_id, forca, destreza, constituicao, inteligencia, sabedoria, carisma, imagem, inspiração)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [idPersonagem, dados.forca, dados.destreza, dados.constituicao, dados.inteligencia, dados.sabedoria, dados.carisma, dados.imagem, dados.inspiração]
  );
}

export function atualizarAtributo(idPersonagem, dados) {
  db.runSync(
    `UPDATE atributos SET 
      forca=?, destreza=?, constituicao=?, inteligencia=?, sabedoria=?, carisma=?, imagem=?, inspiração=?
     WHERE personagem_id=?;`,
    [dados.forca, dados.destreza, dados.constituicao, dados.inteligencia, dados.sabedoria, dados.carisma, dados.imagem, idPersonagem]
  );
}

export function buscarAtributo(idPersonagem) {
  return db.getFirstSync('SELECT * FROM atributos WHERE personagem_id = ?;', [idPersonagem]);
}

export function salvarPericias(idPersonagem, dados) {
  db.runSync(
    `INSERT INTO Pericias (personagem_id, atletismo, acrobacia, furtividade, prestidigitacao, arcana, historia, investigacao, natureza, religiao, adestramento, intuicao, medicina, percepcao, sobrevivencia, atuacao, enganacao, intimidacao, persuasao)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [idPersonagem, dados.atletismo, dados.acrobacia, dados.furtividade, dados.prestidigitacao, dados.arcana, dados.historia, dados.investigacao, dados.natureza, dados.religiao, dados.adestramento, dados.intuicao, dados.medicina, dados.percepcao, dados.sobrevivencia, dados.atuacao, dados.enganacao, dados.intimidacao, dados.persuasao]
  );
}

export function atualizarPericias(idPersonagem, dados) {
  db.runSync(
    `UPDATE Pericias SET
      atletismo=?, acrobacia=?, furtividade=?, prestidigitacao=?, arcana=?, historia=?, investigacao=?, natureza=?, religiao=?, adestramento=?, intuicao=?, medicina=?, percepcao=?, sobrevivencia=?, atuacao=?, enganacao=?, intimidacao=?, persuasao=?
     WHERE personagem_id=?;`,
    [dados.atletismo, dados.acrobacia, dados.furtividade, dados.prestidigitacao, dados.arcana, dados.historia, dados.investigacao, dados.natureza, dados.religiao, dados.adestramento, dados.intuicao, dados.medicina, dados.percepcao, dados.sobrevivencia, dados.atuacao, dados.enganacao, dados.intimidacao, dados.persuasao, idPersonagem]
  );
}

export function buscarPericias(idPersonagem) {
  return db.getFirstSync('SELECT * FROM Pericias WHERE personagem_id = ?;', [idPersonagem]);
}

export function salvarProficienciaPericias(idPersonagem, dados) {
  db.runSync(
    `INSERT INTO ProficienciaPericias (personagem_id, atletismo, acrobacia, furtividade, prestidigitacao, arcana, historia, investigacao, natureza, religiao, adestramento, intuicao, medicina, percepcao, sobrevivencia, atuacao, enganacao, intimidacao, persuasao)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [idPersonagem, dados.atletismo, dados.acrobacia, dados.furtividade, dados.prestidigitacao, dados.arcana, dados.historia, dados.investigacao, dados.natureza, dados.religiao, dados.adestramento, dados.intuicao, dados.medicina, dados.percepcao, dados.sobrevivencia, dados.atuacao, dados.enganacao, dados.intimidacao, dados.persuasao]
  );
}

export function atualizarProficienciaPericias(idPersonagem, dados) {
  db.runSync(
    `UPDATE ProficienciaPericias SET
      atletismo=?, acrobacia=?, furtividade=?, prestidigitacao=?, arcana=?, historia=?, investigacao=?, natureza=?, religiao=?, adestramento=?, intuicao=?, medicina=?, percepcao=?, sobrevivencia=?, atuacao=?, enganacao=?, intimidacao=?, persuasao=?
     WHERE personagem_id=?;`,
    [dados.atletismo, dados.acrobacia, dados.furtividade, dados.prestidigitacao, dados.arcana, dados.historia, dados.investigacao, dados.natureza, dados.religiao, dados.adestramento, dados.intuicao, dados.medicina, dados.percepcao, dados.sobrevivencia, dados.atuacao, dados.enganacao, dados.intimidacao, dados.persuasao, idPersonagem]
  );
}

export function buscarProficienciaPericias(idPersonagem) {
  return db.getFirstSync('SELECT * FROM ProficienciaPericias WHERE personagem_id = ?;', [idPersonagem]);
}

// função para salvar os itens do personagem no banco de dados
export function salvarItens(idPersonagem, dados) {
  db.runSync(
    `INSERT INTO itens (personagem_id, armaduraleve, armaduramedia, armadurapesada, escudo, armas, ferramentas, equipamentos, itemsintonizados1, itemsintonizados2, itemsintonizados3, PC, PP, PE, PO, PL)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [idPersonagem, dados.armaduraleve, dados.armaduramedia, dados.armadurapesada, dados.escudo, dados.armas, dados.ferramentas, dados.equipamentos, dados.itemsintonizados1, dados.itemsintonizados2, dados.itemsintonizados3, dados.PC, dados.PP, dados.PE, dados.PO, dados.PL]
  );
}

export function atualizarItens(idPersonagem, dados) {
  db.runSync(
    `UPDATE itens SET 
      armaduraleve=?, armaduramedia=?, armadurapesada=?, escudo=?, armas=?, ferramentas=?, equipamentos=?, itemsintonizados1=?, itemsintonizados2=?, itemsintonizados3=?, PC=?, PP=?, PE=?, PO=?, PL=?
     WHERE personagem_id=?;`,
    [dados.armaduraleve, dados.armaduramedia, dados.armadurapesada, dados.escudo, dados.armas, dados.ferramentas, dados.equipamentos, dados.itemsintonizados1, dados.itemsintonizados2, dados.itemsintonizados3, dados.PC, dados.PP, dados.PE, dados.PO, dados.PL, idPersonagem]
  );
}

export function buscarItens(idPersonagem) {
  return db.getFirstSync('SELECT * FROM itens WHERE personagem_id = ?;', [idPersonagem]);
}

// habiliadades funções
export function salvarHabilidade(idPersonagem, dados) {
  return db.runSync(
    `INSERT INTO habilidades (personagem_id, nome_habilidade, descricao_habilidade)
     VALUES (?, ?, ?);`,
    [idPersonagem, dados.nome, dados.descricao]
  );
}

export function buscarHabilidades(idPersonagem) {
  return db.getAllSync(
    `SELECT * FROM habilidades WHERE personagem_id = ?;`,
    [idPersonagem]
  );
}

export function deletarHabilidade(idHabilidade) {
  db.runSync(`DELETE FROM habilidades WHERE id = ?;`, [idHabilidade]);
}

export function salvarMagias(personagem_id, cd_evit, bonus_ataque, atribu_conjur, mod_conjur, nome_magia, desc_magia){
  return db.runSync(
    'INSERT INTO magias (personagem_id, cd_evit, bonus_ataque, atribu_conjur, mod_conjur, nome_magia, desc_magia) VALUES(?,?,?,?,?,?,?);',
    [personagem_id, cd_evit, bonus_ataque, atribu_conjur, mod_conjur, nome_magia, desc_magia]
  );
}

export function buscarMagias(idPersonagem){
  return db.getAllSync(
    'SELECT * FROM magias WHERE personagem_id = ?;',
    [idPersonagem]
  );
}

export function deletarMagias(idmagia){
  db.runSync('DELETE FROM magias WHERE id = ?;', [idmagia]);
}

// Funções para salvar e buscar os dados do cabeçalho e círculos de magia
export function salvarDadosConjuracao(personagem_id, slotsObj, atribu, mod, cd, bonus) {
  // Transforma o objeto de bolinhas {1: [false, true...]} em uma String de texto
  const slotsString = JSON.stringify(slotsObj);

  // Usa um INSERT OR REPLACE para atualizar se já existir ou criar se for o primeiro save
  return db.runSync(`
    INSERT OR REPLACE INTO espacos_magia (personagem_id, slots, atribu_conjur, mod_conjur, cd_evit, bonus_ataque)
    VALUES (?, ?, ?, ?, ?, ?);
  `, [personagem_id, slotsString, atribu, mod, cd, bonus]);
}

export function buscarDadosConjuracao(personagem_id) {
  const resultado = db.getFirstSync(
    'SELECT * FROM espacos_magia WHERE personagem_id = ?;',
    [personagem_id]
  );
  
  if (resultado) {
    // Transforma a string de texto do banco de volta no objeto com arrays que o React usa
    resultado.slots = JSON.parse(resultado.slots);
  }
  return resultado;
}

export function salvarStatusCombate(personagem_id, ca, pv_atual, pv_max, listaAtaquesObj) {
  // Transforma a array de armas [{id: 1, nome: 'Espada'...}] em texto puro
  const ataquesString = JSON.stringify(listaAtaquesObj);

  return db.runSync(`
    INSERT OR REPLACE INTO status_combate (personagem_id, ca, pv_atual, pv_max, ataques)
    VALUES (?, ?, ?, ?, ?);
  `, [personagem_id, ca, pv_atual, pv_max, ataquesString]);
}

export function buscarStatusCombate(personagem_id) {
  const resultado = db.getFirstSync(
    'SELECT * FROM status_combate WHERE personagem_id = ?;',
    [personagem_id]
  );
  
  if (resultado && resultado.ataques) {
    // Transforma a string de texto de volta na Array de armas do React
    resultado.ataques = JSON.parse(resultado.ataques);
  }
  return resultado;
}