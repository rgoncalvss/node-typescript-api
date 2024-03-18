"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const bad_request_1 = require("../exceptions/bad-request");
const root_1 = require("../exceptions/root");
const not_found_1 = require("../exceptions/not-found");
class UserController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name } = req.body;
            const userAlreadyExists = yield User_1.User.findByEmail(email);
            if (userAlreadyExists) {
                next(new bad_request_1.BadRequestException("User already exists", root_1.ErrorCode.CONFLICT));
                return;
            }
            const user = yield User_1.User.create(email, name);
            res.json(user);
        });
    }
    static findById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id, 10);
            const user = yield User_1.User.findById(userId);
            if (!user) {
                next(new not_found_1.NotFoundException("User not found", root_1.ErrorCode.NOT_FOUND));
                return;
            }
            return res.json(user);
        });
    }
}
exports.UserController = UserController;
