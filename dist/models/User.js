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
exports.User = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class User {
    constructor() { }
    static create(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.create({
                data: {
                    email,
                    name,
                },
            });
            return user;
        });
    }
    static update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield prisma.user.update({
                where: { id: user.id },
                data: user,
            });
            return updatedUser;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { id },
                include: { books: true },
            });
            return user;
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findUnique({
                where: { email },
            });
            return user;
        });
    }
}
exports.User = User;
