#!/bin/bash

sudo yum -y install httpd
sudo systemctl enable httpd
sudo systemctl start httpd

touch /var/www/html/index.html
echo "Hello World" >> /var/www/html/index.html