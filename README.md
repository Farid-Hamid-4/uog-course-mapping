# UoG  McGill Course/Subject Finder and Graph Maker

A program to search and filter course offerings at the University of Guelph.
Graphs majors and programs for University of Guelph, and subjects for McGill.

## Getting Started

### Dependencies

* Node 14 or higher
* Python 3.9 or higher
    * sudo apt install python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools

## Installation and setup of React and Flask

1. Navigate to the directory named `webapp`
2. Run `npm install` to install dependencies for the node program 
3. Run `npm run build` to create a build for the NGINX server to serve
4. Naviate to the directory named `flask-api`
5. Run `python3 install -r requirements.txt` to install Python dependencies

## Installation and setup of NGINX and Flask

1. While in the repo directory, run the install script to install NGINX
2. Navigate to the etc folder - `cd /etc`
3. Obtain the hostname - `cat /hostname`
4. Open an editor to copy the hostname into /etc/hosts - `sudo nano hosts`
    - Important to use sudo in order to be able to write
5. Copy the ip address of the localhost and write your hostname alongside it
    - (e.g.) 127.0.0.1    localhost
             127.0.0.1    your_hostname
6. Navigate to the sites-available folder - `cd /etc/nginx/sites-available`
7. Create a file called flask-api - `sudo nano flask-api`
8. Copy the following into the file - 
```
server {
    server_name 131.104.49.106;
    root /home/sysadmin/sprint-1/webapp/build;
    index index.html;
   
    location / {
        try_files $uri /index.html;
    }

    location /api {
        include uwsgi_params;
        uwsgi_pass unix:/home/sysadmin/sprint-1/flask-api/flask-api.sock;
    }
}
```
9. Navigate to `/etc/systemd/system`
10. Create and open a file called flask-api.service - `sudo nano flask-api.service`
11. Copy the follwing into the file -
```
[Unit]
Description="uWSGI server instance for flask-api"
After=network.target

[Service]
User=sysadmin
Group=sysadmin
WorkingDirectory=/home/sysadmin/sprint-1/flask-api/
Environment=FLASK_ENV=test
ExecStart=/home/sysadmin/.local/bin/uwsgi --ini /home/sysadmin/sprint-1/flask-api/app.ini

[Install]
WantedBy=multi-user.target
```
11. Run `sudo ufw allow 'Nginx Full'`
12. Run `sudo systemctl nginx start` and `sudo systemctl flask-api start` to run the nginx server and Flask API.


## Running tests

*COMPLETE STEP 4 OF INSTALLATION BEFORE CONTINUING*

In the 'search' directory - `python3 -m pytest`

## Authors

* Farid Hamid
* Harsh Topiwala
* Jainil Patel
* Lourenco Velez
* Nicholas Baker
