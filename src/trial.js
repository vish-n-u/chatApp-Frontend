const CryptoJS = require("crypto-js");

var JsonFormatter = {
  stringify: function (cipherParams) {
    // create json object with ciphertext
    var jsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };

    // optionally add iv or salt
    if (cipherParams.iv) {
      jsonObj.iv = cipherParams.iv.toString();
    }

    if (cipherParams.salt) {
      jsonObj.s = cipherParams.salt.toString();
    }

    // stringify json object
    return JSON.stringify(jsonObj);
  },
  parse: function (jsonStr) {
    // parse json string
    var jsonObj = JSON.parse(jsonStr);

    // extract ciphertext from json object, and create cipher params object
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct),
    });

    // optionally extract iv or salt​
    if (jsonObj.iv) {
      cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
    }

    if (jsonObj.s) {
      cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
    }

    return cipherParams;
  },
};

var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");

encrypted >
  {
    ct: "tZ4MsEnfbcDOwqau68aOrQ==",
    iv: "8a8c8fd8fe33743d3638737ea4a00698",
    s: "ba06373c8f57179c",
  };

var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase", {
  format: JsonFormatter,
});

console.log(decrypted.toString(CryptoJS.enc.Utf8));
