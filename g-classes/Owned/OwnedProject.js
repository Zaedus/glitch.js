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
exports.__esModule = true;
var errors_1 = require("../../g-utils/errors");
var axios_1 = require("axios");
var events_1 = require("events");
function updateClass(project, data) {
    project.deleted = false;
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
    var emailEntries = Object.entries(data);
    // Set properties of class
    for (var x = 0; x < emailEntries.length; x++) {
        project[emailEntries[x][0]] = emailEntries[x][1];
    }
    // Make date strings dates
    propsToDate([
        "createdAt",
        "updatedAt",
        "deletedAt",
        "suspendedAt",
        "lastAccess",
        "avatarUpdatedAt",
        "archivedAt",
        "visitsLastBackfilledAt"
    ]);
    propsToDate([
        "userLastAccess",
        "createdAt",
        "updatedAt"
    ], "permission");
}
function reloadProject(id, token, deleted) {
    return new Promise(function (res, rej) {
        var URI;
        if (deleted) {
            URI = "https://api.glitch.com/projects/" + id + "?showDeleted=true";
        }
        else {
            URI = "https://api.glitch.com/projects/" + id;
        }
        axios_1["default"].get(URI, {
            headers: { Authorization: token }
        })["catch"](function (e) {
            rej(e);
        }).then(function (req) {
            if (!req)
                return rej("Request Failed.");
            res(!deleted ? req.data : req.data[id]);
        });
    });
}
var OwnedProject = /** @class */ (function (_super) {
    __extends(OwnedProject, _super);
    function OwnedProject(owner, data) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        if (typeof data == "object")
            updateClass(_this, data);
        return _this;
    }
    OwnedProject.prototype.update = function (options) {
        var _this = this;
        return new Promise(function (res, rej) {
            if (typeof options != "object")
                rej(errors_1.TypeErr("options", "object", typeof options));
            if (Object.keys(options).length == 0)
                rej(new Error("Argument \"options\" object empty."));
            axios_1["default"].patch("https://api.glitch.com/v1/projects/" + _this.id, options, {
                headers: { Authorization: _this.owner.persistentToken }
            })["catch"](function (e) {
                rej(e);
            })
                .then(function (req) {
                _this.reload()["catch"](function (e) { rej(e); }).then(function (_) {
                    res(_this);
                });
            });
        });
    };
    OwnedProject.prototype["delete"] = function () {
        var _this = this;
        return new Promise(function (res, rej) {
            axios_1["default"]["delete"]("https://api.glitch.com/v1/projects/" + _this.id, {
                headers: { Authorization: _this.owner.persistentToken }
            })["catch"](function (e) {
                rej(e);
            }).then(function (_) {
                _this.deleted = true;
                _this.reload().then(function (_) {
                    res(_this);
                });
            });
        });
    };
    OwnedProject.prototype.reload = function () {
        var _this = this;
        return new Promise(function (res, rej) {
            reloadProject(_this.id, _this.owner.persistentToken, _this.deleted)
                .then(function (p) {
                updateClass(_this, p);
                res(_this);
            })["catch"](function (e) { return rej(e); });
        });
    };
    OwnedProject.prototype.undelete = function () {
        var _this = this;
        return new Promise(function (res, rej) {
            if (_this.deleted) {
                axios_1["default"].post("https://api.glitch.com/v1/projects/" + _this.id + "/undelete")["catch"](function (e) {
                    rej(e);
                }).then(function (_) {
                    _this.reload()
                        .then(function (_) {
                        res(_this);
                    })["catch"](function (e) { return rej(e); });
                });
            }
            else
                rej("Project is not deleted.");
        });
    };
    OwnedProject.prototype.find = function (id) {
        var _this = this;
        reloadProject(id, this.owner.persistentToken).then(function (r) {
            updateClass(_this, r);
            _this.emit("ready");
        });
    };
    return OwnedProject;
}(events_1.EventEmitter));
exports.OwnedProject = OwnedProject;
exports = OwnedProject;
