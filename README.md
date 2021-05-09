# gas-pixela-reminder

[Pixela](https://pixe.la/ja)のあるグラフの今日の草(quantity)が0だったらSlackに通知するGoogleAppsScript

## 使い方

- `$ npm i`
- [clasp](https://github.com/google/clasp)の設定をする
  - 参考に`.clasp.sample.json`を置いている
- `$ npm run dev`でpushする
- スクリプトのプロパティを設定する
  - 必要なプロパティはmain関数の冒頭で確認できる
- 時間指定のトリガーを設定する
