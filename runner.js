// Collection of different files
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const render = require('./render');

const forbiddenDirs = ['node_modules'];

class Runner {
    // Class is responsible for creating a data structure that is responsible for storing the reference of the test files.
    constructor() {
        this.testfiles = [] // collect the file names that are to be executed
    }

    async runTests() {
        for (let file of this.testfiles) {
            console.log(chalk.blueBright(`${chalk.yellow('Loading - ')}${file.shortName} ... `))
            console.log(chalk.cyan("=================================================="))
            const beforeEaches = [];

            global.render = render;

            global.beforeEach = (fn) => {
                beforeEaches.push(fn);
            }

            global.it = async (desc, fn) => {
                beforeEaches.forEach(func => func());
                try {
                    await fn();
                    console.log(chalk.greenBright(`OK - ${desc}`));
                } catch (err) {
                    console.log(chalk.redBright(`XX - ${desc}`));
                    console.log(chalk.blueBright('--------------------------------------------------'))
                    console.log(chalk.redBright(err.message));
                }
            }
            try {
                require(file.name);
            } catch (err) {
                console.log('\x1b[31m', err);
            }

        }
    }

    async collectFiles(targetPath) {
        const files = await fs.promises.readdir(targetPath);

        for (let file of files) {
            const filepath = path.join(targetPath, file);
            const stats = await fs.promises.lstat(filepath);

            if (stats.isFile() && file.includes('.test.js')) {

                this.testfiles.push({ name: filepath, shortName: file })

            } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {

                const childFiles = await fs.promises.readdir(filepath);

                files.push(...childFiles.map(f => path.join(file, f)));
            }
        }
    }
}

module.exports = Runner