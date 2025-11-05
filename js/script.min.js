/* ===============================================
JAVASCRIPT MODULAR - SCRIPT COMPLETO E REORGANIZADO
O 'DOMContentLoaded' garante que todo o código 
só rode depois que o HTML estiver pronto.
===============================================
*/
document.addEventListener('DOMContentLoaded', function() {

  // --- ELEMENTOS GLOBAIS (Menu) ---
  const botaoHamburguer = document.getElementById('menu-hamburguer');
  const listaMenu = document.getElementById('menu-lista');
  
  // --- 1. FUNCIONALIDADE: MENU HAMBÚRGUER ---
   
  if (botaoHamburguer && listaMenu) {
    botaoHamburguer.addEventListener('click', function() {
      listaMenu.classList.toggle('menu-aberto');
      botaoHamburguer.classList.toggle('ativo');
      const estaAberto = listaMenu.classList.contains('menu-aberto');
      botaoHamburguer.setAttribute('aria-expanded', estaAberto);
      botaoHamburguer.setAttribute('aria-label', estaAberto ? 'Fechar menu' : 'Abrir menu');
    });
  }

  // --- 2. FUNCIONALIDADE: MÁSCARAS (Definição da Função) ---
  // 
  
  // Função Auxiliar (privada para 'inicializarMascaras')
  const aplicarMascara = (input, pattern, maxLength) => {
    // Pega o valor atual, removendo tudo que NÃO for número
    let valor = input.value.replace(/\D/g, ''); 
    let valorMascarado = '';

    // Limita o tamanho máximo
    if (valor.length > maxLength) {
      valor = valor.substring(0, maxLength);
    }

    // Itera sobre o padrão (pattern) e o valor (só números)
    let i = 0;
    let j = 0;
    while (i < pattern.length && j < valor.length) {
      if (pattern[i] === 'X') {
        valorMascarado += valor[j];
        j++;
      } else {
        valorMascarado += pattern[i];
      }
      i++;
    }
    input.value = valorMascarado;
  };

  function inicializarMascaras() {
    const inputCPF = document.getElementById('cpf');
    const inputTelefone = document.getElementById('telefone');
    const inputCEP = document.getElementById('cep');

    if (inputCPF) {
      inputCPF.addEventListener('input', () => {
        aplicarMascara(inputCPF, 'XXX.XXX.XXX-XX', 11);
      });
    }
    if (inputTelefone) {
      inputTelefone.addEventListener('input', () => {
        aplicarMascara(inputTelefone, '(XX) XXXXX-XXXX', 11);
      });
    }
    if (inputCEP) {
      inputCEP.addEventListener('input', () => {
        aplicarMascara(inputCEP, 'XXXXX-XXX', 8);
      });
    }
  }

  // --- 3. FUNCIONALIDADE: VALIDAÇÃO (Definição da Função) ---
  // (Esta é a função que será chamada na carga e na navegação SPA)
  
  function inicializarValidacaoFormulario() {
    const form = document.getElementById('form-principal-cadastro');
    const alertaSucesso = document.getElementById('alerta-sucesso');
    const alertaErro = document.getElementById('alerta-erro');

    if (form && alertaSucesso && alertaErro) {
      form.addEventListener('submit', function(event) {
        // 1. Prevenir o Comportamento Padrão
        event.preventDefault(); 
        
        // 2. Esconder alertas antigos
        alertaSucesso.classList.add('hidden');
        alertaErro.classList.add('hidden');

        // 3. Verificar a Validade
        if (form.checkValidity()) {
          alertaSucesso.classList.remove('hidden');
          window.scrollTo(0, 0);
        } else {
          alertaErro.classList.remove('hidden');
          window.scrollTo(0, 0);
        }
      });
    }
  }

  // --- 4. FUNCIONALIDADE: ROTEAMENTO BÁSICO SPA (ENTREGA III) ---
  
  const mainContainer = document.querySelector('main.container');

  const carregarConteudo = async (url) => {
    try {
      // Busca o arquivo HTML
      const resposta = await fetch(url);
      if (!resposta.ok) {
        throw new Error(`Erro: ${resposta.status}`);
      }
      const textoHtml = await resposta.text();
      
      // Converte o texto em um documento
      const parser = new DOMParser();
      const doc = parser.parseFromString(textoHtml, 'text/html');
      
      // Pega o <main> e o <title> novos
      const novoMain = doc.querySelector('main.container');
      const novoTitulo = doc.querySelector('title').innerText;

      if (novoMain && mainContainer) {
        // 4.1. Injeta o novo conteúdo
        mainContainer.innerHTML = novoMain.innerHTML; 
        document.title = novoTitulo; // Atualiza o título da aba
        
        // 4.2. RE-INICIALIZA O JS DO FORMULÁRIO (se a página for o cadastro)
        // 
        inicializarMascaras();
        inicializarValidacaoFormulario();
        
      } else {
        // Fallback: Se algo der errado, recarrega a página
        window.location.href = url;
      }
    } catch (erro) {
      console.error('Erro no roteamento SPA:', erro);
      window.location.href = url; // Fallback
    }
  };

  // 5. Interceptar cliques nos links do menu
  const linksSPA = document.querySelectorAll('.menu-principal a[href$=".html"]');

  linksSPA.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Impede o recarregamento
      const url = link.getAttribute('href');
      
      // Atualiza a URL na barra (sem recarregar)
      history.pushState(null, '', url);
      
      // Carrega o novo conteúdo
      carregarConteudo(url);

      // Fecha o menu mobile (se estiver aberto)
      if (listaMenu.classList.contains('menu-aberto')) {
        listaMenu.classList.remove('menu-aberto');
        botaoHamburguer.classList.remove('ativo');
        botaoHamburguer.setAttribute('aria-expanded', 'false');
        botaoHamburguer.setAttribute('aria-label', 'Abrir menu');
      }
    });
  });

  // --- INICIALIZAÇÃO (Roda na primeira carga) ---
  // (Garante que as máscaras e a validação funcionem na página
  // que foi carregada primeiro (ex: index.html ou cadastro.html))
  inicializarMascaras();
  inicializarValidacaoFormulario();

}); // <-- FIM DO 'DOMContentLoaded'