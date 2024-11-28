# RPGMakerMZ用プラグイン一覧
RPGツクールMZ用のプラグインです。

## プラグイン一覧

| プラグイン名  | 説明 | リンク |
| ------------- | ------------- | ------------- |
| KEN_DamageCutShield.js | ダメージカットを行うシールドを提供します  | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_DamageCutShield.js) |
| KEN_ForcedTargetState.js | ターゲットを強制するステート  | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_ForcedTargetState.js) |
| KEN_CustomizeGauge.js| アクターごとのパラメータ描画をカスタマイズ| [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_CustomizeGauge.js) |
| KEN_ExtraDamagePlus.js| 追加ダメージプラグイン | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_ExtraDamagePlus.js) |
| KEN_StackState.js | 累積ステートプラグイン | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_StackState.js) |

## プラグイン説明

### KEN_DamageCutShield.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_DamageCutShield.js) 

* 概要
ダメージカットを行うシールドを提供します。敵の攻撃を防ぐバリアのようなステートが作れます。  
使い方についてはプラグイン中のヘルプを参照ください。

![DamageCutShield001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/DamageCutShield_002.jpg)

* ステート設定の例  
以下の画像はシールド用のステート設定の例です。  
この設定では、3ターン持続するシールドになります。シールドは戦闘終了後に解除されます。  

![DamageCutShield001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/DamageCutShield_001.jpg)

### KEN_ForcedTargetState.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_ForcedTargetState.js) 

* 概要  
ターゲットを強制するステートを実装できます。  
特定の敵の攻撃を引き付ける挑発のようなステートを作成できます。  
ツクールデフォルトにある「身代わり」と異なり、相手に付与することで敵の攻撃を引き付けます。

![DamageCutShield001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/ForcedTargetState_001.jpg)

強制ターゲットステートを付与されている時、強制ターゲット先しか選択不可にする設定も可能です。

![DamageCutShield001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/ForcedTargetState_002.jpg)

### KEN_CustomizeGauge.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_CustomizeGauge.js) 

* 概要  
アクターごとのパラメータ描画形式をカスタマイズします。  
従来のゲージ形式のほか、パラメータを図形や画像形式で描画することも可能です。  
上記機能に加え、TPの最大値を変更する機能も提供します。  
パラメータの描画方法を魔改造したい方向けのプラグインです。

![CustomizeGauge001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/CustomizeGauge_001.jpg)

### KEN_ForcedTargetState.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_ExtraDamagePlus.js)

* 概要  
追加ダメージバフを得る装備・ステートを実装します。この追加ダメージはアイテムのダメージ計算式と独立して計算します。  
数式を記述することで使用者の攻撃力や攻撃対象の防御力を参照し、追加ダメージを発生させることも可能です。

![ExtraDamagePlus001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/ExtraDamagePlus_001.jpg)

### KEN_ForcedTargetState.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_StackState.js) 

* 概要  
効果を累積するステート（以下累積ステート）を作成します。
累積ステートは内部にスタック（累積する値）を持ち、スタックごとに効果が増幅するようになります。
例．スタックごとにHP減少量が増加するステート

![StackState001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/StackState_001.png)

* 使い方  
累積ステートの定義はプラグインパラメータ上で設定します。累積値は数値のほかスクリプトが使用可能です。  
スタックの操作はアイテム・スキルの効果で発動するほか、特定の条件下でスタックを増減させることも可能です。

![StackState002](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/StackState_002.png)

## 規約
[MITライセンス](https://github.com/t-kendama/RPGMakerMZ/blob/main/LICENSE)に準拠します。

## 作者連絡先
(X): https://x.com/t_kendama  
(Github): https://github.com/t-kendama/
