import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import path from 'path';
import * as dotenv from 'dotenv';


dotenv.config({ path: path.join(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// CONEXÃO BANCO 
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gestao_tarefas',
  port: 3306
});


// API GET
app.get("/tarefas", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Tarefa");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

// API POST
app.post("/tarefas", async (req, res) => {
  const { titulo, descricao, status, data } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO Tarefa (titulo, descricao, status, data) VALUES (?, ?, ?, ?)",
      [titulo, descricao, status, data]
    );
    res.json({ id: (result as any).insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar no banco" });
  }
});

// API DELETE
app.delete("/tarefas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM Tarefa WHERE id = ?", [id]);
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada para excluir." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir tarefa." });
  }
});

// API PUT
app.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, status, data } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE Tarefa SET titulo = ?, descricao = ?, status = ?, data = ? WHERE id = ?",
      [titulo, descricao, status, data, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada para editar." });
    }

    res.json({ id, titulo, descricao, status, data });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar tarefa." });
  }
});

// PORTA
const PORTA = 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando lindamente em http://localhost:${PORTA}`);
});
