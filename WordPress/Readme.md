# Local WordPress Development Environment

This repository contains configuration for the local development of a WordPress website.

## Docker

Install [Docker](https://www.docker.com/) locally. If running Windows, switch the Docker configuration to use Linux containers. Then in the project root folder, run `docker-compose up`. This will download and run the containers.

Upon completion, you will be able to access the following pages:

- Wordpress at [localhost:8000](http://localhost:8000/)
- phpMyAdmin at [localhost:8001](http://localhost:8001/)
- MailHog at [localhost:8002](http://localhost:8002/)

## Debugging

The WordPress container is configured with [Xdebug](https://xdebug.org/) and there is a VS Code launch configuration that listens for it. To test, set a breakpoint in `index.php`, run "Listen for Xdebug", and refresh [the page](http://localhost:8000/).

## Email

To ensure the container does not mistakenly send out any emails, `sendmail` is not installed in the WordPress container. However, email can be sent from WordPress to MailHog via SMTP.

The WordPress [WP Mail SMTP](https://wordpress.org/plugins/wp-mail-smtp/) plugin allows for easy configuration of the SMTP settings. After intallation, select "Other SMTP" as the mailer and add the following:

- SMTP Host: mail
- Encryption: none
- SMTP Port: 1025
- Auto TLS: off
- Authentication: off

Alternatively the following script uses PHPMailer directly:

```php
<?php

require_once __DIR__ . '/wp-includes/class-phpmailer.php';

$mailer = new PHPMailer();
$mailer->Host = 'mail';
$mailer->Port = 1025;
$mailer->SMTPAuth = false;
$mailer->Encoding = 'quoted-printable';
$mailer->Mailer = 'smtp';

$mailer->addAddress('hans@example.com', 'Hans Muster');
$mailer->Body = "Hello, Hans!";

if (!$mailer->send()) {
  echo 'Mailer Error: ' . $mailer->ErrorInfo;
} else {
  echo 'Message sent!';
}
```
