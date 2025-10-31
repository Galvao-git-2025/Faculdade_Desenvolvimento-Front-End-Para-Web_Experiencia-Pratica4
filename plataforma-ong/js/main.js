// Arquivo: js/main.js - Versão FINAL 

    document.addEventListener('DOMContentLoaded', () => {
        
        // Funcionalidade de Menu Responsivo (GLOBAL)
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');

        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navList.classList.toggle('active');
            });
        }
        
        // Lazy Loading Simples para Imagens (GLOBAL)
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            let lazyLoadObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        // Atenção: A linha abaixo é uma simplificação. Se a imagem tiver um atributo data-src, use-o.
                        // Para fins de demonstração, deixamos como está, já que o seu código original mantinha assim.
                        lazyImage.src = lazyImage.src; 
                        lazyImage.removeAttribute('loading');
                        lazyLoadObserver.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach(lazyImage => {
                lazyLoadObserver.observe(lazyImage);
            });
        }

        /* ---------------------------------------------------- */
        /* LÓGICA ESPECÍFICA DA PÁGINA: PROJETOS (projetos.html) */
        /* ---------------------------------------------------- */
        const filterButtons = document.querySelectorAll('.project-filters input[name="category"]');
        const projectCards = document.querySelectorAll('.project-card');

        if (filterButtons.length > 0 && projectCards.length > 0) { 
            function filterProjects(selectedCategory) {
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.style.display = 'block'; 
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            filterButtons.forEach(button => {
                button.addEventListener('change', (event) => {
                    const selectedCategory = event.target.value;
                    filterProjects(selectedCategory);
                });
            });
        }

        /* ---------------------------------------------------- */
        /* LÓGICA ESPECÍFICA DA PÁGINA: CADASTRO (registro.html) */
        /* ---------------------------------------------------- */
        
        const registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            
            // ** DECLARAÇÃO DE VARIÁVEIS EXISTENTES **
            const cpfInput = document.getElementById('cpf');
            const telefoneInput = document.getElementById('telefone');
            const cepInput = document.getElementById('cep');
            const enderecoInput = document.getElementById('endereco'); 
            const cidadeInput = document.getElementById('cidade'); 
            
            const profileTypeRadios = document.querySelectorAll('input[name="profile_type"]');
            const voluntarioFields = document.getElementById('voluntario-fields');
            // Inicializa como array vazio se o elemento não existir
            const voluntarioCheckboxes = voluntarioFields ? voluntarioFields.querySelectorAll('input[type="checkbox"]') : [];

            // ** NOVAS VARIÁVEIS PARA DOAÇÃO **
            const doadorFields = document.getElementById('doador-fields'); // Novo fieldset de doação (deve estar no HTML)
            const outroValorRadio = document.getElementById('outro-valor');
            const valorPersonalizadoInput = document.getElementById('valor_personalizado');
            const valorDoacaoRadios = document.querySelectorAll('input[name="valor_doacao"]');
            const successMessage = document.getElementById('success-message'); // Já existia, mas declarada globalmente para o submit

            // Função para aplicar Máscara de Input 
            const applyMask = (input, mask) => {
                if (!input) return;
                input.addEventListener('input', (event) => {
                    let value = event.target.value.replace(/\D/g, ''); 
                    let masked = '';
                    let k = 0;

                    for (let i = 0; i < mask.length; i++) {
                        if (k >= value.length) break;

                        if (mask[i] === '0') {
                            masked += value[k++];
                        } else {
                            masked += mask[i];
                        }
                    }
                    event.target.value = masked;
                });
            };

            // Aplicação de Máscaras
            applyMask(cpfInput, '000.000.000-00');
            applyMask(telefoneInput, '(00) 00000-0000');
            applyMask(cepInput, '00000-000');


            // --------------------------------------------------------
            // LÓGICA DE VALOR PERSONALIZADO PARA DOAÇÃO
            // --------------------------------------------------------
            function updateCustomDonationField() {
                if (!outroValorRadio || !valorPersonalizadoInput) return;
                
                const isOutro = outroValorRadio.checked;
                
                // Remove o valor do campo personalizado se não estiver selecionado
                if (!isOutro) {
                    valorPersonalizadoInput.value = '';
                }
                
                // Gerencia o estado 'disabled'
                valorPersonalizadoInput.disabled = !isOutro;
                
                if (isOutro) {
                    // Adiciona 'required' apenas se 'Outro Valor' estiver selecionado
                    valorPersonalizadoInput.setAttribute('required', 'required');
                    valorPersonalizadoInput.setAttribute('min', '10');
                    valorPersonalizadoInput.parentElement.style.display = 'block'; // Assume que o pai é o grupo
                } else {
                    // Remove 'required' e o valor se não for 'Outro Valor'
                    valorPersonalizadoInput.removeAttribute('required');
                    valorPersonalizadoInput.removeAttribute('min');
                    valorPersonalizadoInput.parentElement.style.display = 'none'; // Esconde se não for 'Outro Valor'
                }
            }
            
            // Monitora as mudanças nos radios de valor de doação
            valorDoacaoRadios.forEach(radio => {
                radio.addEventListener('change', updateCustomDonationField);
            });
            
            // Inicializa o estado do campo personalizado (pode estar escondido/desabilitado no carregamento)
            updateCustomDonationField();


            // --------------------------------------------------------
            // Lógica Condicional (Alternância de Perfil)
            // --------------------------------------------------------
            const handleProfileChange = () => {
                const selectedProfile = document.querySelector('input[name="profile_type"]:checked')?.value;
                
                // Gerenciamento de Voluntário
                if (voluntarioFields) {
                    const isVoluntario = selectedProfile === 'voluntario';
                    voluntarioFields.style.display = isVoluntario ? 'block' : 'none';
                    
                    // Remove a propriedade 'required' que causava o erro.
                    voluntarioCheckboxes.forEach(cb => cb.required = false);
                }

                // Gerenciamento de Doador (NOVO)
                if (doadorFields) {
                    const isDoador = selectedProfile === 'doador';
                    doadorFields.style.display = isDoador ? 'block' : 'none';

                    // Gerencia 'required' para campos de Doador
                    const doadorRequiredFields = doadorFields.querySelectorAll('select[required]');
                    doadorRequiredFields.forEach(field => {
                        if (isDoador) {
                            field.setAttribute('required', 'required');
                        } else {
                            field.removeAttribute('required');
                        }
                    });
                    
                    // Atualiza o estado do input de valor personalizado se Doador for selecionado
                    if (isDoador) {
                        updateCustomDonationField();
                    } else {
                        // Esconde o campo de valor personalizado se o perfil não for Doador
                        if (valorPersonalizadoInput) {
                            valorPersonalizadoInput.parentElement.style.display = 'none';
                        }
                    }
                }
            };

            profileTypeRadios.forEach(radio => {
                radio.addEventListener('change', handleProfileChange);
            });
            
            // Inicialização de URL e Lógica
            const urlParams = new URLSearchParams(window.location.search);
            const urlType = urlParams.get('type');
            if (urlType === 'voluntario' && document.getElementById('profile-voluntario')) {
                document.getElementById('profile-voluntario').checked = true;
            } else if (urlType === 'doador' && document.getElementById('profile-doador')) {
                document.getElementById('profile-doador').checked = true;
            }
            handleProfileChange();

            // Simulação de Busca de CEP 
            const searchCepButton = document.getElementById('search-cep');
            if (searchCepButton) {
                // ... [Código de Busca CEP real/mock, se houver]
            }

            // --------------------------------------------------------
            // Lógica de Submissão e Persistência Simulada (localStorage)
            // --------------------------------------------------------
            registrationForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                
                // 0. Reset de mensagens de erro customizadas
                voluntarioCheckboxes.forEach(cb => cb.setCustomValidity("")); 
                if (valorPersonalizadoInput) valorPersonalizadoInput.setCustomValidity("");

                // A. VALIDAÇÃO PRIMÁRIA (NATIVA DO FORMULÁRIO)
                if (!registrationForm.checkValidity()) {
                    console.log("Formulário inválido (erros de campos simples).");
                    registrationForm.classList.add('was-validated'); 
                    
                    // Simula o scroll para o primeiro campo inválido
                    const firstInvalid = registrationForm.querySelector(':invalid');
                    if(firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    return; 
                }
                
                // B. VALIDAÇÃO SECUNDÁRIA (CHECKBOXES e DOAÇÃO)
                const selectedProfile = document.querySelector('input[name="profile_type"]:checked')?.value;
                let customValidationFailed = false;
                let finalMessage = "";
                let success = true;

                // B1. Validação de Checkboxes (Voluntário)
                if (selectedProfile === 'voluntario') {
                    const checkedCount = voluntarioFields.querySelectorAll('input[type="checkbox"]:checked').length;
                    
                    if (checkedCount === 0) {
                        customValidationFailed = true;
                        success = false;
                        finalMessage = "⚠️ **Erro no Cadastro de Voluntário.** Por favor, selecione pelo menos uma área de interesse.";
                        
                        // Força a mensagem de erro no primeiro checkbox
                        if (voluntarioCheckboxes.length > 0) {
                            voluntarioCheckboxes[0].setCustomValidity("Selecione pelo menos uma área de voluntariado.");
                            voluntarioCheckboxes[0].reportValidity(); 
                        }
                    }
                }
                
                // B2. Validação e Simulação de Doação (Doador)
                let valorDoacao = '';
                let frequencia = '';

                if (selectedProfile === 'doador' && !customValidationFailed) {
                    let valorDoacaoRadio = document.querySelector('input[name="valor_doacao"]:checked');
                    
                    if (!valorDoacaoRadio) {
                        customValidationFailed = true;
                        success = false;
                        finalMessage = "⚠️ **Erro!** Selecione um valor de doação ou outro valor.";
                        // Tenta forçar a validação em um dos rádios, se existirem
                        if(valorDoacaoRadios.length > 0) valorDoacaoRadios[0].reportValidity();
                    } else {
                        valorDoacao = valorDoacaoRadio.value === 'outro' ? valorPersonalizadoInput.value : valorDoacaoRadio.value;
                    }
                    
                    frequencia = document.getElementById('frequencia_doacao').value;

                    if (valorDoacao && parseFloat(valorDoacao) >= 10 && frequencia) {
                        const valorFormatado = parseFloat(valorDoacao).toFixed(2).replace('.', ',');
                        finalMessage = `💰 **Sucesso na Doação!** O apoio ${frequencia === 'mensal' ? 'mensal' : 'único'} de **R$ ${valorFormatado}** foi simulado com êxito. Agradecemos!`;
                    } else if (!customValidationFailed) {
                        // Caso a validação de min="10" do input number falhe ou faltem dados
                        customValidationFailed = true;
                        success = false;
                        finalMessage = "⚠️ **Erro no processamento da doação.** Verifique se o valor (mínimo R$ 10,00) e a frequência foram informados.";
                        if(valorPersonalizadoInput && valorPersonalizadoInput.validity.valueMissing) valorPersonalizadoInput.reportValidity();
                    }
                }

                if (customValidationFailed) {
                    // Exibe a mensagem de erro customizada
                    if (successMessage) {
                        successMessage.innerHTML = finalMessage;
                        successMessage.style.backgroundColor = '#fff0f0';
                        successMessage.style.borderColor = 'red';
                        successMessage.style.color = 'red';
                        successMessage.style.display = 'block';
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return; // Impede a submissão
                }
                
                // PERSISTÊNCIA E SUCESSO (SÓ EXECUTADO SE TUDO ESTIVER VÁLIDO)

                // Coletar e Persistir Dados (AJUSTADO PARA INCLUIR DADOS DE DOAÇÃO DE FORMA LIMPA)
                const formData = new FormData(registrationForm);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    if (key === 'area_voluntariado') {
                        if (!data[key]) { data[key] = []; }
                        data[key].push(value);
                    } else if (key === 'valor_personalizado' && selectedProfile === 'doador') {
                        // Ignora 'valor_personalizado' se 'outro' não estiver selecionado
                        if (document.getElementById('outro-valor')?.checked) {
                            data['valor_doacao_final'] = parseFloat(value).toFixed(2); // Valor final de doação
                        }
                    } else if (key === 'valor_doacao' && value !== 'outro' && selectedProfile === 'doador') {
                        // Captura o valor de doação pré-selecionado
                        data['valor_doacao_final'] = parseFloat(value).toFixed(2);
                    } else {
                        // Limpa a máscara dos campos antes de salvar, para manter o valor limpo
                        if (key === 'cpf' || key === 'telefone' || key === 'cep') {
                            data[key] = value.replace(/[\.\(\)\-\s]/g, '');
                        } else {
                            data[key] = value;
                        }
                    }
                }
                
                // REMOVE CHAVES DESNECESSÁRIAS QUE PODEM TER SIDO SALVAS VAZIAS PELA FormData
                if (data.profile_type !== 'doador') {
                    delete data.valor_doacao;
                    delete data.frequencia_doacao;
                    delete data.valor_personalizado;
                }
                if (data.profile_type !== 'voluntario') {
                    delete data.area_voluntariado;
                }

                let registros = JSON.parse(localStorage.getItem('registrosONG')) || [];
                registros.push(data);
                localStorage.setItem('registrosONG', JSON.stringify(registros));
                // FIM DA PERSISTÊNCIA

                // Feedback Visual
                if (successMessage) {
                    // Se não for doador, usa a mensagem de sucesso padrão
                    if (selectedProfile === 'voluntario') {
                        finalMessage = `✅ Cadastro de ${data.profile_type} enviado com sucesso! Total de registros: ${registros.length}.`;
                    }

                    successMessage.innerHTML = finalMessage;
                    successMessage.style.backgroundColor = '#e6ffe6';
                    successMessage.style.borderColor = 'green';
                    successMessage.style.color = 'green';
                    successMessage.style.display = 'block';

                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 7000); 
                }

                // Limpeza do Formulário (Reset Agressivo)
                registrationForm.classList.remove('was-validated'); 
                registrationForm.reset(); 

                // Limpeza manual de campos mascarados/endereço (MANTIDO)
                if (cpfInput) cpfInput.value = '';
                if (telefoneInput) telefoneInput.value = '';
                if (cepInput) cepInput.value = '';
                if (enderecoInput) enderecoInput.value = '';
                if (cidadeInput) cidadeInput.value = '';
                
                // Reajustar o Estado Visual Condicional
                handleProfileChange(); 
                
                const submitButton = registrationForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.blur(); 
                }

                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }

        /* ---------------------------------------------------- */
        /* LÓGICA ESPECÍFICA DA PÁGINA: LOGIN ADMIN */
        /* ---------------------------------------------------- */
        
        // 7. Lógica de Login MOCK
        const adminLoginForm = document.getElementById('admin-login-form');
        
        if (adminLoginForm) {
            // Credenciais MOCK
            const MOCK_EMAIL = 'admin@ongsas.org.br';
            const MOCK_PASSWORD = '@ong2025';
            
            adminLoginForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                
                const emailInput = document.getElementById('admin-email');
                const passwordInput = document.getElementById('admin-password');
                
                if (!emailInput || !passwordInput) {
                    alert("Erro interno: Campos de login não encontrados.");
                    return;
                }
                
                const email = emailInput.value.trim();
                const password = passwordInput.value;

                // Validação MOCK
                if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
                    window.location.href = 'admin-dashboard.html'; 
                } else {
                    alert('Credenciais inválidas. Verifique o e-mail e a senha.');
                    emailInput.focus();
                }
            });
        }
    });