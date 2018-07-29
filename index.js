#!/usr/bin/env node
var program = require('commander');

var package = require('./package.json');
var rule = require('./bin/rule.js');

program
  .version(package.version)
  .description('本工具用于方便进行与公司 git 的相关操作');

program
  .command('init')
  .description('生成初始化文件')
  .action(() => {
    rule.create();
  });

program
  .command('run')
  .description('执行指令')
  .option('-t, --target [value]', '修改默认目标分支')
  .option('-s, --source [value]', '修改默认源头分支')
  .action((options) => {
    if (typeof options === 'string') {
      rule.run({
        target: options
      });
    } else {
      rule.run(options);
    }
  }).on('--help', function() {
    console.log('\n---------->直接执行，默认从当前分支提交 pr 到默认分支'.yellow);
    console.log('\n---------->添加一个参数，则会订为目标分支'.yellow);
    console.log('\n---------->添加--source 和 --target参数，则会同时修改源分支和目标分支'.yellow);
  });

program
  .parse(process.argv);
