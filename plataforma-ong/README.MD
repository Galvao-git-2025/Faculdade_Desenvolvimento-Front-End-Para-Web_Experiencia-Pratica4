# 🌱 Plataforma ONG — Semeando o Futuro

Plataforma web desenvolvida para gerenciamento e divulgação de projetos de uma ONG, com foco em sustentabilidade, educação e meio ambiente, permitindo o cadastro e administração de projetos, exibição pública de iniciativas e acesso a relatórios.

## 🌍 Visão Geral

A **Plataforma ONG — Semeando o Futuro** foi criada para otimizar a gestão de projetos sociais e ambientais, permitindo que administradores possam cadastrar novas iniciativas e compartilhar relatórios de impacto.

A aplicação possui duas áreas principais:

- **Área pública:** onde visitantes visualizam projetos, campanhas e relatórios, além de se cadastrarem como doadores ou voluntários junto a essas iniciativas.

- **Área administrativa:** onde gestores autenticados podem gerenciar projetos e acessar informações internas.

## ⚙️ Páginas e suas finalidades no projeto

✅ **Página inicial (index.html)**  
Apresenta informações institucionais da ONG, banner principal e destaques de projetos, além da possibilidade de cadastro.

✅ **Listagem de projetos (projetos.html)**  
Exibe os projetos ativos com descrições, imagens e links para informações e castro.

✅ **Cadastro de novos usuários (cadastro.html)**  
Permite o registro de novos doadores e/ou voluntários.

✅ **Login administrativo (admin-login.html)**  
Tela de autenticação para acesso ao painel de controle da ONG.

✅ **Painel administrativo (admin-dashboard.html)**  
Interface para gerenciamento de projetos, visualização de relatórios e controle de dados internos.

✅ **Relatórios (assets/relatorios)**  
PDFs com resultados e métricas de impacto dos projetos da ONG.


## 🧩 Estrutura do Projeto

plataforma-ong/
        admin-dashboard.html
        admin-login.html
        cadastro.html
        index.html
        projetos.html
        assets/
            relatorios/
                relatorio-escola-digital.pdf
                relatorio-reflorestamento.pdf
        css/
            style.css
        images/
            banner-home.jpg
            medico-com-estetoscopio.jpg
            projeto-agua.jpg
            projeto-educacao.jpg
            projeto-reflorestamento.jpg
        js/
            admin-dashboard.js
            main.js

## 🛠️ Tecnologias Utilizadas

- **HTML5** — Estrutura semântica e responsiva  
- **CSS3** — Estilização com layout flexível e design limpo  
- **JavaScript (ES6)** — Interatividade e manipulação dinâmica de elementos  
- **Arquivos PDF** — Relatórios informativos e downloads  
- **Imagens otimizadas** — Recursos visuais dos projetos

## 💻 -Principais Funcionalidades:

## 👥 Cadastro de Doadores e Voluntários

A plataforma permite o cadastro de novos doadores e voluntários através da página cadastro.html.
Esse formulário coleta informações essenciais para identificar e manter contato com os participantes das ações da ONG.

🧾 Etapas para realizar o cadastro:

1.	Acesse o formulário:
Acesse o arquivo cadastro.html através dos links: “Quero Ajudar”, “Doe Agora ou Seja Voluntário” na página Inicial; “Quero Ajudar”, “Seja Voluntário”, “Seja Voluntário em futuros projetos”, “Cadastrar como Voluntário” e “Realizar Doação” na página Projetos;.

2.	Preencha seus dados pessoais:
o Nome completo
o E-mail
o Telefone de contato
o Endereço (opcional)
o CPF ou documento de identificação

3.	Escolha o tipo de participação:
o 🩵 Doação: Para apoiar financeiramente os projetos da ONG.
o 🌿 Voluntariado: Para atuar em campo ou em ações de apoio.

4.	Confirme o envio:
Clique em “Finalizar Cadastro”.
Uma mensagem de confirmação será exibida após o envio bem-sucedido.

5.	Validação administrativa:
Os administradores poderão visualizar e validar os novos cadastros pelo painel administrativo (admin-dashboard.html).


## 📊 Visualização de Relatórios

Os relatórios estão dentro da pasta do projeto: assets/relatorios/, e podem ser visualizados e impressos através dos links disponibilizados através dos botões respectivos na área “Acesse os Relatórios Completos (PDF):” na página Inicial (index.html). Também, podem ser  disponibilizados em algum projeto informado na área “Projetos Ativos por Categoria”, localizada na página Projeto(projetos.html).

## 🧭 Painel Administrativo — `admin-dashboard.html`
## Gerenciamento de Projetos
o 🧩 Criar 
o ✏️ Editar
o ❌ Excluir

## 👥Voluntários Cadastrados
o 🖨️ Imprimir/PDF
o ✏️Editar
o ❌Excluir

## 💪💪Doadores Cadastrados
o 🖨️ Imprimir/PDF
o ✏️Editar
o ❌Excluir

