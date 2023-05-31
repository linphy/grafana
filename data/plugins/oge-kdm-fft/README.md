### 点值功率谱
1. 目前仅支持kdm数据源
2. 配置数据源，请选择查询历史，切换到插值模式，插值点数应该大于或等于配置项中的数据个数，否则无法获取有效数据个数
3. 配置个数应为2的N次幂

### Development
```
yarn add fft-js
yarn add echarts
yarn install --pure-lockfile
yarn dev
```