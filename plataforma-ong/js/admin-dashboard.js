// Arquivo: js/admin-dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. VARIÁVEIS DOM E CONFIGURAÇÕES
    // =======================================================
    
    // Variáveis de Métricas
    const totalRegistrosSpan = document.getElementById('total-registros');
    const countVoluntariosSpan = document.getElementById('count-voluntarios-metric');
    const countDoadoresSpan = document.getElementById('count-doadores-metric');
    
    // Variáveis de Voluntários/Doadores
    const voluntariosTableBody = document.querySelector('#voluntarios-table tbody');
    const doadoresTableBody = document.querySelector('#doadores-table tbody');
    const noVoluntariosRow = document.getElementById('no-voluntarios-row');
    const noDoadoresRow = document.getElementById('no-doadores-row');

    // Variáveis de Projetos
    const projetosTableBody = document.querySelector('#tabela-projetos tbody');
    const noProjetosRow = document.getElementById('no-projetos-row');
    const btnAbrirModalCriar = document.getElementById('btn-abrir-modal-criar-projeto');
    
    // Variáveis do Modal de Projeto
    const modalProjeto = document.getElementById('modal-projeto');
    const btnFecharModal = document.getElementById('btn-fechar-modal');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal'); 
    const formProjeto = document.getElementById('form-projeto');
    const modalTitulo = document.getElementById('modal-titulo');
    const projetoIdInput = document.getElementById('projeto-id');
    const gerenteSelect = document.getElementById('gerente');
    const membrosSelect = document.getElementById('membros');

    // Variáveis do Modal de Edição de Registros
    const editModal = document.getElementById('editModal');
    const btnFecharEditModal = document.getElementById('btn-fechar-edit-modal');
    const btnCancelarEditModal = document.getElementById('btn-cancelar-edit-modal');
    const editForm = document.getElementById('edit-form');
    const areaVoluntariadoContainer = document.getElementById('edit-area-voluntariado');
    const areasVoluntariado = [
        { value: 'educacao', label: 'Educação Ambiental' },
        { value: 'plantio', label: 'Plantio e Manutenção' },
        { value: 'logistica', label: 'Logística e Eventos' },
        { value: 'administrativo', label: 'Administrativo/Marketing' }
    ];

    // Variável da área de conteúdo principal e área de impressão
    const mainContent = document.getElementById('main-content');
    const printArea = document.getElementById('print-area');


    // =======================================================
    // 2. FUNÇÕES AUXILIARES (Máscaras e Formatação)
    // =======================================================
    
    /**
     * Aplica máscara de telefone em tempo real.
     */
    function maskTelefone(value) {
        if (!value) return '';
        value = String(value).replace(/\D/g, ""); 
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); 
        if (value.length > 13) {
            value = value.replace(/(\d{5})(\d{4})$/, "$1-$2"); 
        } else if (value.length > 12) {
            value = value.replace(/(\d{4})(\d{4})$/, "$1-$2"); 
        }
        return value.slice(0, 15); 
    }

    /**
     * Aplica máscara de CPF em tempo real.
     */
    function maskCpf(value) {
        if (!value) return '';
        value = String(value).replace(/\D/g, ""); 
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return value.slice(0, 14); 
    }
    
    /**
     * Função auxiliar para aplicar máscara APENAS para exibição.
     */
    function applyDisplayMask(value, mask) {
        if (!value) return '';
        let masked = '';
        let k = 0;
        const cleanValue = String(value).replace(/\D/g, '');

        for (let i = 0; i < mask.length; i++) {
            if (k >= cleanValue.length) break;
            if (mask[i] === '0') {
                masked += cleanValue[k++];
            } else {
                masked += mask[i];
            }
        }
        return masked;
    }

    /**
     * Função auxiliar para formatar valores de moeda.
     */
    function formatCurrency(value) {
        if (value === undefined || value === null || value === '') {
            value = 0;
        }
        
        const num = parseFloat(value);
        if (isNaN(num)) return 'R$ 0,00';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(num);
    }
    
    /**
     * Retorna a string do badge de status HTML.
     */
    function getStatusBadge(status) {
        const statusMap = {
            'rascunho': 'Rascunho',
            'novo': 'Novo',
            'andamento': 'Em Andamento',
            'concluido': 'Concluído',
            'cancelado': 'Cancelado'
        };
        const displayStatus = statusMap[status] || 'Desconhecido';
        return `<span class="badge status-${status}">${displayStatus}</span>`;
    }


    // =======================================================
    // 3. FUNÇÕES CRUD DE PROJETOS 
    // =======================================================
    
    /**
     * Obtém todos os projetos do localStorage.
     */
    function getProjetos() {
        const projetosJson = localStorage.getItem('projetosONG');
        return projetosJson ? JSON.parse(projetosJson) : [];
    }

    /**
     * Salva a lista completa de projetos no localStorage.
     */
    function saveProjetos(projetos) {
        localStorage.setItem('projetosONG', JSON.stringify(projetos));
    }

    /**
     * Carrega os projetos do localStorage e exibe na tabela.
     */
    function loadProjetos() {
        projetosTableBody.innerHTML = '';
        const projetos = getProjetos();
        
        if (projetos.length === 0) {
            noProjetosRow.style.display = 'table-row';
            loadRegistrations(); 
            return;
        }
        
        noProjetosRow.style.display = 'none';

        projetos.forEach(projeto => {
            const row = document.createElement('tr');
            row.setAttribute('data-projeto-id', projeto.id);
            
            // Busca o nome do gerente 
            const gerenteOption = gerenteSelect.querySelector(`option[value="${projeto.gerente}"]`);
            const gerenteName = gerenteOption ? gerenteOption.textContent : 'N/A';
            
            row.innerHTML = `
                <td>${projeto.id}</td>
                <td>${projeto.titulo}</td>
                <td>${getStatusBadge(projeto.status)}</td>
                <td>${projeto.prazo}</td>
                <td>${gerenteName}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-info btn-editar-projeto">Editar</button>
                    <button class="btn btn-sm btn-danger btn-excluir-projeto">Excluir</button>
                </td>
            `;
            projetosTableBody.appendChild(row);
        });
        
        // Atualiza a métrica de total
        loadRegistrations(); 
    }

    /**
     * Abre o modal de projeto para criação ou edição.
     * (Reseta a seleção múltipla ao CRIAR novo projeto)
     */
    function openProjectModal(projeto = null) {
        formProjeto.reset();
        
        // NOVO: Limpa a seleção múltipla de membros por padrão
        Array.from(membrosSelect.options).forEach(option => {
            option.selected = false;
        });

        if (projeto) {
            modalTitulo.textContent = 'Editar Projeto #' + projeto.id;
            projetoIdInput.value = projeto.id;
            document.getElementById('titulo').value = projeto.titulo;
            document.getElementById('descricao').value = projeto.descricao;
            document.getElementById('data-inicio').value = projeto.data_inicio;
            document.getElementById('prazo').value = projeto.prazo;
            document.getElementById('status').value = projeto.status;
            document.getElementById('prioridade').value = projeto.prioridade;
            document.getElementById('gerente').value = projeto.gerente;
            document.getElementById('orcamento').value = projeto.orcamento;

            // Seleciona múltiplos membros se estiver EDITANDO
            const membrosValues = projeto.membros || [];
            Array.from(membrosSelect.options).forEach(option => {
                option.selected = membrosValues.includes(option.value);
            });
        } else {
            modalTitulo.textContent = 'Criar Novo Projeto';
            projetoIdInput.value = '';
        }
        modalProjeto.style.display = 'block';
    }


    // =======================================================
    // FUNÇÕES CRUD AUXILIARES PARA REGISTROS
    // =======================================================

    /**
     * Obtém todos os Voluntários/Doadores do localStorage.
     */
    function getRegistros() {
        const registrosJson = localStorage.getItem('registrosONG');
        return registrosJson ? JSON.parse(registrosJson) : [];
    }

    /**
     * Salva a lista completa de Voluntários/Doadores no localStorage.
     */
    function saveRegistros(registros) {
        localStorage.setItem('registrosONG', JSON.stringify(registros));
    }


    // =======================================================
    // FUNÇÕES CARREGAMENTO DE REGISTROS E MÉTRICAS
    // =======================================================

    /**
     * Carrega os dados de registro do localStorage e exibe nas tabelas e métricas.
     * calcula as métricas corretamente.
     */
    function loadRegistrations() {
        if (voluntariosTableBody) voluntariosTableBody.innerHTML = '';
        if (doadoresTableBody) doadoresTableBody.innerHTML = '';
        
        const registros = getRegistros(); 
        const projetos = getProjetos(); 
        
        let countVoluntarios = 0;
        let countDoadores = 0;
        
        // Itera sobre os registros e constrói as linhas das tabelas
        registros.forEach(registro => {
            const row = document.createElement('tr');
            
            if (!registro.id) {
                console.warn('Registro encontrado sem ID, ignorando. Necessário ID para exclusão individual.');
                return;
            }

            row.setAttribute('data-registro-id', registro.id); 
            row.setAttribute('data-profile-type', registro.profile_type); 
            
            const actionButtonsHtml = `
                <td class="action-buttons">
                    <button class="btn btn-sm btn-success btn-print-registro">Imprimir/PDF</button>
                    <button class="btn btn-sm btn-info btn-editar-registro">Editar</button>
                    <button class="btn btn-sm btn-danger btn-excluir-registro">Excluir</button>
                </td>
            `;

            if (registro.profile_type === 'voluntario' && voluntariosTableBody) {
                countVoluntarios++;
                
                const areas = Array.isArray(registro.area_voluntariado)
                                             ? registro.area_voluntariado.join(', ')
                                             : (registro.area_voluntariado || 'Não Selecionada');
                
                row.innerHTML = `
                    <td>${registro.nome || ''}</td>
                    <td>${registro.email || ''}</td>
                    <td>${registro.telefone ? applyDisplayMask(registro.telefone, '(00) 00000-0000') : ''}</td>
                    <td>${registro.cpf ? applyDisplayMask(registro.cpf, '000.000.000-00') : ''}</td>
                    <td>${areas}</td>
                    ${actionButtonsHtml}
                `;
                voluntariosTableBody.appendChild(row);
                
            } else if (registro.profile_type === 'doador' && doadoresTableBody) {
                countDoadores++;
                
                let valorDoacao = registro.valor_doacao === 'personalizado' 
                                             ? registro.valor_personalizado 
                                             : registro.valor_doacao;
                
                const valorFormatado = formatCurrency(valorDoacao);
                
                const frequencia = registro.frequencia_doacao === 'mensal'
                                                 ? 'Mensal'
                                                 : (registro.frequencia_doacao === 'unica' ? 'Única' : 'N/A');
                
                const enderecoCompleto = `${registro.endereco || ''}, ${registro.cidade || ''} - ${registro.estado || ''}`;
                const cep = registro.cep ? applyDisplayMask(registro.cep, '00000-000') : 'Não Informado';

                row.innerHTML = `
                    <td>${registro.nome || ''}</td>
                    <td>${registro.email || ''}</td>
                    <td>${valorFormatado}</td>
                    <td>${frequencia}</td>
                    <td>${registro.telefone ? applyDisplayMask(registro.telefone, '(00) 00000-0000') : ''}</td>
                    <td>${enderecoCompleto} (${cep})</td>
                    ${actionButtonsHtml}
                `;
                doadoresTableBody.appendChild(row);
            }
        });
        
        // Atualiza os contadores - CORRIGIDO: Incluindo projetos
        if (totalRegistrosSpan) totalRegistrosSpan.textContent = registros.length + projetos.length;
        if (countVoluntariosSpan) countVoluntariosSpan.textContent = countVoluntarios;
        if (countDoadoresSpan) countDoadoresSpan.textContent = countDoadores;

        // Adiciona/remove mensagem de "não há"
        if (voluntariosTableBody && noVoluntariosRow) {
             noVoluntariosRow.style.display = countVoluntarios === 0 ? 'table-row' : 'none';
        }
        if (doadoresTableBody && noDoadoresRow) {
             noDoadoresRow.style.display = countDoadores === 0 ? 'table-row' : 'none';
        }
    }


    // =======================================================
    // FUNÇÕES EDIÇÃO/EXCLUSÃO (MANTIDAS)
    // =======================================================
    
    /**
     * Preenche o modal de edição com os dados do registro.
     */
    function preencherModalEdicao(registro) {
        document.getElementById('edit-registro-id').value = registro.id;
        document.getElementById('edit-profile-type').value = registro.profile_type;
        document.getElementById('edit-nome').value = registro.nome || '';
        document.getElementById('edit-email').value = registro.email || '';
        document.getElementById('edit-telefone').value = maskTelefone(registro.telefone || '');

        // Zera os displays
        document.getElementById('edit-campos-voluntario').style.display = 'none';
        document.getElementById('edit-campos-doador').style.display = 'none';
        areaVoluntariadoContainer.innerHTML = '';
        
        if (registro.profile_type === 'voluntario') {
            document.getElementById('edit-campos-voluntario').style.display = 'block';
            document.getElementById('edit-cpf').value = maskCpf(registro.cpf || '');

            // Cria checkboxes
            const selectedAreas = Array.isArray(registro.area_voluntariado) ? registro.area_voluntariado : [];
            areasVoluntariado.forEach(area => {
                const checked = selectedAreas.includes(area.value) ? 'checked' : '';
                const checkboxHtml = `
                    <input type="checkbox" id="edit-area-${area.value}" name="area_voluntariado" value="${area.value}" ${checked}>
                    <label for="edit-area-${area.value}" style="margin-right: 15px;">${area.label}</label>
                `;
                areaVoluntariadoContainer.insertAdjacentHTML('beforeend', checkboxHtml);
            });
            
        } else if (registro.profile_type === 'doador') {
            document.getElementById('edit-campos-doador').style.display = 'block';
            document.getElementById('edit-frequencia_doacao').value = registro.frequencia_doacao || 'unica';
            
            let valorDoacao = registro.valor_doacao === 'personalizado' 
                            ? registro.valor_personalizado 
                            : registro.valor_doacao;
            document.getElementById('edit-valor-display').value = formatCurrency(valorDoacao);
            
            const endereco = `${registro.endereco || ''}, ${registro.numero || ''} - ${registro.bairro || ''}, ${registro.cidade || ''} - ${registro.estado || ''}, CEP: ${registro.cep ? applyDisplayMask(registro.cep, '00000-000') : ''}`;
            document.getElementById('edit-endereco-display').value = endereco.trim().replace(/^, | ,|, /g, ', ').replace(/, \)/g, ')');
        }
        
        editModal.style.display = 'block';
    }


    /**
     * Listener para salvar as alterações do registro.
     */
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const registroId = document.getElementById('edit-registro-id').value;
        const profileType = document.getElementById('edit-profile-type').value;
        
        const registros = getRegistros();
        const index = registros.findIndex(r => r.id == parseInt(registroId));
        
        if (index === -1) {
            alert('Erro: Registro não encontrado para salvar.');
            return;
        }

        // Dados comuns
        registros[index].nome = document.getElementById('edit-nome').value.trim();
        registros[index].email = document.getElementById('edit-email').value.trim();
        registros[index].telefone = document.getElementById('edit-telefone').value.replace(/\D/g, ''); // Remove máscara para salvar
        
        if (profileType === 'voluntario') {
            registros[index].cpf = document.getElementById('edit-cpf').value.replace(/\D/g, '');
            
            // Coleta áreas de voluntariado selecionadas
            const selectedAreas = Array.from(document.querySelectorAll('#edit-area-voluntariado input[name="area_voluntariado"]:checked'))
                .map(checkbox => checkbox.value);
            registros[index].area_voluntariado = selectedAreas;
        } 
        
        // Apenas a Frequência é editável para doadores neste modal
        if (profileType === 'doador') {
            registros[index].frequencia_doacao = document.getElementById('edit-frequencia_doacao').value;
        }
        
        saveRegistros(registros);
        loadRegistrations(); 
        editModal.style.display = 'none';
        alert('Registro atualizado com sucesso!');
    });

    // --- FUNÇÃO DE IMPRESSÃO ---
    function printRegistro(registro) {
        if (!registro) {
            alert("Erro: Registro não encontrado para impressão.");
            return;
        }

        const titulo = `Registro Completo: ${registro.profile_type === 'voluntario' ? 'Voluntário' : 'Doador'}`;
        
        let contentHtml = `
            <h2>${titulo} - ${registro.nome || 'Nome Não Informado'}</h2>
            <div class="print-card">
                <h3>Dados Pessoais</h3>
                <div class="print-detail"><strong>Nome:</strong> ${registro.nome || 'N/A'}</div>
                <div class="print-detail"><strong>E-mail:</strong> ${registro.email || 'N/A'}</div>
                <div class="print-detail"><strong>Telefone:</strong> ${registro.telefone ? applyDisplayMask(registro.telefone, '(00) 00000-0000') : 'N/A'}</div>
        `;
        
        if (registro.profile_type === 'voluntario') {
            const areas = Array.isArray(registro.area_voluntariado) ? registro.area_voluntariado.join(', ') : 'N/A';
            
            contentHtml += `
                <div class="print-detail"><strong>CPF:</strong> ${registro.cpf ? applyDisplayMask(registro.cpf, '000.000.000-00') : 'N/A'}</div>
                
                <h3>Detalhes do Voluntário</h3>
                <div class="print-detail"><strong>Áreas de Atuação:</strong> ${areas}</div>
                <div class="print-detail"><strong>Observações:</strong> ${registro.observacoes || 'Nenhuma.'}</div>
            `;
        } else if (registro.profile_type === 'doador') {
            let valorDoacao = registro.valor_doacao === 'personalizado' ? registro.valor_personalizado : registro.valor_doacao;
            const valorFormatado = formatCurrency(valorDoacao);
            const frequencia = registro.frequencia_doacao === 'mensal' ? 'Mensal' : 'Única';
            
            contentHtml += `
                <h3>Detalhes da Doação</h3>
                <div class="print-detail"><strong>Valor:</strong> ${valorFormatado}</div>
                <div class="print-detail"><strong>Frequência:</strong> ${frequencia}</div>
                <div class="print-detail"><strong>Forma de Pagamento:</strong> ${registro.forma_pagamento || 'N/A'}</div>
                
                <h3>Endereço</h3>
                <div class="print-detail"><strong>CEP:</strong> ${registro.cep ? applyDisplayMask(registro.cep, '00000-000') : 'N/A'}</div>
                <div class="print-detail"><strong>Endereço:</strong> ${registro.endereco || 'N/A'}</div>
                <div class="print-detail"><strong>Cidade/Estado:</strong> ${registro.cidade || 'N/A'} / ${registro.estado || 'N/A'}</div>
            `;
        }

        contentHtml += '</div>';

        // Injeta o conteúdo na área de impressão
        printArea.innerHTML = contentHtml;
        
        // Aciona o diálogo de impressão
        window.print();
        
        // Limpa a área de impressão após o fechamento
        setTimeout(() => {
            printArea.innerHTML = '';
        }, 100); 
    }


    // =======================================================
    // LISTENERS DE EVENTOS (TODOS ATIVOS)
    // =======================================================

    // --- MÁSCARAS DE INPUT ---
    document.querySelectorAll('.mask-telefone').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = maskTelefone(e.target.value);
        });
    });

    document.querySelectorAll('.mask-cpf').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = maskCpf(e.target.value);
        });
    });
    
    // --- PROJETOS LISTENERS ---
    
    // Abrir modal para criar projeto
    btnAbrirModalCriar.addEventListener('click', () => {
        openProjectModal();
    });

    // Fechar modais de projeto
    [btnFecharModal, btnCancelarModal].forEach(btn => {
        btn.addEventListener('click', () => {
            modalProjeto.style.display = 'none';
        });
    });
    window.addEventListener('click', (event) => {
        if (event.target == modalProjeto) {
            modalProjeto.style.display = 'none';
        }
    });

    // Salvar/Editar projeto
    formProjeto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let projetos = getProjetos();
        const isEditing = !!projetoIdInput.value;
        // Gera um novo ID se estiver criando
        const currentId = isEditing ? parseInt(projetoIdInput.value) : (projetos.length > 0 ? Math.max(...projetos.map(p => p.id)) + 1 : 1);
        
        // Coletar membros selecionados
        const selectedMembros = Array.from(membrosSelect.selectedOptions).map(option => option.value);

        const novoOuEditadoProjeto = {
            id: currentId,
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            data_inicio: document.getElementById('data-inicio').value,
            prazo: document.getElementById('prazo').value,
            status: document.getElementById('status').value,
            prioridade: document.getElementById('prioridade').value,
            gerente: document.getElementById('gerente').value,
            membros: selectedMembros,
            orcamento: parseFloat(document.getElementById('orcamento').value) || 0,
            ultima_atualizacao: new Date().toISOString().split('T')[0] 
        };

        if (isEditing) {
            const index = projetos.findIndex(p => p.id === currentId);
            if (index !== -1) {
                projetos[index] = novoOuEditadoProjeto;
            }
        } else {
            projetos.push(novoOuEditadoProjeto);
        }
        
        saveProjetos(projetos);
        loadProjetos(); 
        modalProjeto.style.display = 'none';
        alert(`Projeto ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
    });

    // Eventos de clique na tabela de projetos (Editar/Excluir)
    projetosTableBody.addEventListener('click', function(e) {
        const row = e.target.closest('tr');
        if (!row) return;

        const projetoId = parseInt(row.getAttribute('data-projeto-id'));
        const projetos = getProjetos();
        const projeto = projetos.find(p => p.id === projetoId);

        if (e.target.classList.contains('btn-editar-projeto')) {
            if (projeto) {
                openProjectModal(projeto);
            }
        } else if (e.target.classList.contains('btn-excluir-projeto')) {
            if (projeto && confirm(`Tem certeza que deseja EXCLUIR o projeto: "${projeto.titulo}"? Esta ação é irreversível.`)) {
                const projetosAtualizados = projetos.filter(p => p.id !== projetoId);
                saveProjetos(projetosAtualizados);
                alert('Projeto excluído com sucesso.');
                loadProjetos();
            }
        }
    });


    // --- REGISTROS LISTENERS ---
    
    // Eventos de clique na tabela de Voluntários/Doadores (Editar/Excluir/Imprimir)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-excluir-registro') || e.target.classList.contains('btn-editar-registro') || e.target.classList.contains('btn-print-registro')) {
            
            const row = e.target.closest('tr');
            if (!row) return;

            const registroId = row.getAttribute('data-registro-id');
            const profileType = row.getAttribute('data-profile-type');
            
            const registros = getRegistros();
            const registro = registros.find(r => r.id == parseInt(registroId)); 
            
            if (e.target.classList.contains('btn-excluir-registro')) {
                if (confirm(`Tem certeza que deseja EXCLUIR o ${profileType}: "${registro.nome}"? Esta ação é irreversível.`)) {
                    const registrosAtualizados = registros.filter(r => r.id != parseInt(registroId)); 
                    saveRegistros(registrosAtualizados);
                    alert(`${profileType.charAt(0).toUpperCase() + profileType.slice(1)} excluído com sucesso.`);
                    loadRegistrations(); 
                }
            
            } else if (e.target.classList.contains('btn-editar-registro')) {
                if (registro) {
                    preencherModalEdicao(registro);
                } else {
                    alert('Erro: Registro não encontrado para edição.');
                }
            
            } else if (e.target.classList.contains('btn-print-registro')) {
                if (registro) {
                    printRegistro(registro);
                } else {
                    alert('Erro: Registro não encontrado para impressão.');
                }
            }
        }
    });

    // Fechar Modal de Edição de Registro
    [btnFecharEditModal, btnCancelarEditModal].forEach(btn => {
        btn.addEventListener('click', () => {
            editModal.style.display = 'none';
        });
    });
    window.addEventListener('click', (event) => {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    });

    // =======================================================
    // INICIALIZAÇÃO
    // =======================================================
    
    // Carrega projetos primeiro, depois registros/métricas
    loadProjetos(); 
});