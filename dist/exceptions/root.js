"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, errorCode, statusCode, error) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = error;
    }
}
exports.HttpException = HttpException;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["BAD_REQUEST"] = "400";
    ErrorCode["UNAUTHORIZED"] = "401";
    ErrorCode["FORBIDDEN"] = "403";
    ErrorCode["NOT_FOUND"] = "404";
    ErrorCode["INTERNAL_SERVER_ERROR"] = "500";
    ErrorCode["CONFLICT"] = "409";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
