## 美菜项目提交钩子

### 说明

主项目流程包括关键的 review，review 的整个操作比较复杂，需要优化

### 使用规则

```
mnpm install -g @mc/pr-hook

mc-pr init
// 默认将会在mcconf文件夹下建立.pr-hook.json 配置文件，如果重新 init 会有覆盖提示。此文件用来配置对应 git 的项目 id 和默认 pr 分支

mc-pr run
// 执行

```
