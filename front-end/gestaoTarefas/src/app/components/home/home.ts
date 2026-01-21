import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Tarefa {
  id?: number;
  titulo: string;
  descricao: string;
  status: string;
  data: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private apiUrl = 'http://localhost:3000/tarefas';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarTarefas();
  }

  // CARREGAR TAREFAS CRIADAS
  carregarTarefas() {
    this.http.get<Tarefa[]>(this.apiUrl).subscribe({
      next: (dados) => (this.tarefas = dados),
      error: (err) => console.error('Erro ao carregar banco:', err),
    });
  }

  // LISTA TAREFA E NOVA TAREFA
  tarefas: Tarefa[] = [];

  novaTarefa: Tarefa = { titulo: '', descricao: '', status: 'Pendente', data: '' };

  // LÓGICA MODAL
  exibirModal = false;
  editando = false;
  indiceEdicao: number | null = null;

  abrirModal() {
    this.editando = false;
    this.indiceEdicao = null;
    this.exibirModal = true;
  }

  abrirEdicao(tarefa: Tarefa) {
    this.editando = true;
    this.novaTarefa = { ...tarefa };
    this.exibirModal = true;
  }

  fecharModal() {
    this.exibirModal = false;
    this.editando = false;
    this.indiceEdicao = null;
    this.novaTarefa = { titulo: '', descricao: '', status: 'pendente', data: '' };
  }

  // MENSAGEM NOTIFICAÇÃO
  mensagemFeedback: string | null = null;

  exibirMensagem(texto: string) {
    this.mensagemFeedback = texto;
    setTimeout(() => {
      this.mensagemFeedback = null;
    }, 3000);
  }

  // CONTADOR - TAREFAS EXISTENTES PARA TAREFAS CONCLUÍDAS
  get contadorConcluidas(): string {
    if (this.tarefas.length === 0) return 'Nenhuma tarefa cadastrada';

    const total = this.tarefas.length;
    const concluidas = this.tarefas.filter((t) => t.status === 'Concluída').length;

    return `${concluidas} de ${total} concluídas`;
  }

  // SALVAR TAREFA NOVA
  salvarTarefa() {
    if (!this.novaTarefa.titulo) {
      this.exibirMensagem('O título é obrigatório');
      return;
    }

    if (!this.editando) {
      this.novaTarefa.data = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }

    if (!this.novaTarefa.status) {
      this.novaTarefa.status = 'Pendente';
    }

    const dadosParaEnviar = {
      titulo: this.novaTarefa.titulo,
      descricao: this.novaTarefa.descricao,
      status: this.novaTarefa.status,
      data: this.novaTarefa.data,
    };

    if (!this.editando) {
      this.http.post<Tarefa>(this.apiUrl, dadosParaEnviar).subscribe({
        next: (response) => {
          this.tarefas.push(response);
          this.exibirMensagem('Tarefa criada com sucesso');
          this.fecharModal();
        },
        error: (err) => {
          console.error(err);
          this.exibirMensagem('Erro ao salvar tarefa. Verifique o servidor');
        },
      });
    } else {
      this.http.put<Tarefa>(`${this.apiUrl}/${this.novaTarefa.id}`, dadosParaEnviar).subscribe({
        next: (response) => {
          const index = this.tarefas.findIndex((t) => t.id === this.novaTarefa.id);
          if (index !== -1) this.tarefas[index] = response;
          this.exibirMensagem('Tarefa atualizada com sucesso');
          this.fecharModal();
        },
        error: (err) => {
          console.error(err);
          this.exibirMensagem('Erro ao editar tarefa');
        },
      });
    }
  }

  // EXCLUIR TAREFA
  excluirTarefa(id: number | undefined) {
    if (!id) return;

    if (confirm('Deseja realmente excluir esta tarefa?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.tarefas = this.tarefas.filter((t) => t.id !== id);
          this.exibirMensagem('Tarefa deletada com sucesso');
        },
        error: (err) => {
          console.error(err);
          this.exibirMensagem('Não foi possível excluir a tarefa');
        },
      });
    }
  }

  // LÓGICA - FILTROS
  filtroTitulo: string = '';
  filtroStatus: string = '';

  get tarefasFiltradas() {
    return this.tarefas.filter((tarefa) => {
      const matchesTitulo = tarefa.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase());

      const matchesStatus =
        this.filtroStatus === '' ||
        tarefa.status === this.filtroStatus ||
        (tarefa.status === 'Em andamento' && this.filtroStatus === 'Em-andamento');

      return matchesTitulo && matchesStatus;
    });
  }
}
