# RPGMakerMZ用プラグイン一覧
RPGツクールMZ用のプラグインです。

## プラグイン一覧

| プラグイン名  | 説明 |
| ------------- | ------------- |
| KEN_DamageCutShield.js | ダメージカットを行うシールドを提供します  |
| KEN_ForcedTargetState.js | ターゲットを強制するステート  |
| KEN_CustomizeGauge.js| アクターごとのパラメータ描画をカスタマイズ|

### KEN_DamageCutShield.js

* 概要  

ダメージカットを行うシールドを提供します。敵の攻撃を防ぐバリアのようなステートが作れます。  
使い方についてはプラグイン中のヘルプを参照ください。

![DamageCutShield001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/DamageCutShield_002.jpg)

* ステート設定の例  

以下の画像はシールド用のステート設定の例です。  
この設定では、3ターン持続するシールドになります。シールドは戦闘終了後に解除されます。  

![DamageCutShield001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/DamageCutShield_001.jpg)

### KEN_ForcedTargetState.js

* 概要  

ターゲットを強制するステートを実装できます。  
特定の敵の攻撃を引き付ける挑発のようなステートを作成できます。ツクールデフォルトにある「身代わり」と異なり、相手に付与することで敵の攻撃を引き付けます。

![DamageCutShield001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/ForcedTargetState_001.jpg)

強制ターゲットステートを付与されている時、強制ターゲット先しか選択不可にする設定も可能です。

![DamageCutShield001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/ForcedTargetState_002.jpg)

### KEN_CustomizeGauge.js
アクターごとのパラメータ描画形式をカスタマイズします。
従来のゲージ形式のほか、パラメータを図形や画像形式で描画することも可能です。

上記機能に加え、TPの最大値を変更する機能も提供します。




## 規約
[MITライセンス](https://github.com/t-kendama/RPGMakerMZ/blob/main/LICENSE)に準拠します。

## 作者連絡先
(X): https://x.com/t_kendama  
(Github): https://github.com/t-kendama/
