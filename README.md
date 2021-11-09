# Not Paid Reloaded

> A revamp of [kleampa/not-paid](https://github.com/kleampa/not-paid) project with some extra features

This project allows freelance developers to add a _small_ layer of protection and control in case a client doesn't pay for the website they requested.

As in the original project, the opacity is slowly reduced each day after the due date until and until the deadline.

### Features
- Opacity reduction each day (as in [kleampa/not-paid](https://github.com/kleampa/not-paid))
- Hardcoded due date and deadline (as in [kleampa/not-paid](https://github.com/kleampa/not-paid))
- Dynamic configuration and startup ``NotPaidReloaded.config({...}).start()`` <sup>✨</sup>
- Retrieve dynamic data from a server <sup>✨</sup>
- Failure logging system from the client to the server <sup>✨</sup>
- Local logging <sup>✨</sup>
- ES6+ syntax <sup>✨</sup>

### Usage
Add to your page the [``client/library.js``](client/library.js) script (or the available [polyfill](client/library-polyfill.js))

Configuration (without server):
```js
NotPaidReloaded
    .config({
        dueDate: new Date("2021-07-28T07:59:20+0000"),
        daysDeadline: 5
    })
    .start();
```


Configuration (with server):
```js
NotPaidReloaded
    .config({
        serverIp: "http://localhost:7090",
        
        // Fallback
        dueDate: new Date("2021-07-28T07:59:20+0000"),
        daysDeadline: 5
    })
    .start();
```

### Setup server
To start the server you just need to run ``npm run start`` at the ``server/`` folder.

You can customize the data about payments and due dates on the fly modifying the ``server/data/dueDates.json``.

The due dates follow the following structure:
```json5
{
  "hostname": {
    "paid": false, // If paid is true, the opacity won't be affected
    "due": "2021-07-27T00:00:00+0000", // Due date in ISO-8601 format
    "days": 5 // Days after the due when the opacity is going to be 0
  }
}
```

### Approach to failures
This library uses an optimistic approach, if there is no data about the website on the backend, the server will
return ``{"paid":true}`` and if the server fails and there is no fallback, the website will be shown at full opacity.

The reason behind this is that it's better to allow someone who has not paid access the website that do not allow
someone who paid access the website.

In the future, this behaviour _may_ be modified with some kind of flag or configuration in both the backend and
the frontend.

### License
This project is licensed under the BSD 3 Clause license, which allows you to do [_almost_](https://choosealicense.com/licenses/bsd-3-clause/) whatever you want

