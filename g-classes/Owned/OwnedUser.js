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
var axios_1 = require("axios");
var events_1 = require("events");
var errors_1 = require("../../g-utils/errors");
var OwnedProject_1 = require("./OwnedProject");
function updateClass(user, data) {
    var emailEntries = Object.entries(data);
    // Set properties of class
    for (var x = 0; x < emailEntries.length; x++) {
        user[emailEntries[x][0]] = emailEntries[x][1];
    }
    // Make date strings dates
    if (typeof user.createdAt == "string")
        user.createdAt = new Date(user.createdAt);
    if (typeof user.updatedAt == "string")
        user.updatedAt = new Date(user.updatedAt);
    for (var i = 0; i < user.features.length; i++) {
        if (typeof user.features[i].expiresAt == "string")
            user.features[i].expiresAt = new Date(user.features[i].expiresAt);
    }
}
var OwnedUser = /** @class */ (function (_super) {
    __extends(OwnedUser, _super);
    function OwnedUser(object) {
        var _this = _super.call(this) || this;
        if (object)
            updateClass(_this, object);
        return _this;
    }
    OwnedUser.prototype.update = function (options) {
        var _this = this;
        if (options === void 0) { options = null; }
        return new Promise(function (res, rej) {
            if (typeof options != "object")
                rej(errors_1.TypeErr("options", "object", typeof options));
            if (Object.keys(options).length == 0)
                rej(new Error("Argument \"options\" object empty."));
            if (typeof options.avatarUrl == "string" && typeof options.color != "string")
                options.color = _this.color;
            axios_1["default"].patch("https://api.glitch.com/v1/users/" + _this.id, options, {
                headers: { Authorization: _this.persistentToken }
            })["catch"](function (e) {
                throw e;
            })
                .then(function (req) {
                if (!req)
                    return rej("Request failed!");
                updateClass(_this, req.data);
                res(_this);
            });
        });
    };
    OwnedUser.prototype.setName = function (arg) {
        var _this = this;
        return new Promise(function (res, rej) {
            if (typeof arg != "string")
                rej(errors_1.TypeErr("arg", "string", typeof arg));
            _this.update({ name: arg })["catch"](function (e) { return rej(e); })
                .then(function (d) { return res(d); });
        });
    };
    OwnedUser.prototype.setDescription = function (arg) {
        var _this = this;
        return new Promise(function (res, rej) {
            if (typeof arg != "string")
                rej(errors_1.TypeErr("arg", "string", typeof arg));
            _this.update({ description: arg })["catch"](function (e) { return rej(e); })
                .then(function (d) { return res(d); });
        });
    };
    OwnedUser.prototype.setLogin = function (arg) {
        var _this = this;
        return new Promise(function (res, rej) {
            if (typeof arg != "string")
                rej(errors_1.TypeErr("arg", "string", typeof arg));
            _this.update({ login: arg })["catch"](function (e) { return rej(e); })
                .then(function (d) { return res(d); });
        });
    };
    OwnedUser.prototype.setAvatar = function (arg) {
        var _this = this;
        return new Promise(function (res, rej) {
            if (typeof arg != "string")
                rej(errors_1.TypeErr("arg", "string", typeof arg));
            _this.update({ avatarUrl: arg })["catch"](function (e) { return rej(e); })
                .then(function (d) { return res(d); });
        });
    };
    OwnedUser.prototype.setColor = function (arg) {
        var _this = this;
        return new Promise(function (res, rej) {
            if (typeof arg != "string")
                rej(errors_1.TypeErr("arg", "string", typeof arg));
            _this.update({ color: arg })["catch"](function (e) { return rej(e); })
                .then(function (d) { return res(d); });
        });
    };
    OwnedUser.prototype.signin = function (tempcode) {
        var _this = this;
        return new Promise(function (res, rej) {
            if (typeof tempcode != "string")
                throw errors_1.TypeErr("tempcode", "string", typeof tempcode);
            axios_1["default"].post("https://api.glitch.com/v1/auth/email/" + tempcode).then(function (login) {
                var email = login.data.user;
                updateClass(_this, email);
                res();
                // Let them know that the code is done running
                _this.emit("ready");
            })["catch"](function (e) {
                if (!e.response)
                    rej(new Error("Request failed."));
                if (e.response.status == 404)
                    rej(new Error("Invalid login code."));
                rej(e);
            });
        });
    };
    OwnedUser.prototype.remix = function (base, options) {
        var _this = this;
        return new Promise(function (res, rej) {
            axios_1["default"].post("https://api.glitch.com/v1/projects/by/domain/" + base + "/remix", {
                base: base,
                env: {}
            }, {
                headers: { Authorization: _this.persistentToken }
            })["catch"](function (e) {
                rej(e);
            })
                .then(function (req) {
                if (!req)
                    return rej("Request failed.");
                try {
                    var Proj_1 = new OwnedProject_1.OwnedProject(_this);
                    Proj_1.on("ready", function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(typeof options == "object" && options != undefined && options != null)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Proj_1.update(options)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    res(Proj_1);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    Proj_1.find(req.data.id);
                }
                catch (err) {
                    rej(err);
                }
            });
        });
    };
    OwnedUser.prototype.getProjects = function (amount) {
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
                        return [4 /*yield*/, axios_1["default"].get(url, {
                                headers: { Authorization: this.persistentToken }
                            })["catch"](function (e) {
                                rej(e);
                            })];
                    case 2:
                        req = _b.sent();
                        if (!req)
                            return [2 /*return*/, rej("Request Failed.")];
                        for (_i = 0, _a = req.data.items; _i < _a.length; _i++) {
                            project = _a[_i];
                            projects.push(new OwnedProject_1.OwnedProject(this, project));
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
    return OwnedUser;
}(events_1.EventEmitter));
exports.OwnedUser = OwnedUser;
