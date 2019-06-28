var shell = require('shelljs');
var colors = require('colors');
var path = require('path');
var fs = require('fs');
require('shelljs-plugin-open');

function create() {
  shell.mkdir('-p', 'mcconf');
  if (shell.exec('cat mcconf/.pr-hook.json', { silent: true }).code === 0) {
    console.log('\n----------> .pr-hook 文件存在，请检测是否需要覆盖\n'.yellow);
  } else {
    shell.cp(__dirname + '/../hook_rules/.pr-hook.json', 'mcconf/');
    console.log('\n---------- mc-pr 初始化成功 ----------\n'.green);
  }
}

const defalutOptions = {
  type: 'gitlab'
}

function run(options = defalutOptions) {
  let paths = process.cwd();
  while(true) {
    if (shell.exec('cat '+ paths + '/mcconf/.pr-hook.json', { silent: true }).code === 0) {
      console.log('\n---------- 成功检测到.pr-hook.json文件 ----------\n'.green);
      break;
    }
    paths = path.resolve(paths + '/..');
    if (paths === '/') {
      break;
    }
  }

  if (paths === '/') {
    console.log('\n----------> .pr-hook 文件不存在，请执行 mc-pr init 初始化\n'.yellow);
    return;
  }

  fs.readFile(paths + '/mcconf/.pr-hook.json', 'utf8', function (err, data) {
    if (err) {
      shell.exit(1);
    }
    try {
      let obj = JSON.parse(data);
      shell.exec('git symbolic-ref --short -q HEAD', { silent: true }, function(code, stdout, stderr) {
        if (code !== 0) {
          shell.exit(1);
        } else {
          // 初始化配置
          // 若未指定类型 默认为gitlab
          obj.type = obj.type ? obj.type : options.type;

          // 如果命令行未指定分支号，会检测.pr-hook.json是否配置targetBranch，有配置走走配置，没有则默认采用当前分支名发起 Pr
          obj.sourceBranch = options.source ? options.source : stdout;
          obj.targetBranch = options.target ? options.target :  obj.targetBranch ? obj.targetBranch : stdout;
          if(obj.type === 'gitlab'){
            // 默认的 source 和 target 会走配置
            obj.sourceProjectId = options.sourceId ? options.sourceId : obj.sourceId;
            obj.targetProjectId = options.targetId ? options.targetId : obj.targetId;
          }

          Object.keys(obj).forEach(function(key) {
            if (obj[key] && obj[key].indexOf('\n') > -1) {
              obj[key] = obj[key].slice(0, -1);
            }
          })

          // gitlab
          let url = obj.gitUrl
            + "/merge_requests/new?merge_request[source_project_id]="
            + obj.sourceProjectId
            + "&merge_request[source_branch]="
            + obj.sourceBranch
            + "&merge_request[target_project_id]="
            + obj.targetProjectId
            + "&merge_request[target_branch]="
            + obj.targetBranch;

          // github
          if(obj.type === 'github'){
            // https://github.com/meicai-fe/pr-hook/compare/master...xuanmiaoshuo:develop
            url = obj.targetUrl.slice(0, -4)
              + "/compare/"
              + obj.targetBranch
              + "..."
              + obj.username
              + ":"
              + obj.sourceBranch
          }
          shell.open(url);
        }
      })
    } catch(e) {
      console.log(e);
      shell.exit(1);
    }
  });
}

module.exports = {
  create, run
};
