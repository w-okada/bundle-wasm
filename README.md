# build and run the demo.

```
### (1) clone repository
$ git clone git@github.com:w-okada/bundle-wasm.git
$ cd bundle-wasm/


### (2) build js worker
$ cd opencv-lib-js/
$ npm install
$ npm run build

### (3) build ts worker
$ cd ..
$ cd bundle-wasm-react/
$ npm install
$ npm run build
$ npm start

access http://localhost:8080/ with your browser

```

# use the demo.

At first, open developper console. Then push the button. After a while, you will get the message in developper console.
