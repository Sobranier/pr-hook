var shell = require('shelljs');
var colors = require('colors');
var fs = require('fs');
require('shelljs-plugin-open');

function create() {
  shell.mkdir('-p', 'mcconf');
  if (shell.exec('cat mcconf/.pr-hook.json', { silent: true }).code === 0) {
    console.log('\n----------> .pr-hook 文件存在，请检测是否需要覆盖\n'.yellow);
  } else {
    shell.cp(__dirname + '/../hook_rules/.pr-hook.json', 'mcconf/');
    console.log('\n----------> mc-pr 初始化成功\n'.green);
  }
}

function run(options) {
  fs.readFile('mcconf/.pr-hook.json', 'utf8', function (err, data) {
    if (err) {
      shell.exit(1);
    }
    try {
      let obj = JSON.parse(data);
      shell.exec('git symbolic-ref --short -q HEAD', { silent: true }, function(code, stdout, stderr) {
        if (code !== 0) {
          shell.exit(1);
        } else {
          // 如果未指定分支号，会从当前分支向配置的默认分支发起 Pr
          obj.sourceBranch = options.source ? options.source : stdout;
          obj.targetBranch = options.target ? options.target : obj.defaultBranch;
          // 默认的 source 和 target 会走配置
          obj.sourceProjectId = options.sourceId ? options.sourceId : obj.sourceId;
          obj.targetProjectId = options.targetId ? options.targetId : obj.targetId;

          Object.keys(obj).forEach(function(key) {
            if (obj[key].indexOf('\n') > -1) {
              obj[key] = obj[key].slice(0, -1);
            }
          })

          let url =obj.gitUrl + "/merge_requests/new?merge_request[source_project_id]=" +  obj.sourceProjectId + "&merge_request[source_branch]=" + obj.sourceBranch + "&merge_request[target_project_id]=" + obj.targetProjectId + "&merge_request[target_branch]=" + obj.targetBranch;
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
