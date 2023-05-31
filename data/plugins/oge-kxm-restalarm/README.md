

## Development Setup

This plugin requires node 6.10.0. Use of [Yarn](https://yarnpkg.com/lang/en/docs/install/) is encouraged to build.

```
yarn install
yarn run build
```
## 使用方法
1. 默认从RTData库中查询实时值和历史值
2. 配置数据源时需配置KKS查询库名称
3. 支持批量查询，'json:kks编码片段1|kks编码片段2',查询含有'kks编码片段1'和'kks编码片段2'的所有编码。
4. 支持报警批量查询过滤，'alert:kks编码片段1|kks编码片段2',查询含有'kks编码片段1'和'kks编码片段2'的所有编码后，过滤value==1的值显示。