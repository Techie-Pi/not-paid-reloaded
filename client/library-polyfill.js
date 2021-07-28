/*
BSD 3-Clause License

Copyright (c) 2021, TechiePi
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var dueDate, daysDeadline, serverIp;

function config(params) {
    dueDate = params.dueDate;
    daysDeadline = params.daysDeadline;
    serverIp = params.serverIp;
    return {
        start: start
    };
}

function start() {
    return _start.apply(this, arguments);
}

function _start() {
    _start = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var rawResponse, jsonResponse, currentDate, dueDateUtc, currentDateUtc, days, daysLate, opacity;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(serverIp != null)) {
                            _context.next = 17;
                            break;
                        }

                        _context.prev = 1;
                        _context.next = 4;
                        return fetch(serverIp + "/api/v1/website/" + btoa(window.location.hostname));

                    case 4:
                        rawResponse = _context.sent;
                        _context.next = 7;
                        return rawResponse.json();

                    case 7:
                        jsonResponse = _context.sent;

                        if (!(jsonResponse.paid === true)) {
                            _context.next = 10;
                            break;
                        }

                        return _context.abrupt("return");

                    case 10:
                        // ISO-8601
                        if (jsonResponse.due != null) dueDate = new Date(jsonResponse.due);
                        if (jsonResponse.days != null) daysDeadline = jsonResponse.days;
                        _context.next = 17;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context["catch"](1);

                        if (dueDate != null) {
                            console.warn("[Not Paid Reloaded] Server did not respond, defaulting to config() values");
                        }

                    case 17:
                        if (!(dueDate != null && daysDeadline != null)) {
                            _context.next = 26;
                            break;
                        }

                        console.debug("[Not Paid Reloaded] dueDate: " + dueDate + "; daysDeadline: " + daysDeadline + "; serverIp: " + serverIp);
                        currentDate = new Date();
                        dueDateUtc = Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDay());
                        currentDateUtc = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay());
                        days = Math.floor((currentDateUtc - dueDateUtc) / (1000 * 60 * 60 * 24));

                        if (days > 0) {
                            daysLate = daysDeadline - days;
                            opacity = daysLate * 100 / daysDeadline / 100;
                            opacity = opacity < 0 ? 0 : opacity;
                            opacity = opacity > 1 ? 1 : opacity;

                            if (opacity >= 0 && opacity <= 1) {
                                document.getElementsByTagName("body")[0].style.opacity = opacity;
                            }
                        }

                        _context.next = 37;
                        break;

                    case 26:
                        console.debug("[Not Paid Reloaded] dueDate: " + dueDate + "; daysDeadline: " + daysDeadline + "; serverIp: " + serverIp);
                        console.error("[Not Paid Reloaded] Some variables are missing");

                        if (!(serverIp != null)) {
                            _context.next = 37;
                            break;
                        }

                        _context.prev = 29;
                        _context.next = 32;
                        return fetch(serverIp + "/api/v1/failure/" + btoa(window.location.hostname));

                    case 32:
                        _context.next = 37;
                        break;

                    case 34:
                        _context.prev = 34;
                        _context.t1 = _context["catch"](29);
                        console.warn("[Not Paid Reloaded] Server did not respond, cannot log failure");

                    case 37:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, null, [[1, 14], [29, 34]]);
    }));
    return _start.apply(this, arguments);
}

var NotPaidReloaded = {
    config: config,
    start: start
};
// last updated: 28/07/2021 (fb04c0376e39954ae4f47a23dd5fe248817616961069e532ec90a5c222860114)
