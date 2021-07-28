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

let dueDate, daysDeadline, serverIp;

function config(params) {
    dueDate = params.dueDate;
    daysDeadline = params.daysDeadline;
    serverIp = params.serverIp;

    return { start };
}

async function start() {
    if(serverIp != null) {
        try {
            const rawResponse = await fetch(`${serverIp}/api/v1/website/${btoa(window.location.hostname)}`);
            const jsonResponse = await rawResponse.json();

            if(jsonResponse.paid === true) return;

            // ISO-8601
            if(jsonResponse.due != null) dueDate = new Date(jsonResponse.due);
            if(jsonResponse.days != null) daysDeadline = jsonResponse.days;
        }
        catch(e) {
            if(dueDate != null) {
                console.warn("[Not Paid Reloaded] Server did not respond, defaulting to config() values");
            }
        }
    }

    if(dueDate != null && daysDeadline != null) {
        console.debug(`[Not Paid Reloaded] dueDate: ${dueDate}; daysDeadline: ${daysDeadline}; serverIp: ${serverIp}`);
        const currentDate = new Date();
        const dueDateUtc = Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDay());
        const currentDateUtc = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay());
        const days = Math.floor((currentDateUtc - dueDateUtc) / (1000 * 60 * 60 * 24));

        if(days > 0) {
            const daysLate = daysDeadline - days;
            let opacity = (daysLate * 100 / daysDeadline) / 100;
            opacity = (opacity < 0) ? 0 : opacity;
            opacity = (opacity > 1) ? 1 : opacity;

            if(opacity >= 0 && opacity <= 1) {
                document.getElementsByTagName("body")[0].style.opacity = opacity;
            }
        }
    }
    else {
        console.debug(`[Not Paid Reloaded] dueDate: ${dueDate}; daysDeadline: ${daysDeadline}; serverIp: ${serverIp}`);
        console.error("[Not Paid Reloaded] Some variables are missing");

        if(serverIp != null) {
            try {
                await fetch(`${serverIp}/api/v1/failure/${btoa(window.location.hostname)}`);
            }
            catch(e) {
                console.warn("[Not Paid Reloaded] Server did not respond, cannot log failure");
            }
        }
    }
}

var NotPaidReloaded = { config, start };
