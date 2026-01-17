# Teste técnico - Gestão de tarefas
### Projeto desenvolvido para o teste técnico, com o objetivo de criar um gerenciador de tarefas, onde é possível criar, listar, editar e excluir tarefas.
--- 
# Tecnologias utilizadas 
### Front-end: Angular
### Back-end: Node.js, Express
### Banco de dados: Mysql 
### Linguagens: TypeScript
---
# O que precisa ter instalado para rodar o projeto?
### Node.js
### Mysql Workbench
### Angular CLI
---
# Instalações e configurações
## Banco de dados:
### - Crie um banco de dados chamado: gestao_tarefas. E execute esse comando SQL para criar a tabela:
### CREATE TABLE Tarefa (
###  id INT AUTO_INCREMENT PRIMARY KEY,
###  titulo VARCHAR(255) NOT NULL,
###  descricao TEXT,
###  status ENUM('Pendente', 'Em andamento', 'Concluída') DEFAULT 'Pendente',
###  data VARCHAR(50)
### );
---
## Back-end:
### - Abra seu terminal Git bash no VS Code e entre na pasta teste-tecnico (cd back-end/teste-tecnico)
###  - Instale as dependências npm install
### - Dentro da pasta teste-tecnico, crie uma pasta chamada .env e coloque esse código: DATABASE_URL=mysql://root:root@localhost:3306/gestao_tarefas
### - Inicie o servidor: npm run dev
---
## Front-end:
### - Abra seu terminal powershell e entre na pasta gestaoTarefas (cd front-end/gestaoTarefas)
### - Instale as dependências: npm install
### - Inicie a apilicação: npm start ou ng serve, e acesse o link.
---
# Funcionalidades 
### - Cadastro de novas tarefas
### - Edição de tarefas existentes
### - Exclusão de tarefas 
### - Filtrospor título e status
### - Feedback de lista vazia


