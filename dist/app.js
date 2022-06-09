"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rsa_route_1 = __importDefault(require("./routes/rsa.route"));
const app = (0, express_1.default)();
app.set('PORT', process.env.PORT || 8080);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//Rutas
app.use('/rsa', rsa_route_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map