#### First things first, download or clone the repo, to your local machine and before doing this let me give you the prerequisites for this project.
              1)	NodeJS
              2)	MongoDB
#### Now for the NodeJS, we need certain packages which can install via npm knows as Node Package Manager (comes as bundle with NodeJS itself)
              1)	express
              2)	body-parser
              3)	ejs
              4)	express-fileupload
              5)	mime-types
              6)	mongoose
#### Once you install all these dependencies in your pc and made the necessary changes in the source code (commented in the code itself), you must modify some setting on your router’s home page. Here, are the steps you need to perform to make your site accessible via Internet.
######              1)	Go to your router’s home page also known as the Router’s configuration page.
                    A)	To find the page open the terminal in your machine and search your Internet configuration (For Windows base machine, it is ipconfig command, for Linux it   is ifconfig).
                    B)	In this configuration find the option namely, default gateway which in most case will be 192.168.0.1 (this is the router’s configuration page address)[NOTE: - YOUR DEFAULT GATEWAY MAY BE DEFERENT] copy and paste this IP address in your favourite web browser. Also, remember your assign IP address and MAC                          address too.
                    C)	This page often required a credentials for login, make sure you know this before you go for the further steps.
######              2)	After login to your Router’s configuration page, head towards the tab called DHCP client list (this is a list of all the device which are connected to your                         router). Find and confirm your machine’s IP address and MAC address which runs the NodeJS server.
######              3)	Once you have confirmed this, almost every router has a submenu which names the IP reservation or similar, click and open this submenu, and fill the required                       details which is MAC address and IP address of your server’s machine. This makes a permeant local IP assignment to your server PC.
######             4)	Now, head main menu of the router’s configuration page, and search for the Dynamic DNS tab. This is a very curtail step for this entire process.
                    A)	Before, filling the details here, please go the No-IP domain website and register yourself. [NOTE: - THERE ARE MANY OTHER SERVICE PROVIDERS ALSO AVIABLE                          PROVING THE SAME SERVICES].
                    B)	Now in that site itself, make your own user define Domain Name there and come back to the router’s configuration page again.
######              5)	Here, now fill the asked details, if you have done your registration via No-IP services, then select the Service Provider as, No-IP domain, then stick your                         custom-made domain name in the Domain Name field, type your Username and Password which you have created during the registration process with No-IP domain. And                     hit the login button, and confirm it is successful. If not, you might have done some mistake in your Form filling.      
 ######             6)	Now the last change, go to the port forwarding tab, enter the necessary details over there but make sure that your PORT NUMBERS are identical to the port on                       which your NodeJS server is running on the server machine.
After this you are all set to enjoy your kind of unlimited amount of the storage which can access anywhere, at any time around the globe.
### YOU MUST PROVIDE THE CONSTANT POWER SUPPLY TO YOUR SERVER PC IN ORDER TO ACCESS YOUR STORAGE FOR 24 / 7 AND 365 / 366 DAYS.
