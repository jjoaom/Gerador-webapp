const idRadio = 13019;
const url = `https://social.maxcast.com.br/api/mobile-app/${idRadio}`;
async function fetchRadioData(url) {
  //Essa função busca os dados da API
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
    return null;
  }
}
async function fetchStatusData(statusUrl) {
  //Essa função busca a aba Status dentro da api social
  try {
    const statusResponse = await fetch(statusUrl);
    return await statusResponse.json();
  } catch (error) {
    console.error('Erro ao buscar dados da API de status:', error);
    return null;
  }
}
function updatePlayerControls(player, isPlaying) {
  //Essa função atualiza o player da rádio
  if (isPlaying) {
    player.play();
    $("#play_btn").attr("class", "fa-solid fa-pause fa-2xl");
    $("#play_btn").attr("title", "Pausar");
    $("#play_btn").attr("aria-label", "Pausar");
  } else {
    player.pause();
    $("#play_btn").attr("class", "fa-solid fa-play fa-2xl");
    $("#play_btn").attr("title", "Reproduzir");
    $("#play_btn").attr("aria-label", "Reproduzir");
  }
}
function updateSongInfo(statusData) {
  $('#letra_p').html(statusData.playing.current);
  $('#modalTitulo').html(statusData.playing.title);
  $('#modalArtista').html(statusData.playing.name);
  $('#modalLetra').html(statusData.song_data.lyric);
  $('#coverAlbum').attr('src', statusData.song_data.cover);
}
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
    return null;
  }
}
async function atualizarPaginaApp() {
  try {
    const radioData = await fetchData(url);
    if (!radioData || !radioData.data || !radioData.data.stream || !radioData.data.stream.status) {
      console.error('Dados da API ausentes ou inválidos.');
      return;
    }

    const statusUrl = radioData.data.stream.status;
    const builderID = radioData.data.builder.id;
    const builderURL = radioData.data.builder.url;

    const [locutoresData, programacaoData, redeSociaisData, recadosData, enquetesData, statusData] = await Promise.all([
      fetchData(`${builderURL}/api/client-app/locutors?builder_id=${builderID}`),
      fetchData(`${builderURL}/api/client-app/all-programming?builder_id=${builderID}`),
      fetchData(`${builderURL}/api/client-app/contacts-info?builder_id=${builderID}`),
      fetchData(`${builderURL}/api/client-app/messages?builder_id=${builderID}`),
      fetchData(`${builderURL}/api/client-app/current-poll?builder_id=${builderID}`),
      fetchStatusData(statusUrl)
    ]);

    const player = $('#player')[0];
    let isPlaying = false;

    document.title = radioData.data.config.name;
    $('#img_logo').attr('src', radioData.data.images.icon);
    $('#player').attr('src', radioData.data.stream.url);
    $('#website').attr('href', radioData.data.network.website);
    $('#facebook').attr('href', radioData.data.network.facebook);

    updateSongInfo(statusData);

    setInterval(async () => {
      const updatedStatusData = await fetchStatusData(statusUrl);
      updateSongInfo(updatedStatusData);
    }, 10000);
    //Essas linhas atualizam o CSS do código de acordo com as cores definidas no social
    const colors = radioData.data.config.colors;
    $('#theme-color').attr('content', colors.primary);
    $('body').css('background', colors.primary);
    $('#letra_nome').css('background-color', colors.primary);
    $('#icon').css('background-color', colors.primary);
    $('#menu').css('background-color', colors.primary);
    $('.icons').css('color', colors.primary);
    //Linha responsável por definir o plano de fundo da tela com base em um SVG
    let svgBase = `<svg xmlns='http://www.w3.org/2000/svg'  width='540' height='450' viewBox='0 0 1080 900'><rect fill='${colors.primary}' width='1080' height='900'/><g fill-opacity='.1'><polygon fill='#444' points='90 150 0 300 180 300'/><polygon points='90 150 180 0 0 0'/><polygon fill='#AAA' points='270 150 360 0 180 0'/><polygon fill='#DDD' points='450 150 360 300 540 300'/><polygon fill='#999' points='450 150 540 0 360 0'/><polygon points='630 150 540 300 720 300'/><polygon fill='#DDD' points='630 150 720 0 540 0'/><polygon fill='#444' points='810 150 720 300 900 300'/><polygon fill='#FFF' points='810 150 900 0 720 0'/><polygon fill='#DDD' points='990 150 900 300 1080 300'/><polygon fill='#444' points='990 150 1080 0 900 0'/><polygon fill='#DDD' points='90 450 0 600 180 600'/><polygon points='90 450 180 300 0 300'/><polygon fill='#666' points='270 450 180 600 360 600'/><polygon fill='#AAA' points='270 450 360 300 180 300'/><polygon fill='#DDD' points='450 450 360 600 540 600'/><polygon fill='#999' points='450 450 540 300 360 300'/><polygon fill='#999' points='630 450 540 600 720 600'/><polygon fill='#FFF' points='630 450 720 300 540 300'/><polygon points='810 450 720 600 900 600'/><polygon fill='#DDD' points='810 450 900 300 720 300'/><polygon fill='#AAA' points='990 450 900 600 1080 600'/><polygon fill='#444' points='990 450 1080 300 900 300'/><polygon fill='#222' points='90 750 0 900 180 900'/><polygon points='270 750 180 900 360 900'/><polygon fill='#DDD' points='270 750 360 600 180 600'/><polygon points='450 750 540 600 360 600'/><polygon points='630 750 540 900 720 900'/><polygon fill='#444' points='630 750 720 600 540 600'/><polygon fill='#AAA' points='810 750 720 900 900 900'/><polygon fill='#666' points='810 750 900 600 720 600'/><polygon fill='#999' points='990 750 900 900 1080 900'/><polygon fill='#999' points='180 0 90 150 270 150'/><polygon fill='#444' points='360 0 270 150 450 150'/><polygon fill='#FFF' points='540 0 450 150 630 150'/><polygon points='900 0 810 150 990 150'/><polygon fill='#222' points='0 300 -90 450 90 450'/><polygon fill='#FFF' points='0 300 90 150 -90 150'/><polygon fill='#FFF' points='180 300 90 450 270 450'/><polygon fill='#666' points='180 300 270 150 90 150'/><polygon fill='#222' points='360 300 270 450 450 450'/><polygon fill='#FFF' points='360 300 450 150 270 150'/><polygon fill='#444' points='540 300 450 450 630 450'/><polygon fill='#222' points='540 300 630 150 450 150'/><polygon fill='#AAA' points='720 300 630 450 810 450'/><polygon fill='#666' points='720 300 810 150 630 150'/><polygon fill='#FFF' points='900 300 810 450 990 450'/><polygon fill='#999' points='900 300 990 150 810 150'/><polygon points='0 600 -90 750 90 750'/><polygon fill='#666' points='0 600 90 450 -90 450'/><polygon fill='#AAA' points='180 600 90 750 270 750'/><polygon fill='#444' points='180 600 270 450 90 450'/><polygon fill='#444' points='360 600 270 750 450 750'/><polygon fill='#999' points='360 600 450 450 270 450'/><polygon fill='#666' points='540 600 630 450 450 450'/><polygon fill='#222' points='720 600 630 750 810 750'/><polygon fill='#FFF' points='900 600 810 750 990 750'/><polygon fill='#222' points='900 600 990 450 810 450'/><polygon fill='#DDD' points='0 900 90 750 -90 750'/><polygon fill='#444' points='180 900 270 750 90 750'/><polygon fill='#FFF' points='360 900 450 750 270 750'/><polygon fill='#AAA' points='540 900 630 750 450 750'/><polygon fill='#FFF' points='720 900 810 750 630 750'/><polygon fill='#222' points='900 900 990 750 810 750'/><polygon fill='#222' points='1080 300 990 450 1170 450'/><polygon fill='#FFF' points='1080 300 1170 150 990 150'/><polygon points='1080 600 990 750 1170 750'/><polygon fill='#666' points='1080 600 1170 450 990 450'/><polygon fill='#DDD' points='1080 900 1170 750 990 750'/></g></svg>`;


    $('body').css({
      'background-image': `url("data:image/svg+xml,${encodeURIComponent(svgBase)}")`,
      'background-size': 'auto',
    });






    //contato
    $('#contato').off('click').on('click', function () {
      window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${msgUriEncoded}`, "_blank");
    });

  

    updatePlayerControls(player, isPlaying); // Atualiza os controles do player
    updateSongInfo(statusData); // Atualiza as informações da música

    //redes sociais
    $('#redeFacebook').attr('href', redeSociaisData.result.data.socialsNetworks[2].url);
    $('#redeInstagram').attr('href', redeSociaisData.result.data.socialsNetworks[5].url);
    $('#redeWhatsapp').attr('href', `https://api.whatsapp.com/send?phone=${redeSociaisData.result.data.socialsNetworks[8].url}`);
    $('#redeYoutube').attr('href', redeSociaisData.result.data.socialsNetworks[1].url);


    //Locutores
    function createLocutorCard(locutorData) {
      const cardLocutor = $('<div></div>').addClass("cardLocutor justify-content-evenly align-items-center row-cols-auto");
      cardLocutor.html(`
    <div class="card p-2 m-1 col">
      <img class="card-img-top" src="${locutorData.image}" alt="">
      <div class="card-body">
        <h5 class="card-title" id="nameLocutor">${locutorData.nameLocutor}</h5>
        <p class="card-text-truncate overflow-auto" id="descriptionLocutor">${locutorData.descriptionLocutor}</p>
      </div>
    </div>
  `);
      return cardLocutor;
    }

    $.each(locutoresData.result.data, function (index, locutorData) {
      const card = createLocutorCard(locutorData);
      $('#contentLocutor').append(card);
    });


    //Pedidos de música
    $('#builderIdPM').attr('value', builderID);
    $('#musicRequestForm').attr('action', `${builderURL}api/client-app/request-music`);

    $(document).ready(function () {
      $('#musicRequestForm').submit(function (e) {
        e.preventDefault();
        $.ajax({
          url: $(this).attr('action'),
          method: $(this).attr('method'),
          data: $(this).serialize(),
          success: function (response) {
            // Exibir mensagem de sucesso e esconder mensagem de erro, se estiver visível
            $('#success-messagePM').text('Pedido de música enviado com sucesso!').show();
            $('#error-messagePM').hide();
          },
          error: function () {
            // Exibir mensagem de erro e esconder mensagem de sucesso, se estiver visível
            $('#error-messagePM').text('Ocorreu um erro ao enviar o pedido. Por favor, tente novamente.').show();
            $('#success-messagePM').hide();
          }
        });
      });
    });
    // Configurar o atributo 'action' do formulário de mensagem
    $('#messageForm').attr('action', `${builderURL}api/client-app/message-board`);

    // Definir o valor do atributo 'value' do elemento com ID 'builderIdR'
    $('#builderIdR').val(builderID);

    // Aguardar o documento ser carregado antes de definir os eventos
    $(document).ready(function () {
      // Definir a ação a ser realizada quando o formulário de mensagem for enviado
      $('#messageForm').submit(function (e) {
        e.preventDefault(); // Evitar o comportamento padrão do formulário

        // Enviar uma solicitação AJAX para o endpoint definido no atributo 'action' do formulário
        $.ajax({
          url: $(this).attr('action'),
          method: $(this).attr('method'), 
          data: $(this).serialize(), 
          success: function (response) { 
            $('#success-messageR').text('Recado enviado!').show();
            $('#error-messageR').hide();
          },
          error: function () { 

            $('#error-messageR').text('Ocorreu um erro ao enviar o recado. Por favor, tente novamente.').show();
            $('#success-messageR').hide();
          }
        });
      });
    });

    // Verificar se existem recados para exibir
    if (recadosData.result.data.length <= 0) {
      // Se não houver recados, exibir uma mensagem indicando isso
      const cardRecados = $('<div></div>').addClass("cardRecados justify-content-evenly align-items-center row-cols-auto");
      cardRecados.html(`
    <ul class="list-group">
      <li class="list-group-item">Sem recados no momento</li>
    </ul>
  `);
      $('#contentRecados').append(cardRecados);
    } else {
      // Se houver recados, criar cartões para cada recado e adicioná-los ao elemento com ID 'contentRecados'
      $.each(recadosData.result.data, function (index, recado) {
        const cardRecados = $('<div></div>').addClass("cardRecados justify-content-evenly align-items-center row-cols-auto");
        cardRecados.html(`
      <ul class="list-group">
        <li class="list-group-item">${recado.name} - ${recado.comment}</li>
      </ul>
    `);
        $('#contentRecados').append(cardRecados);
      });
    }



    // Enquete
    function criarOpcoesEnquete(enquetesData) {
      const enqueteDiv = $('#enquetes');

      // Limpar conteúdo existente, se houver
      enqueteDiv.empty();

      if (enquetesData.result.data.length === 0) {
        // Se não houver enquetes disponíveis, exibir mensagem
        const mensagem = $('<p>').text('Nenhuma enquete no momento');
        enqueteDiv.append(mensagem);
        return;
      }

      // Criar opções da enquete
      $.each(enquetesData.result.data.options, function (index, option) {
        const input = $('<input>').attr({
          type: 'radio',
          name: 'opcao',
          value: option.value
        });

        const label = $('<label>').text(option.label).attr('for', option.value);

        const voteCount = $('<span>').text(` (${option.count} votos)`).css('display', 'none');

        const div = $('<div>').addClass('enquete-option').append(input, label, voteCount);

        enqueteDiv.append(div);
      });

      // Criar botão "Ver votos" e adicionar evento de clique
      const verVotosButton = $('<button>').attr({
        type: 'button',
        id: 'verVotosEnquete',
        class: 'btn btn-info btn-rounded'
      }).text('Ver votos').on('click', alternarVotos);

      // Adicionar botão ao final do formulário
      $('#enqueteForm').append(verVotosButton);

      // Criar botão "Votar" e adicionar evento de clique
      const votarButton = $('<button>').attr({
        type: 'button',
        id: 'votarEnquete',
        class: 'btn btn-success btn-rounded'
      }).text('Votar').on('click', enviarVoto);

      // Adicionar botão "Votar" dentro da div contentEnquete
      $('#contentEnquete').append(votarButton);
    }

    // Função para mostrar ou ocultar os votos ao clicar no botão "Ver votos"
    function alternarVotos() {
      const enqueteDiv = $('#enquetes');

      if (enqueteDiv.hasClass('mostrar-votos')) {
        // Se os votos estiverem sendo mostrados, oculta-os
        enqueteDiv.removeClass('mostrar-votos');
        $('#verVotosEnquete').text('Ver votos');
        // Remove as barras de progresso e contagens de votos
        enqueteDiv.find('.progress').remove();
      } else {
        // Se os votos estiverem ocultos, mostra-os
        enqueteDiv.addClass('mostrar-votos');
        $('#verVotosEnquete').text('Ocultar votos');
        // Chama a função para mostrar os votos
        mostrarVotos();
      }
    }

    // Função para enviar o voto
    function enviarVoto() {
      // Capturar a opção selecionada
      const selectedOption = $('input[name="opcao"]:checked').val();

      if (!selectedOption) {
        // Se nenhuma opção estiver selecionada, exibir mensagem de erro
        console.error('Nenhuma opção selecionada');
        return;
      }

      // Dados a serem enviados no corpo da solicitação
      const requestData = {
        "disableCaptcha": true,
        "pollId": selectedOption,
        "builder_id": builderID,
        "optionId": selectedOption
      };

      console.log("Dados da requisição:", requestData);

      $.ajax({
        url: `${builderURL}/api/client-app/polling`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (response) {
          console.log('Voto na enquete enviado com sucesso:', response);
          exibirMensagemSucesso();
        },
        error: function (xhr, status, error) {

          console.error('Erro ao enviar voto na enquete:', error);
        
        }
      });
    }

    // Função para mostrar os votos
    function mostrarVotos() {
      const enqueteDiv = $('#enquetes');

      // Mostrar votos e porcentagens
      $.each(enquetesData.result.data.options, function (index, option) {
        const optionDiv = enqueteDiv.find(`input[value="${option.value}"]`).parent();
        if (optionDiv.length) {
          const voteCount = optionDiv.find('span');
          if (!voteCount.length) {
            const newVoteCount = $('<span>').text(` (${option.count} votos)`).css('opacity', 1);
            optionDiv.append(newVoteCount);
          }

          const progress = $('<div>').addClass('progress');

          const progressBar = $('<div>').addClass('progress-bar overflow-visible text-dark justify-content-center').attr({
            role: 'progressbar',
            style: `width: ${option.percent}%`, // Definir largura da barra de progresso corretamente
            'aria-valuenow': option.count,
            'aria-valuemin': 0,
            'aria-valuemax': enquetesData.result.data.total_votes
          }).text(option.count + " votos"); // Adiciona o número de votos dentro da barra de progresso

          progress.append(progressBar);
          optionDiv.append(progress);
        }
      });
    }

    // Função para exibir mensagem de sucesso
    function exibirMensagemSucesso() {
      const alertaSucesso = `
<div class="alert alert-success alert-dismissible fade show" role="alert">
Voto registrado com sucesso!
<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
`;
      // Adicionar alerta de sucesso ao DOM
      $('#contentEnquete').append(alertaSucesso);
    }

    // Chamar função para criar as opções da enquete
    criarOpcoesEnquete(enquetesData);




    // Função para mostrar o conteúdo da programação
    function showProgramacao(day) {
      fillProgramacao(day);
      $('#programacao-content').css('display', 'block');
    }

    // Função para ocultar o conteúdo da programação
    function hideProgramacao() {
      $('#programacao-content').css('display', 'none');
    }

    // Função para preencher o conteúdo do modal com base no dia da semana
    function fillProgramacao(day) {
      const programming = programacaoData.result.data[day]; // Obtém a programação para o dia especificado
      const programacaoContent = $('#programacao-content');
      programacaoContent.empty(); // Limpa o conteúdo anterior
      programacaoContent.addClass('overflow-auto p-3');

      programming.forEach(program => {
        // Cria elementos HTML para exibir as informações do programa
        const listItem = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center');
        const programInfo = $('<div>').addClass('d-flex align-items-center');
        const programImg = $('<img>').attr({
          src: program.imageLocutor,
          alt: program.nameLocutor
        }).css({
          width: '45px',
          height: '45px'
        }).addClass('rounded-circle');
        const programDetails = $('<div>').addClass('ms-3');
        const programName = $('<p>').addClass('fw-bold mb-1').text(program.nameProgram);
        const programLocutor = $('<p>').addClass('text-muted mb-0').text(`Apresentado por: ${program.nameLocutor}`);
        const programTime = $('<p>').addClass('btn btn-link btn-rounded btn-sm mb-0').text(`${program.hourInit} - ${program.hourFinish}`);

        // Adiciona os elementos criados ao conteúdo do modal
        programDetails.append(programName, programLocutor);
        programInfo.append(programImg, programDetails);
        listItem.append(programInfo, programTime);
        programacaoContent.append(listItem);
      });
    }

    // Função para mostrar o conteúdo do modal quando um botão é clicado
    function onButtonClick(day) {
      const programacaoContent = $('#programacao-content');
      if (programacaoContent.css('display') === 'none') {
        showProgramacao(day);
      } else {
        hideProgramacao();
        setTimeout(() => showProgramacao(day), 300); // Pequeno atraso para garantir que o conteúdo anterior seja removido antes de exibir o novo
      }
    }

    // Adiciona eventos de clique aos botões para mostrar o conteúdo do modal com a programação correspondente
    document.getElementById('dom-btn').addEventListener('click', () => onButtonClick('DOM'));
    document.getElementById('seg-btn').addEventListener('click', () => onButtonClick('SEG'));
    document.getElementById('ter-btn').addEventListener('click', () => onButtonClick('TER'));
    document.getElementById('qua-btn').addEventListener('click', () => onButtonClick('QUA'));
    document.getElementById('qui-btn').addEventListener('click', () => onButtonClick('QUI'));
    document.getElementById('sex-btn').addEventListener('click', () => onButtonClick('SEX'));
    document.getElementById('sab-btn').addEventListener('click', () => onButtonClick('SAB'));

  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
  }
}
async function installPwa() {
  let deferredPrompt;

  const installButton = $('#install-button-pwa');
  const rejectButton = $('#reject-button');
  const installCard = $('#install-card');

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
    } catch (err) {
      console.warn(`ServiceWorker registration failed: ${err}`);
    }
  } else {
    console.warn('Service Worker is not supported in this browser.');
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Evita que o prompt de instalação padrão apareça
    deferredPrompt = e; // Atribui o evento à variável deferredPrompt para uso posterior
    installCard.css('display', 'block'); // Exibe o cartão de instalação
  });

  installButton.on('click', async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt(); // Mostra o prompt de instalação
        const choiceResult = await deferredPrompt.userChoice;
        console.warn(choiceResult.outcome);
        if (choiceResult.outcome === 'dismissed') {
          console.warn('User cancelled home screen install');
          if (typeof rejectFunction === 'function') {
            rejectFunction();
          }
        } else {
          console.warn('User added to home screen');
          if (typeof installFunction === 'function') {
            installFunction();
          }
        }
      } catch (err) {
        console.error('Erro ao chamar prompt de instalação:', err);
      } finally {
        deferredPrompt = null; // Limpa o objeto deferredPrompt
      }
    } else {
      console.warn('Não foi possível instalar o aplicativo');
      console.warn(deferredPrompt);
    }
  });

  rejectButton.on('click', () => {
    installCard.css('display', 'none');
    if (typeof rejectFunction === 'function') {
      rejectFunction();
    }
  });
}
$(document).ready(function () {
  atualizarPaginaApp();
  // Chamar a função para instalar o PWA
  installPwa();
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const iosInstallPrompt = $('#ios-install-prompt');
  const installCard = $('#install-card');

  if (iOS) {
    iosInstallPrompt.css('display', 'block');
    installCard.css('display', 'none');
  } else {
    iosInstallPrompt.css('display', 'none');
    installCard.css('display', 'block');
  }

  $('#ios-install-prompt').parent().on('click', '#closeios', function () {
    // Oculta a div com efeito de desvanecimento
    $("#ios-install-prompt").fadeOut();
  });
});
