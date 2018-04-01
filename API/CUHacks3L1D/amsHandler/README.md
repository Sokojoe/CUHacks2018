# Your StdLib MessageBird Hub

Welcome to your MessageBird Hub Source Code on StdLib!

The goal of the MessageBird Hub is to provide your project, team or company
with a fully-functional, robust telephony hub for things like bots and
customer support. Through StdLib, you're guaranteed that your infrastructure
scales infinitely and you never have to manage servers. While it is necessary
to write *some* code, StdLib is easy and malleable enough to be accessible
to even the most junior developers.

This service is meant to be used in tandem with [MessageBird](https://stdlib.com/@messagebird) phone numbers and services. You'll have to claim a number with [messagebird.numbers.initialize](https://stdlib.com/@messagebird/lib/numbers), then set the handler using the [messagebird.handlers.sms.set](https://stdlib.com/@messagebird/lib/handlers) function.

You can check out an in-depth tutorial on how to set things up [here](https://medium.com/@jacoblee93/build-a-serverless-sms-hub-in-under-7-minutes-with-node-js-stdlib-and-messagebird-7d2d41ecaea6).

# Your Project

The first thing you'll probably notice is your `functions/` directory. This is
your StdLib function directory which maps directly to HTTP endpoints. There are
six "out of the box" functions in your MessageBird hub.

- `__main__.js`
- `messaging/__notfound__.js`
- `messaging/more.js`

We'll go through these in the order listed here.

## Function: `functions/__main__.js`

This is your main endpoint, corresponding to `https://<username>.lib.id/<service>/`.
This is, of course, where `<username>` is your username and `<service>` is your service
name.

Any time a function has the filename `__main__.js`, the enclosing folder is
used as the route name over HTTP. You can think of it like the default function
for a specific directory.

Note that when pushing to a development environment (or if you want to access
  a specific version), this should be reached via:
  `https://username.lib.id/service@dev/` (if your dev environment is called
  `dev`, also the default local environment name) or
  `https://username.lib.id/service@0.0.0/` (if your version is 0.0.0).

### Usage

This function will route requests to other StdLib functions within your MessageBird
SMS hub based on the contents of the SMS message your MessageBird number receives.
To begin with, this will be the `functions/messaging/__notfound__.js` and
`functions/messaging/more.js` functions. You can add more handlers for different
messages by creating new `.js` files within the `functions/messaging` directory.

You can test the routing from your command line using:

```shell
$ lib . --message "My message"
```

## Function: `functions/messaging/__notfound__.js`

This is the SMS "not found" handler. If the message your MessageBird Hub on StdLib receives
can not be mapped to a named function (like `more`) this handler
will be triggered.

### Usage

This handler outputs a string for simple messaging and development testing.
You can directly test this specific handler from your command line using:

```shell
$ lib .messaging.__notfound__ --message "My message"
```

## Function: `functions/messaging/more.js`

This is the SMS handler for messages containing the word "more" (in any
  capitalization variation) as their sole contents.

All named functions will be dispatched similarly from `functions/messaging/__main__.js`,
but this can be modified to suit your needs, specifically.

### Usage

This handler outputs a string for simple messaging and development testing.
You can directly test this specific handler from your command line using:

```shell
$ lib .messaging.more
```

# Helpers

You'll notice a `/helpers/` directory which contains a single function.
You should store MessageBird helper functions here
or any time you want to write logic that you don't want to repeat.

## Helper: `helpers/send.js`

Sends messages using [MessageBird on StdLib](https://stdlib.com/@messagebird/src/sms).
Effectively a wrapper that helps support local testing in place of:

```javascript
lib.messagebird.sms.create({
  originator: originator,
  recipient: recipient,
  body: body
})
```

# That's it!

We hope this has served as a welcoming introduction to your
MessageBird message hub project scaffold on [StdLib](https://stdlib.com) -- happy building!
