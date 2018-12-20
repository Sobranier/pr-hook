# mc-pr

项目提交钩子工具

![meicai logo](http://www.meicai.cn/assets/images/new-img/logo.png)

### 说明

主项目流程包括关键的 review，review 的整个操作比较复杂，需要优化

### 使用规则

```
mnpm install -g @mc/pr-hook

mc-pr init
// 默认将会在mcconf文件夹下建立.pr-hook.json 配置文件，如果重新 init 会有覆盖提示。此文件用来配置对应 git 的项目 id 和默认 pr 分支

mc-pr run
// 执行

// 建议添加到package.json当中，配合git-hoooks
...
"scripts": {
  ...
  "pr": "mc-pr run",
  ...
},
"husky": {
  "hooks": {
    ...
    "post-receive": "npm run test && npm run pr", // 待定
    ...
  }
}
...

```

```
// 默认会按照配置，发起一个从gitUrl项目，基于 sourceId 的当前分支，目标为 targetId ，使用都是当前的分支。

// 用户可以自行设置 source\target\sourceId\targetId 来对默认值进行覆盖

mc-pr run --source develop --target master
mc-pr run -s develop -t master -S 8012 -T 9009

```
