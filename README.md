# RPGMakerMZ用プラグイン一覧
個人ゲーム制作者KENが作成した、RPGツクールMZ用のプラグインを紹介するページです。  

これらプラグインは自身のゲームで使用する目的で制作しました。  
戦闘向けのプラグインがほぼ占めています。

## プラグイン一覧

| プラグイン名  | 説明 | リンク |
| ------------- | ------------- | ------------- |
| KEN_BattleStateInformation.js | 戦闘中にステート一覧やバトラーの情報を表示 | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_BattleStateInformation.js) |
| KEN_DamageCutShield.js| ダメージカットを行うシールドを提供します  | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_DamageCutShield.js) |
| KEN_ForcedTargetState.js | ターゲットを強制するステート  | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_ForcedTargetState.js) |
| KEN_CustomizeGauge.js | アクターごとのパラメータ描画をカスタマイズ| [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_CustomizeGauge.js) |
| KEN_ExtraDamagePlus.js | 追加ダメージプラグイン | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_ExtraDamagePlus.js) |
| KEN_StackState.js | 累積ステートプラグイン | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_StackState.js) |
| KEN_PartyHpCostSkill.js | パーティメンバーHPを消費するスキル | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_PartyHpCostSkill.js) |
| KEN_TermHelpWindow.js | 用語ヘルプウィンドウ | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_TermHelpWindow.js) |
| KEN_CategoryState.js | ステートのカテゴリを設定します | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_CategoryState.js) |
| KEN_RegionColor.js | ステートのカテゴリを設定します | [DL](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_RegionColor.js) |

## プラグイン説明

### KEN_BattleStateInformation.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/tree/master/KEN_BattleStateInformation.js) 

* 概要  
戦闘中に敵味方のステータス情報を表示するウィンドウ機能を提供します。  
ステートの内容や任意のステータス情報を表示することが可能です。

![BattleStateInformation01](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/BattleStateInformation_001.png)

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

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/tree/master/KEN_CustomizeGauge.js) 

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

### KEN_StackState.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/tree/master/KEN_StackState.js) 

* 概要  
効果を累積するステート（以下累積ステート）を作成します。  
累積ステートは内部にスタック（累積する値）を持ち、スタックごとに効果が増幅するようになります。  
例．スタックごとにHP減少量が増加するステート など

![StackState001](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/StackState_001.png)

* 使い方  
累積ステートの定義はプラグインパラメータ上で設定します。累積値は数値のほかスクリプトが使用可能です。  
スタックの操作はアイテム・スキルの効果で発動するほか、特定の条件下でスタックを増減させることも可能です。

![StackState002](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/StackState_002.png)

* 設定項目

| 設定項目 | 説明 |
| ------------- | ------------- | 
|ステートID|累積ステートを適用するステートIDを指定します。|
|最大スタック|スタックの上限を設定します。0の場合、上限が無くなります。|
|スタック初期値|ステート付与時に代入されるスタック値を設定します。|
|ステート自動付与|ステートが付与されていない状態でスタックが増加した時、ステートを自動付与します。|
|ステート自動解除|スタックが0になった時、ステートを自動解除します。|
|ターン数とスタック同期|スタックをステートターン数と同期します。スタックが上昇するとステートの残りターン数も連動して増加します。|
|戦闘中スタック数を表示|戦闘中、スタック数をステートアイコン上に表示します。|
|特性|スタック上昇時の効果を設定します。|

* 累積ステートの設定例  
本プラグインの簡単な設定例です。

【スタックの数だけ攻撃力増加】  
シンプルな強化バフ。  
![StackState002](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/StackState_ex01.png)

【スタックの数＋バトラーのレベルに応じて攻撃力増加】  
スクリプトを記述することで、バフ量をさらに細かく指定できます。  
![StackState002](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/StackState_ex02.png)

【スタック数ごとにHPが減る状態異常】  
スタックを増やすことでスリップダメージを増幅させるステート。  
![StackState002](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/StackState_ex03.png)

【１回だけ回避するステート】  
特徴欄を記述せず、スタック機能だけ使った設定方法も可能です。    
![StackState002](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/StackState_ex04.png)  

このように回避した時だけスタック数を減るようにすることで、「１回だけ回避できるステート」を作ることも出来ます。  
![StackState002](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/StackState_ex05.png)

### KEN_PartyHpCostSkill.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_PartyHpCostSkill.js) 

* 概要  
パーティメンバーのHPを消費するスキルを実装します。  
消費HPは実数・割合で指定可能です。

一風変わったスキルを実装したい方にどうぞ。

### KEN_TermHelpWindow.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/tree/master/KEN_TermHelpWindow.js) 

* 概要  
用語の説明を行うヘルプウィンドウ機能を提供します。  
ヘルプウィンドウ中の文字列から用語を検出し、用語の説明を追加のヘルプウィンドウで表示できるようになります。

![TermHelp01](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/KEN_TermHelpWindow01.png)


### KEN_CategoryState.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/tree/master/KEN_CategoryState.js) 

* 概要  
ステートにカテゴリを定義し、カテゴリ単位のステート解除が可能になります。  
・スキル・アイテムでカテゴリごとのステート解除ができる 
・カテゴリに属するステートを数を指定して解除  
・優先度を指定して解除順を制御

### KEN_RegionColor.js

[ダウンロード](https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_RegionColor.js) 

* 概要  
マップのリージョンに対して色を描画します。  
・プラグインパラメータまたはプラグインコマンドで設定  
・点滅またはフラッシュアニメーション機能  

![RegionColor](https://github.com/t-kendama/RPGMakerMZ/blob/master/images/RegionColor01.png)

## 規約
[MITライセンス](https://github.com/t-kendama/RPGMakerMZ/tree/main/LICENSE)に準拠します。

## 作者連絡先
(X): https://x.com/t_kendama  
(Github): https://github.com/t-kendama/
