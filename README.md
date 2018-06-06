# wifi_bot
v 1.0

Step 1 is to install node js and modules:
       enter following commands;
      sudo apt-get update
      curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
      sudo apt-get install -y nodejs
      node -v
       //this should print version of node js... make sure no error is occured till now
      sudo apt-get install pigpio
       npm install pigpio
       npm install express
       npm install ip
       npm install socket.io
       sudo reboot
       
       
Step 2 Now edit line 16 of "remleaf.js" set corret path of remleaf folder you just downloaded.
       you can also (line 6,7,8,9) change gpio pin no. according to your connection to motordriver. 
       
 now run program by typing
       
       sudo node remleaf.js
