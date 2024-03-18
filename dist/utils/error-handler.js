"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const root_1 = require("../exceptions/root");
const internal_exception_1 = require("../exceptions/internal-exception");
const errorHandler = (method) => {
    return (req, res, next) => {
        try {
            method(req, res, next);
        }
        catch (error) {
            let exception;
            if (error instanceof root_1.HttpException) {
                exception = error;
            }
            else {
                exception = new internal_exception_1.InternalException('Internal Server Error', root_1.ErrorCode.INTERNAL_SERVER_ERROR);
            }
            next(exception);
        }
    };
};
exports.errorHandler = errorHandler;
