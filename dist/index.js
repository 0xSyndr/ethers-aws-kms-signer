"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AwsKmsSigner = void 0;

var _ethers = require("ethers");

var _awsKmsUtils = require("./util/aws-kms-utils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AwsKmsSigner extends _ethers.ethers.Signer {
  constructor(kmsCredentials, provider) {
    super();

    _defineProperty(this, "kmsCredentials", void 0);

    _defineProperty(this, "ethereumAddress", void 0);

    _ethers.ethers.utils.defineReadOnly(this, "provider", provider || null);

    _ethers.ethers.utils.defineReadOnly(this, "kmsCredentials", kmsCredentials);
  }

  getAddress() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this.ethereumAddress === undefined) {
        const key = yield (0, _awsKmsUtils.getPublicKey)(_this.kmsCredentials);
        _this.ethereumAddress = (0, _awsKmsUtils.getEthereumAddress)(key.PublicKey);
      }

      return Promise.resolve(_this.ethereumAddress);
    })();
  }

  _signDigest(digestString) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const digestBuffer = Buffer.from(_ethers.ethers.utils.arrayify(digestString));
      const sig = yield (0, _awsKmsUtils.requestKmsSignature)(digestBuffer, _this2.kmsCredentials);
      const ethAddr = yield _this2.getAddress();

      const _determineCorrectV = (0, _awsKmsUtils.determineCorrectV)(digestBuffer, sig.r, sig.s, ethAddr),
            v = _determineCorrectV.v;

      return _ethers.ethers.utils.joinSignature({
        v,
        r: `0x${sig.r.toString("hex")}`,
        s: `0x${sig.s.toString("hex")}`
      });
    })();
  }

  signMessage(message) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return _this3._signDigest(_ethers.ethers.utils.hashMessage(message));
    })();
  }

  signTypedData(domain, types, value) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const hash = _ethers.ethers.utils._TypedDataEncoder.hash(domain, types, value);

      return _this4._signDigest(hash);
    })();
  }

  signTransaction(transaction) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const unsignedTx = yield _ethers.ethers.utils.resolveProperties(transaction);

      const serializedTx = _ethers.ethers.utils.serializeTransaction(unsignedTx);

      const transactionSignature = yield _this5._signDigest(_ethers.ethers.utils.keccak256(serializedTx));
      return _ethers.ethers.utils.serializeTransaction(unsignedTx, transactionSignature);
    })();
  }

  connect(provider) {
    return new AwsKmsSigner(this.kmsCredentials, provider);
  }

}

exports.AwsKmsSigner = AwsKmsSigner;