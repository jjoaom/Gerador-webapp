<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Configuration
    $rootDir = '/home/newapp/www/testejoaoaquino';
    $templateDir = __DIR__ . '/template';

    // Substitui o valor do idRadio no index.js
    $apiNumber = $_POST['api-number'];
    $idRadio = intval($apiNumber); // Converte para inteiro
    $indexJsPath = $templateDir . '/index.js';
    $indexJsContent = file_get_contents($indexJsPath);
    $indexJsContent = preg_replace('/const idRadio = \d+;/', 'const idRadio = ' . $idRadio . ';', $indexJsContent);
    file_put_contents($indexJsPath, $indexJsContent);

    // Obtém os dados JSON da API
    $apiUrl = 'https://social.maxcast.com.br/api/mobile-app/' . $apiNumber;
    $jsonData = json_decode(file_get_contents($apiUrl), true);

    // Verifica se a obtencao dos dados foi bem-sucedida
    if ($jsonData === null) {
        http_response_code(400);
        echo 'Erro: Nao foi poss vel obter os dados da API.';
        exit;
    }

    // Obtém o valor de data.login do JSON para ser usado como nome da pasta
    $appName = $jsonData['data']['login'];

    // Verifica se o nome do aplicativo já existe
    if (file_exists($rootDir . '/' . $appName)) {
        http_response_code(400);
        echo 'Erro: Ja  existe um App para essa radio. ';
        exit;
    }

    // Caminho do arquivo index.php
    $indexPhpPath = $templateDir . '/index.php';

    // Obtem o conteudo do arquivo index.php
    $indexPhpContent = file_get_contents($indexPhpPath);

    // Altera as tags meta e links conforme as especificacoes do JSON
    $indexPhpContent = preg_replace('/<title id="name">.*?<\/title>/', '<title id="name">' . $jsonData['data']['config']['name'] . '</title>', $indexPhpContent);
    $indexPhpContent = preg_replace('/<meta name="description" content=".*?">/', '<meta name="description" content="' . $jsonData['data']['config']['description'] . '">', $indexPhpContent);
    $indexPhpContent = preg_replace('/<meta property="og:image" content=".*?">/', '<meta property="og:image" content="' . $jsonData['data']['images']['cover'] . '">', $indexPhpContent);
    $indexPhpContent = preg_replace('/<link rel="icon" type="image\/x-icon" href=".*?">/', '<link rel="icon" type="image/x-icon" href="' . $jsonData['data']['images']['icon'] . '">', $indexPhpContent);
    $indexPhpContent = preg_replace('/<link rel="apple-touch-icon" href=".*?">/', '<link rel="apple-touch-icon" href="' . $jsonData['data']['images']['icon'] . '">', $indexPhpContent);
    $indexPhpContent = preg_replace('/<link rel="shortcut icon" href=".*?">/', '<link rel="shortcut icon" href="' . $jsonData['data']['images']['icon'] . '">', $indexPhpContent);
    $indexPhpContent = preg_replace('/<meta name="apple-mobile-web-app-title" id="web-app-title" content=".*?">/', '<meta name="apple-mobile-web-app-title" id="web-app-title" content="' . $jsonData['data']['config']['name'] . '">', $indexPhpContent);

    // Escreve as alteracoes no arquivo index.php
    file_put_contents($indexPhpPath, $indexPhpContent);




    // Continua com o restante do codigo
    $indexJsPath = $templateDir . '/index.js';
    $indexJsContent = file_get_contents($indexJsPath);
    $indexJsContent = preg_replace('/const idRadio = \d+;/', 'const idRadio = ' . $apiNumber . ';', $indexJsContent);
    file_put_contents($indexJsPath, $indexJsContent);


    // Verifica se o objeto images.icon esta em branco
    if (empty($jsonData['data']['images']['icon'])) {
        http_response_code(400);
        echo 'Erro: O app esta sem imagem de ícone';
        exit;
    }

    // Cria o diretório do aplicativo
    mkdir($rootDir . '/' . $appName, 0777, true);

    // Gera o arquivo manifest.webmanifest
    $manifestData = [
        "name" => $jsonData['data']['config']['name'],
        "short_name" => $jsonData['data']['config']['name'],
        "icons" => [
            [
                "src" => $jsonData['data']['images']['icon'],
                "sizes" => "152x152",
                "type" => "image/png"
            ],
            [
                "src" => $jsonData['data']['images']['icon'],
                "sizes" => "167x167",
                "type" => "image/png"
            ],
            [
                "src" => $jsonData['data']['images']['icon'],
                "sizes" => "192x192",
                "type" => "image/png"
            ],
            [
                "src" => $jsonData['data']['images']['icon'],
                "sizes" => "512x512",
                "type" => "image/png"
            ]
        ],
        "start_url" => "index.php",
        "display" => "fullscreen",
        "background_color" => $jsonData['data']['config']['colors']['primary'],
        "theme_color" => $jsonData['data']['config']['colors']['tertiary']
    ];

    // Converte para JSON e salva no arquivo
    $manifestContent = json_encode($manifestData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    file_put_contents($templateDir . '/manifest.webmanifest', $manifestContent);

    // Copia os arquivos para o diretorio do aplicativo
    $filesToCopy = [
        'index.php',
        'index.js',
        'manifest.webmanifest',
        'sw.js',
    ];
    foreach ($filesToCopy as $file) {
        copy($templateDir . '/' . $file, $rootDir . '/' . $appName . '/' . $file);
    }


    $customLink = 'https://newapp.maxcast.com.br/' . urlencode($appName);

    // Mensagem de sucesso com o link personalizado
    echo 'App criado com sucesso! Link: <a href="' . $customLink . '">' . $customLink . '</a>';
}
?>