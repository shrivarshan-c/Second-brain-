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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_Secret = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
exports.JWT_Secret = "shrivarshancsv";
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const hashpassword = yield bcrypt_1.default.hash(password, 5);
    try {
        yield db_1.userModel.create({
            username: username,
            password: hashpassword
        });
        res.json("user signup").status(200);
    }
    catch (e) {
        res.json("some problem" + e).status(404);
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const findUser = yield db_1.userModel.findOne({
            username: username,
        });
        if (!findUser) {
            return res.status(404).json("User not found");
        }
        //@ts-ignore
        const decrypt = yield bcrypt_1.default.compare(password, findUser.password);
        if (decrypt) {
            const token = jsonwebtoken_1.default.sign({
                id: findUser._id
            }, exports.JWT_Secret);
            return res.status(200).json({ token });
        }
        else {
            return res.json({
                "message": "Incorrect authorization"
            }).status(403);
        }
    }
    catch (e) {
        res.status(404).json("servor error");
    }
}));
app.post("/api/v1/content", middleware_1.useMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const link = req.body.link;
    const title = req.body.title;
    const tags = req.body.tags;
    const createContent = yield db_1.ContentModel.create({
        type: type,
        link: link,
        title: title,
        tags: [],
        //@ts-ignore
        userId: req.userId
    });
    if (createContent) {
        res.status(200).json("contents added successfully");
    }
    else {
        res.status(404).json("content not added");
    }
}));
app.get("/api/v1/content", middleware_1.useMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.findOne({
        userId
    }).populate("userId", "username");
    if (content) {
        res.status(200).json(content);
    }
    else {
        res.status(404).json("user id not found");
    }
}));
app.delete("/api/v1/delete", (req, res) => {
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000, () => {
    console.log(`app running on port ${3000}`);
});
