<?php

require_once('../../wp-load.php');

require_once('../../wp-content/plugins/amazon-s3-and-cloudfront/wp-offload-media-autoloader.php');

use DeliciousBrains\WP_Offload_Media\Aws3\Aws\S3\S3Client;
use DeliciousBrains\WP_Offload_Media\Aws3\Aws\S3\Exception\S3Exception;

$accessKey = 'AKIAUFNR2C4BJIRKIO7K';
$secretKey = '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';
$region = 'us-east-1';
$bucket = 'testuploadimg';

$s3 = new S3Client([
    'version' => 'latest',
    'region'  => $region,
    'credentials' => [
        'key'    => $accessKey,
        'secret' => $secretKey,
    ],
]);

try {

    $filename = 'hola_mundo.txt';
    $fileContent = 'Hola Mundo';

    $result = $s3->putObject([
        'Bucket' => $bucket,
        'Key'    => $filename,
        'Body'   => file_put_contents($filename, $fileContent)
    ]);
    echo "La conexión al bucket de S3 fue exitosa.\n" . $result['ObjectURL'];
} catch (S3Exception $e) {
    echo "Error al realizar la prueba de conexión a S3: " . $e->getMessage();
}