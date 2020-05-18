"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var events_1 = require("events");
var axios_1 = require("axios");
var Project_1 = require("./Project");
function updateClass(project, data) {
    function propsToDate(props, path) {
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var prop = props_1[_i];
            if (typeof prop == "string") {
                if (props[path])
                    project[String(path)][String(prop)] = new Date(project[String(path)][String(prop)]);
                else
                    project[String(prop)] = new Date(project[String(prop)]);
            }
        }
    }
    if (!(data instanceof Object))
        throw new Error("Reload failed.");
    var emailEntries = Object.entries(data);
    // Set properties of class
    for (var x = 0; x < emailEntries.length; x++) {
        project[emailEntries[x][0]] = emailEntries[x][1];
    }
    // Make date strings dates
    propsToDate([
        "createdAt",
        "updatedAt"
    ]);
}
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User(data) {
        var _this = _super.call(this) || this;
        if (typeof data == "object")
            updateClass(_this, data);
        return _this;
    }
    User.prototype.find = function (type, value) {
        var _this = this;
        return new Promise(function (res, rej) {
            if (type != "id" && type != "login")
                rej(new Error("Invalid value for argument 'type'."));
            axios_1["default"].get("https://api.glitch.com/v1/users/by/" + type + "?" + type + "=" + value)["catch"](function (e) {
                rej(e);
            }).then(function (login) {
                if (!login)
                    return rej("Request failed.");
                updateClass(_this, login.data[value]);
                _this.emit("ready");
                res();
            });
        });
    };
    User.prototype.getProjects = function (amount) {
        var _this = this;
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var projects, url, a, req, _i, _a, project;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!amount)
                            amount = 50;
                        projects = [];
                        url = "https://api.glitch.com/v1/users/by/id/projects?id=" + this.id + "&limit=" + (amount > 100 ? 100 : amount) + "&orderKey=createdAt&orderDirection=DESC";
                        a = 0;
                        _b.label = 1;
                    case 1:
                        if (!(a < Math.ceil(amount / 100))) return [3 /*break*/, 4];
                        if (url == null)
                            return [3 /*break*/, 3];
                        return [4 /*yield*/, axios_1["default"].get(url)["catch"](function (e) {
                                rej(e);
                            })];
                    case 2:
                        req = _b.sent();
                        if (!req) {
                            rej("Request failed.");
                            return [3 /*break*/, 3];
                        }
                        for (_i = 0, _a = req.data.items; _i < _a.length; _i++) {
                            project = _a[_i];
                            projects.push(new Project_1.Project(project));
                        }
                        if (req.data.hasMore) {
                            url = "https://api.glitch.com" + req.data.nextPage;
                        }
                        else
                            url = null;
                        amount -= 100;
                        _b.label = 3;
                    case 3:
                        a++;
                        return [3 /*break*/, 1];
                    case 4:
                        res(projects);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return User;
}(events_1.EventEmitter));
exports.User = User;
