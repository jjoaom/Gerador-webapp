const idRadio = 48275;
const url = `https://social.maxcast.com.br/api/mobile-app/${idRadio}`;


async function updatePageWithRadioData() {
  try {
    const response = await fetch(url);
    const radioData = await response.json();

    if (radioData && radioData.data && radioData.data.stream && radioData.data.stream.status) {
      const statusUrl = radioData.data.stream.status;

      const builderID = radioData.data.builder.id;
      const builderURL = radioData.data.builder.url;

      const locutores = `${builderURL}/api/client-app/locutors?builder_id=${builderID}`;
      const locutoresResponse = await fetch(locutores);
      const locutoresData = await locutoresResponse.json();
      console.log(locutoresData);

      const programacao = `${builderURL}/api/client-app/all-programming?builder_id=${builderID}`;
      const programacaoResponse = await fetch(programacao);
      const programacaoData = await programacaoResponse.json();
      console.log(programacaoData);

      const redeSociais = `${builderURL}/api/client-app/contacts-info?builder_id=${builderID}`;
      const redeSociaisResponse = await fetch(redeSociais);
      const redeSociaisData = await redeSociaisResponse.json();
      console.log(redeSociaisData);

      const recados = `${builderURL}/api/client-app/messages?builder_id=${builderID}`;
      const recadosResponse = await fetch(recados);
      const recadosData = await recadosResponse.json();
      console.log(recadosData);

      const enquetes = `${builderURL}/api/client-app/current-poll?builder_id=${builderID}`;
      const enquetesResponse = await fetch(enquetes);
      const enquetesData = await enquetesResponse.json();
      console.log(enquetesData);

      let ta_rodando_musica = false;

      $(document).on("click", "#play_btn", function () {
        ta_rodando_musica = !ta_rodando_musica;
        let player = document.getElementById('player');
        if (ta_rodando_musica) {
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
      });

      //whatsapp
      const phoneNumber = radioData.data.network.phone;
      const msgUriEncoded = encodeURIComponent(`Escute nossa programação - ${radioData.data.config.name}`);

      document.title = radioData.data.config.name;

      //app
      $('#img_logo').attr('src', radioData.data.images.icon);
      $('#player').attr('src', radioData.data.stream.url);
      $('#website').attr('href', radioData.data.network.website);
      $('#facebook').attr('href', radioData.data.network.facebook);
      $('#whatsapp').attr('href', `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${msgUriEncoded}`, "_blank");

      const updateSongInfo = async () => {
        try {
          const statusResponse = await fetch(statusUrl);
          const statusData = await statusResponse.json();

          // Atualizar nome da música, capa e letra
          $('#letra_p').html(statusData.playing.current);
          $('#modalTitulo').html(statusData.playing.title);
          $('#modalArtista').html(statusData.playing.name);
          $('#modalLetra').html(statusData.song_data.lyric);
          $('#coverAlbum').attr('src', statusData.song_data.cover);
        } catch (error) {
          console.error('Erro ao buscar dados da API de status:', error);
        }
      };

      // Chamar a função para atualizar as informações da música ao iniciar
      updateSongInfo();

      // intervalo para chamar a função de atualização a cada 10 segundos
      setInterval(updateSongInfo, 10000);


      const colors = radioData.data.config.colors;
      $('#theme-color').attr('content', colors.primary);
      $('body').css('background', colors.primary);
      $('#letra_nome').css('background-color', colors.primary);
      $('#icon').css('background-color', colors.primary);
      $('#menu').css('background-color', colors.primary);
      $('.icons').css('color', colors.primary);

      let svgBase = `<svg xmlns='http://www.w3.org/2000/svg'  width='540' height='450' viewBox='0 0 1080 900'><rect fill='${colors.primary}' width='1080' height='900'/><g fill-opacity='.1'><polygon fill='#444' points='90 150 0 300 180 300'/><polygon points='90 150 180 0 0 0'/><polygon fill='#AAA' points='270 150 360 0 180 0'/><polygon fill='#DDD' points='450 150 360 300 540 300'/><polygon fill='#999' points='450 150 540 0 360 0'/><polygon points='630 150 540 300 720 300'/><polygon fill='#DDD' points='630 150 720 0 540 0'/><polygon fill='#444' points='810 150 720 300 900 300'/><polygon fill='#FFF' points='810 150 900 0 720 0'/><polygon fill='#DDD' points='990 150 900 300 1080 300'/><polygon fill='#444' points='990 150 1080 0 900 0'/><polygon fill='#DDD' points='90 450 0 600 180 600'/><polygon points='90 450 180 300 0 300'/><polygon fill='#666' points='270 450 180 600 360 600'/><polygon fill='#AAA' points='270 450 360 300 180 300'/><polygon fill='#DDD' points='450 450 360 600 540 600'/><polygon fill='#999' points='450 450 540 300 360 300'/><polygon fill='#999' points='630 450 540 600 720 600'/><polygon fill='#FFF' points='630 450 720 300 540 300'/><polygon points='810 450 720 600 900 600'/><polygon fill='#DDD' points='810 450 900 300 720 300'/><polygon fill='#AAA' points='990 450 900 600 1080 600'/><polygon fill='#444' points='990 450 1080 300 900 300'/><polygon fill='#222' points='90 750 0 900 180 900'/><polygon points='270 750 180 900 360 900'/><polygon fill='#DDD' points='270 750 360 600 180 600'/><polygon points='450 750 540 600 360 600'/><polygon points='630 750 540 900 720 900'/><polygon fill='#444' points='630 750 720 600 540 600'/><polygon fill='#AAA' points='810 750 720 900 900 900'/><polygon fill='#666' points='810 750 900 600 720 600'/><polygon fill='#999' points='990 750 900 900 1080 900'/><polygon fill='#999' points='180 0 90 150 270 150'/><polygon fill='#444' points='360 0 270 150 450 150'/><polygon fill='#FFF' points='540 0 450 150 630 150'/><polygon points='900 0 810 150 990 150'/><polygon fill='#222' points='0 300 -90 450 90 450'/><polygon fill='#FFF' points='0 300 90 150 -90 150'/><polygon fill='#FFF' points='180 300 90 450 270 450'/><polygon fill='#666' points='180 300 270 150 90 150'/><polygon fill='#222' points='360 300 270 450 450 450'/><polygon fill='#FFF' points='360 300 450 150 270 150'/><polygon fill='#444' points='540 300 450 450 630 450'/><polygon fill='#222' points='540 300 630 150 450 150'/><polygon fill='#AAA' points='720 300 630 450 810 450'/><polygon fill='#666' points='720 300 810 150 630 150'/><polygon fill='#FFF' points='900 300 810 450 990 450'/><polygon fill='#999' points='900 300 990 150 810 150'/><polygon points='0 600 -90 750 90 750'/><polygon fill='#666' points='0 600 90 450 -90 450'/><polygon fill='#AAA' points='180 600 90 750 270 750'/><polygon fill='#444' points='180 600 270 450 90 450'/><polygon fill='#444' points='360 600 270 750 450 750'/><polygon fill='#999' points='360 600 450 450 270 450'/><polygon fill='#666' points='540 600 630 450 450 450'/><polygon fill='#222' points='720 600 630 750 810 750'/><polygon fill='#FFF' points='900 600 810 750 990 750'/><polygon fill='#222' points='900 600 990 450 810 450'/><polygon fill='#DDD' points='0 900 90 750 -90 750'/><polygon fill='#444' points='180 900 270 750 90 750'/><polygon fill='#FFF' points='360 900 450 750 270 750'/><polygon fill='#AAA' points='540 900 630 750 450 750'/><polygon fill='#FFF' points='720 900 810 750 630 750'/><polygon fill='#222' points='900 900 990 750 810 750'/><polygon fill='#222' points='1080 300 990 450 1170 450'/><polygon fill='#FFF' points='1080 300 1170 150 990 150'/><polygon points='1080 600 990 750 1170 750'/><polygon fill='#666' points='1080 600 1170 450 990 450'/><polygon fill='#DDD' points='1080 900 1170 750 990 750'/></g></svg>`;


      $('body').css({
        'background-image': `url("data:image/svg+xml,${encodeURIComponent(svgBase)}")`,
        'background-size': 'auto',
      });


      //contato
      $('#contato').off('click').on('click', function () {
        window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${msgUriEncoded}`, "_blank");
      });


      //redes sociais
      $('#redeFacebook').attr('href', redeSociaisData.result.data.socialsNetworks[2].url);
      $('#redeInstagram').attr('href', redeSociaisData.result.data.socialsNetworks[5].url);
      $('#redeWhatsapp').attr('href', `https://api.whatsapp.com/send?phone=${redeSociaisData.result.data.socialsNetworks[8].url}`);
      $('#redeYoutube').attr('href', redeSociaisData.result.data.socialsNetworks[1].url);


      function createLocutorCard(locutorData) {
        const cardLocutor = document.createElement('div');
        cardLocutor.className = "cardLocutor justify-content-evenly align-items-center row-cols-auto";
        cardLocutor.innerHTML = `
          <div class="card p-2 m-1 col">
            <img class="card-img-top" src="${locutorData.image}" alt="">
            <div class="card-body">
              <h5 class="card-title" id="nameLocutor">${locutorData.nameLocutor}</h5>
              <p class="card-text-truncate overflow-auto" id="descriptionLocutor">${locutorData.descriptionLocutor}</p>
            </div>
          </div>
        `;
        return cardLocutor;
      }

      for (let i = 0; i < locutoresData.result.data.length; i++) {
        const card = createLocutorCard(locutoresData.result.data[i]);
        document.getElementById('contentLocutor').appendChild(card);
      }

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
      //recados
      $('#messageForm').attr('action', `${builderURL}api/client-app/message-board`);
      $('#builderIdR').attr('value', builderID);
      $(document).ready(function () {
        $('#messageForm').submit(function (e) {
          e.preventDefault();
          $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),
            data: $(this).serialize(),
            success: function (response) {
              // Exibir mensagem de sucesso e esconder mensagem de erro, se estiver visível
              $('#success-messageR').text('Recado enviado!').show();
              $('#error-messageR').hide();
            },
            error: function () {
              // Exibir mensagem de erro e esconder mensagem de sucesso, se estiver visível
              $('#error-messageR').text('Ocorreu um erro ao enviar o recado. Por favor, tente novamente.').show();
              $('#success-messageR').hide();
            }
          });
        });
      });
      if (recadosData.result.data.length < 0) {
        const cardRecados = document.createElement('div');
        cardRecados.className = "cardRecados justify-content-evenly align-items-center row-cols-auto";
        cardRecados.innerHTML =
          ` 
          <ul class="list-group">
            <li class="list-group-item">Sem recados no momento</li>
          </ul>
        `;
        document.getElementById('contentRecados').appendChild(cardRecados);
      } else {
        for (let i = 0; i < recadosData.result.data.length; i++) {
          const cardRecados = document.createElement('div');
          cardRecados.className = "cardRecados justify-content-evenly align-items-center row-cols-auto";
          cardRecados.innerHTML =
            ` 
          <ul class="list-group">
            <li class="list-group-item">${recadosData.result.data[i].name} - ${recadosData.result.data[i].comment}</li>
          </ul>
          `;
          document.getElementById('contentRecados').appendChild(cardRecados);
        }
      }
      //Enquete
      // Configuração do formulário para enviar voto na enquete
      $(document).ready(function () {
        $('#enqueteForm').submit(function (e) {
          e.preventDefault();

          // Dados a serem enviados no corpo da solicitação
          const requestData = {
            "disableCaptcha": true,
            "pollId": enquetesData.result.data.id,
            "builder_id": builderID
          };

          console.log("Dados da requisição:", requestData);

          $.ajax({
            url: `${builderURL}/api/client-app/polling`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (response) {
              // Lógica para lidar com a resposta do servidor após o voto ser enviado
              console.log('Voto na enquete enviado com sucesso:', response);
              // Aqui você pode adicionar qualquer lógica adicional, como exibir uma mensagem de sucesso para o usuário
            },
            error: function (xhr, status, error) {
              // Lógica para lidar com erros no envio do voto
              console.error('Erro ao enviar voto na enquete:', error);
              // Aqui você pode adicionar qualquer lógica adicional, como exibir uma mensagem de erro para o usuário
            }
          });
        });
      });

      // Função para criar as opções da enquete
      function criarOpcoesEnquete(enquetesData) {
        const enqueteDiv = document.getElementById('enquetes');

        // Criar opções da enquete
        enquetesData.result.data.options.forEach(option => {
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = 'opcao';
          input.value = option.value;
          input.classList.add('form-check-input');

          const label = document.createElement('label');
          label.classList.add('form-check-label');
          label.textContent = option.label;

          const voteCount = document.createElement('span');
          voteCount.textContent = ` (${option.count} votos)`;
          voteCount.style.opacity = 0; // Inicialmente, esconde a contagem de votos

          const div = document.createElement('div');
          div.classList.add('enquete-option');
          div.appendChild(input);
          div.appendChild(label);
          div.appendChild(voteCount);

          enqueteDiv.appendChild(div);
        });

        // Criar botão para exibir os votos
        const verVotosButton = document.getElementById('verVotosEnquete');
        verVotosButton.addEventListener('click', alternarVotos);
      }

      // Função para mostrar ou ocultar os votos ao clicar no botão "Ver votos"
      function alternarVotos() {
        const enqueteDiv = document.getElementById('enquetes');
        const verVotosButton = document.getElementById('verVotosEnquete');

        if (enqueteDiv.classList.contains('mostrar-votos')) {
          // Se os votos estiverem sendo mostrados, oculta-os
          enqueteDiv.classList.remove('mostrar-votos');
          verVotosButton.textContent = 'Ver votos';
          // Remove as barras de progresso e contagens de votos
          enqueteDiv.querySelectorAll('.progress').forEach(progress => progress.remove());
          enqueteDiv.querySelectorAll('span').forEach(span => span.remove());
        } else {
          // Se os votos estiverem ocultos, mostra-os
          enqueteDiv.classList.add('mostrar-votos');
          verVotosButton.textContent = 'Ocultar votos';
          // Chama a função para mostrar os votos
          mostrarVotos();
        }
      }

      // Função para mostrar os votos ao clicar no botão "Ver votos"
      function mostrarVotos() {
        const enqueteDiv = document.getElementById('enquetes');

        // Mostrar votos e porcentagens
        enquetesData.result.data.options.forEach(option => {
          const optionDiv = enqueteDiv.querySelector(`input[value="${option.value}"]`).parentNode;
          if (optionDiv) {
            const voteCount = optionDiv.querySelector('span');
            if (!voteCount) {
              const newVoteCount = document.createElement('span');
              newVoteCount.textContent = ` (${option.count} votos)`;
              newVoteCount.style.opacity = 1;
              optionDiv.appendChild(newVoteCount);
            }

            const progress = document.createElement('div');
            progress.className = 'progress';

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.role = 'progressbar';
            progressBar.style.width = `${option.percent}%`; // Definir largura da barra de progresso corretamente

            progress.appendChild(progressBar);
            optionDiv.appendChild(progress);
          }
        });

        // Remover evento de clique do botão "Ver votos" para evitar duplicatas
        document.getElementById('verVotosEnquete').removeEventListener('click', mostrarVotos);
      }

      // Adicionar evento de clique ao botão "Ver votos"
      document.getElementById('verVotosEnquete').addEventListener('click', alternarVotos);

      // Chamar função para criar as opções da enquete
      criarOpcoesEnquete(enquetesData);





      //Programação
      // Função para mostrar o conteúdo da programação
      function showProgramacao(day) {
        const programacaoContent = document.getElementById('programacao-content');
        fillProgramacao(day);
        programacaoContent.style.display = 'block';
      }

      // Função para ocultar o conteúdo da programação
      function hideProgramacao() {
        const programacaoContent = document.getElementById('programacao-content');
        programacaoContent.style.display = 'none';
      }

      // Função para preencher o conteúdo do modal com base no dia da semana
      function fillProgramacao(day) {
        const programming = programacaoData.result.data[day]; // Obtém a programação para o dia especificado
        const programacaoContent = document.getElementById('programacao-content');
        programacaoContent.innerHTML = ''; // Limpa o conteúdo anterior
        programacaoContent.classList.add('overflow-auto', 'p-3');

        programming.forEach(program => {
          // Cria elementos HTML para exibir as informações do programa
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

          const programInfo = document.createElement('div');
          programInfo.classList.add('d-flex', 'align-items-center');

          const programImg = document.createElement('img');
          programImg.src = program.imageLocutor;
          programImg.alt = program.nameLocutor;
          programImg.style.width = '45px';
          programImg.style.height = '45px';
          programImg.classList.add('rounded-circle');

          const programDetails = document.createElement('div');
          programDetails.classList.add('ms-3');

          const programName = document.createElement('p');
          programName.classList.add('fw-bold', 'mb-1');
          programName.textContent = program.nameProgram;

          const programLocutor = document.createElement('p');
          programLocutor.classList.add('text-muted', 'mb-0');
          programLocutor.textContent = `Apresentado por: ${program.nameLocutor}`;

          const programTime = document.createElement('p');
          programTime.classList.add('btn', 'btn-link', 'btn-rounded', 'btn-sm', 'mb-0');
          programTime.textContent = `${program.hourInit} - ${program.hourFinish}`;

          // Adiciona os elementos criados ao conteúdo do modal
          programDetails.appendChild(programName);
          programDetails.appendChild(programLocutor);
          programInfo.appendChild(programImg);
          programInfo.appendChild(programDetails);
          listItem.appendChild(programInfo);
          listItem.appendChild(programTime);
          programacaoContent.appendChild(listItem);
        });
      }



      // Função para mostrar o conteúdo do modal quando um botão é clicado
      function onButtonClick(day) {
        const programacaoContent = document.getElementById('programacao-content');
        if (programacaoContent.style.display === 'none') {
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



    } else {
      console.error('Dados da API ausentes ou inválidos.');
    }
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
  }
}



let deferredPrompt;

const installButton = document.querySelector('#install-button-pwa');
const rejectButton = document.querySelector('#reject-button');
const installCard = document.querySelector('#install-card');

async function installPwa() {
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
    e.preventDefault();
    deferredPrompt = e;
    installCard.style.display = 'block';
    if (typeof notInstalledFunction === 'function') {
      notInstalledFunction();
    }
  });

  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
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
      deferredPrompt = null;
    } else {
      console.warn('Não foi possível instalar o aplicativo');
      console.warn(deferredPrompt);
    }
  });

  rejectButton.addEventListener('click', () => {
    installCard.style.display = 'none';
    if (typeof rejectFunction === 'function') {
      rejectFunction();
    }
  });

}


// Chamar a função para instalar o PWA
installPwa();
// Chamar a função para atualizar a página com os dados da API e atualizá-la periodicamente
window.addEventListener('DOMContentLoaded', updatePageWithRadioData);
document.addEventListener('DOMContentLoaded', function () {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const iosInstallPrompt = document.querySelector('#ios-install-prompt');
  const installCard = document.querySelector('#install-card');
  

  if (iOS) {
    iosInstallPrompt.style.display = 'block';
    installCard.style.display = 'none';
  } else {
    iosInstallPrompt.style.display = 'none';
    installCard.style.display = 'block';
  }

  $('#ios-install-prompt').parent().on('click', '#closeios', function () {
    // Oculta a div com efeito de desvanecimento
    $("#ios-install-prompt").fadeOut();
  });
});