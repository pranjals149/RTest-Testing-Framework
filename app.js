#!/usr/bin/env node

const Runner = require('./runner');
const runner = new Runner();

const rtest = async () => {

    await runner.collectFiles(process.cwd()); //process.cwd() returns the current working directory
    runner.runTests();
}

rtest();
module.exports.rtest = rtest;