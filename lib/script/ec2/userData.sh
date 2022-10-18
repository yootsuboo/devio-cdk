#!/bin/bash

sudo yum -y install httpd
sudo systemctl enable httpd
sudo systemctl start httpd

touch /var/www/html/index.html
echo "Hello World" >> /var/www/html/index.html

sudo yum -y install https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
sudo yum-config-manager --disable mysql80-community
sudo yum-config-manager --enable mysql57-community
sudo yum -y install mysql-community-client