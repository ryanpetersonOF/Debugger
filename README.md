# A support app boilerplate

Make use of an empty support template!  Replicate an issue, then upload as a branch to easily distribute and test in the future.

The launcher assumes you have the 'http-server' node module installed.  If not use "npm install -g http-server" to install.  The app will run on port 9001.

Button click event and testing javascript is recommended in public/js/custom.js

## Clone empty template and upload as new ticket branch

(make sure you have no support directory in the pwd)
1. git clone https://github.com/ryanpetersonOF/Support.git
2. cd support
3. git branch [ticket # OR branch name]
4. git checkout [ticket # OR branch name]
5. Do your test
6. git add *
7. git commit -m "some explanation of the ticket"
8. git push origin [ticket # OR branch name]


## Clone a ticket branch
(make sure you have no support directory in the pwd)
1. git clone -b [ticket # OR branch name] https://github.com/ryanpetersonOF/Support.git
