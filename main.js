#!/usr/bin/env node

import fs from 'node:fs';
import chalk from 'chalk';
import Enquirer from 'enquirer';
import { Argument, Help, program } from 'commander';
import Conf from 'conf';
import { $ } from 'execa';
import figlet from 'figlet'
import logSymbols from 'log-symbols';
import ora from 'ora';

//import Dependencies from './commands/dependencies.js';

program
    .name('zipm')
    .description('global compressor and uncompressor that uses rar, gzip, zip all in one command for comfort :3')
    .version('0.0.3-ALPHA');

program
    .argument('<file>', 'a file')
    .option('-hw, --helloworld', `says 'hello world'`)
    .action(async (options) => {
        if (options.helloworld) {
            console.log(logSymbols.info, 'hello world');
        } else {
            const {stdout: name } = await $`zipm --help`;
            console.log(name);};
    });

program.command('dependencies')
    .summary("view dependencies ")
    .description('view dependencies for this pkg (default: show all)')
    .option('-i, --installed', 'shows only dependencies that have already been installed')
    .option('-r, --required', 'shows only dependencies that are required and have not yet been installed')
    .option('-A, --all', 'show all the dependencies, installed and not intalled')
    .action(async(options) => {
        //console.log(logSymbols.info, options);
        if (options.installed) {
            //await Dependencies.installed();
        } else if (options.required) {
            //await Dependencies.required();
        } else {
            //await Dependencies.all();
        }
    });

program.command('x')
    .summary('uncompress')
    .description('uncompress a file or list of files')
    .argument('<file>', 'select a file for uncompress')
    .argument('[files...]', 'select a list of files for uncompress')
    .action((file, files)=>{
        console.log(file, files);
    })

program.command('c')
    .summary('compress')
    .description('compress a file or list of files')
    .argument('<file>', 'select a list of files for compress')
    .argument('[files...]', 'select a list of files for compress')
    .option('-d, --directory', 'enable compress of directory or a list of directorys', (hola)=>{console.log(hola);})


program.parse(process.argv);
