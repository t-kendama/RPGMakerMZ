/*
----------------------------------------------------------------------------
 KEN_StackState v1.0.2
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2024/11/30 ステート自動付与がONのとき、ステート付与処理が必ず行われていた不具合修正
                  通常攻撃属性のステート付与に対応
 1.0.1 2024/11/30 与ダメージ時にスタックを上昇させる機能追加
                  与ダメージ・被ダメージのスタック上昇条件に属性IDを指定する機能追加
                  ステート付与時のスタック上昇機能追加
                  ステート解除条件に「戦闘終了時に解除」にチェックを入れるとステート自動付与が行われなかった不具合修正
 1.0.0 2024/11/28 初版
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc 累積ステートプラグイン
 * @author KEN
 * @version 1.0.2
 * @url https://github.com/t-kendama/RPGMakerMZ/edit/master/KEN_StackState.js
 * 
 * @help
 *
 * -------------------------    概要    -------------------------
 * 効果を累積するステート（以下累積ステート）を作成します。
 * 
 * 累積ステートは内部にスタック（累積する値）を持ち、スタックごとに効果が
 * 増幅するようになります。
 * 例．スタックごとにHP減少量が増加するステート
 *  
 * -------------------------    使い方    -------------------------
 * 累積ステートの定義はプラグインパラメータ上で設定します。
 * 累積値は数値のほかスクリプトが使用可能です。
 * 
 * スタックの操作はアイテム・スキルの効果で発動するほか、
 * 特定の条件下でスタックを増減させることも可能です。
 * スタックの増減に関わる設定はデータベースのメモ欄に記述します。
 * 
 * 補足；
 * スタックの増加にはステートの付与効果はないため、事前に累積ステートを
 * 付与しておく必要があります。
 * スタック増加だけでステートを付与したい場合、プラグインパラメータの
 * 「ステート自動付与」の項目をONにしてください。
 * 
 * 
 * 【プラグインパラメータ説明】
 * ・ステートID
 * 累積ステートの対象となるステートIDを設定します。
 * ステートIDは重複して設定しないでください。
 * 
 * ・最大スタック
 * 累積ステートの最大スタックを設定します。
 * ０を設定すると上限値が無くなります。
 * 
 * ・スタック初期値
 * 累積ステートが付与された時に代入されるスタック値を設定します。
 * 
 * ・ステート自動付与
 * ステートが付与されていない状態でスタックを増加した時、
 * ステートを自動で付与します。
 * 
 * ・ステート自動解除
 * スタックが0になった時、ステートを自動解除します。
 * 
 * ・ターン数とスタック同期
 * ステートのターン数とスタックを連動させる機能です。
 * ターン数の経過と共にスタックが減少するようになります。
 * スタックが増加した場合、ステートのターン数も増加します。
 * 
 * ・戦闘中スタック数を表示
 * 戦闘中、スタック値をアイコン上に表示します。
 * 
 * ・特徴
 * 累積する効果を設定します。
 * 
 * 設定例については以下のページも参照ください。
 * https://github.com/t-kendama/RPGMakerMZ?tab=readme-ov-file#ken_stackstatejs
 * 
 * -------------------------    メモ欄設定    -------------------------
 * 
 * 【基本編】
 * アイテム・スキルを使用したときにスタックを増減させたい時は
 * 以下のタグを設定します。
 * 
 * <GainStack[ステートID]:スタック増減値>
 * 記述欄：アイテム・スキル
 * このタグが設定されたアイテム・スキルの効果を受けたバトラーの
 * スタックが増減します。
 * 記述例．
 * <GainStack11:2>
 * ステートID11のスタックを2増加します
 * 
 * <GainStackOwn[ステートID]:スタック増減値>
 * 記述欄：アイテム・スキル
 * このタグが設定されたアイテム・スキル使用者のスタックが増減します。
 * 
 * 
 * 【応用編】
 * 特定の条件下でスタックを増減させたい時の設定です。
 * この効果を持つバトラーが条件を満たした時、スタック数が増減します。
 * 
 * <StackHpDamageAttack[ステートID]:スタック増減値, 属性ID（省略可）>
 * 記述欄：武器・防具・ステート
 * HPダメージを与えた時、攻撃対象のスタックが増減します。
 * 属性IDを指定すると、その属性IDを使用した時のみスタックが増減します。
 * ダメージが0の場合、効果は発動しません。
 * 
 * <StackHpDamageReceive[ステートID]:スタック増減値, 属性ID（省略可）>
 * 記述欄：武器・防具・ステート
 * HPダメージを受けた時、攻撃を受けた対象のスタックが増減します。
 * ダメージが0の場合、効果は発動しません。
 * 
 * <StackMpDamageAttack[ステートID]:スタック増減値, 属性ID（省略可）>
 * 記述欄：武器・防具・ステート
 * MPダメージを与えた時、攻撃対象のスタックが増減します。
 * ダメージが0の場合、効果は発動しません。
 * 
 * <StackMpDamageReceive[ステートID]:スタック増減値, 属性ID（省略可）>
 * 記述欄：武器・防具・ステート
 * MPダメージを受けた時、攻撃を受けた対象のスタックが増減します。
 * ダメージが0の場合、効果は発動しません。
 * 
 * <StackHpLoss[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * HP減少時スタックが増減します。
 * 
 * <StackHpGain[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * HP増加時スタックが増減します。
 * 
 * <StackMpLoss[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * MP減少時スタックが増減します。
 * 
 * <StackMpGain[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * MP増加時スタックが増減します。
 * 
 * <StackTpLoss[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * TP減少時スタックが増減します。
 * 
 * <StackTpGain[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * TP増加時スタックが増減します。
 * 
 * <StackStateApply[ステートID]:スタック増減値, ステートID(省略可)>
 * 記述欄：武器・防具・ステート
 * ステートを付与した時、攻撃対象のスタックが増減します。
 * ステートIDを指定した場合、設定したステートIDが付与された時に
 * スタックが増減します。
 * 
 * <StackCritical[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * 会心攻撃を行った時にスタックが増減します。
 * 
 * <StackEvaded[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * 回避時にスタックが増減します。
 * 
 * <StackCounter[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * 反撃時にスタックが増減します。
 * 
 * <StackReflection[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * 魔法反射時にスタックが増減します。
 * 
 * <StackSubstitute[ステートID]:スタック増減値>
 * 記述欄：武器・防具・ステート
 * 身代わり時にスタックが増減します。
 * 
 * 
 * -------------------------  スクリプト  -------------------------
 * $gameActors.actor(アクターID).stateStack(ステートID, スタック増減値)
 * アクターのスタック値を取得
 *
 * $gameActors.actor(アクターID).gainStack(ステートID, スタック増減値)
 * アクターのスタック数を増減
 * 
 * 
 * 
 * 
 * @command GainStateStackActor
 * @text アクターのスタック値を増減
 * @desc アクターの累積ステートの値を増減します。
 *
 * @arg actorId
 * @text アクターID
 * @desc スタックを変更するアクターID
 * @type actor
 * @default 1
 * 
 * @arg stateId
 * @text ステートID
 * @desc 累積ステート
 * @type state
 * @default 1
 * 
 * @arg stackNum
 * @text 増減値
 * @desc 増減するスタック値
 * @type number
 * @default 0
 * @max 999
 * @min -999
 * 
 * 
 * @command GainStateStackEnemy
 * @text エネミーのスタック値を増減（戦闘中のみ可）
 * @desc エネミーの累積ステートの値を増減します。戦闘中のみ使用可能です。
 *
 * @arg enemyIndex
 * @text エネミーインデックス
 * @desc スタックを変更するエネミーのインデックス番号
 * @type number
 * @default 1
 * @min 1
 * 
 * @arg stateId
 * @text ステートID
 * @desc 累積ステート
 * @type state
 * @default 1
 * 
 * @arg stackNum
 * @text 増減値
 * @desc 増減するスタック値
 * @type number
 * @default 0
 * @max 999
 * @min -999
 * 
 * 
 * 
 * @param stateConfig
 * @text ステート設定
 * @desc 累積ステートの設定を行います　ステートIDは重複しないように設定ください
 * @default []
 * @type struct<StackState>[]
 * 
 * @param stackFontSize
 * @text フォントサイズ
 * @desc スタック数のフォントサイズ
 * @type number
 * @default 20
 * 
 * @param stackAxisX
 * @text スタックX座標
 * @desc 表示するスタック数のX座標
 * @type number
 * @default 4
 * 
 * @param stackAxisY
 * @text スタックY座標
 * @desc 表示するスタック数のY座標
 * @type number
 * @default 8
 * 
 */
/*~struct~StackState:
 *
 * @param stateId
 * @text ステートID
 * @desc 累積ステートを適用するステートIDを指定します
 * @default 1
 * @type state
 * 
 * @param maxStack
 * @text 最大スタック
 * @desc スタックの上限を設定します　0の場合、上限が無くなります
 * @type number
 * @default 0
 * 
 * @param initialStack
 * @text スタック初期値
 * @desc ステート付与時に代入されるスタック値を設定します
 * @type number
 * @default 0
 * 
 * @param autoStateAdd
 * @text ステート自動付与
 * @desc ステートが付与されていない状態でスタックが増加した時、ステートを自動付与します
 * @type boolean
 * @default false
 * 
 * @param autoStateRemove
 * @text ステート自動解除
 * @desc スタックが0になった時、ステートを自動解除します
 * @type boolean
 * @default false
 * 
 * @param syncTurnCount
 * @text ターン数とスタック同期
 * @desc スタックをステートターン数と同期します スタックが上昇するとステートの残りターン数も連動して増加します
 * @type boolean
 * @default false
 * 
 * @param showStackNum
 * @text 戦闘中スタック数を表示
 * @desc 戦闘中、スタック数をステートアイコン上に表示します
 * @type boolean
 * @default true
 * 
 * @param Trait
 * @text 特徴
 * @desc 累積する効果を設定する項目です　この項目は使用しません
 * 
 * @param Resist
 * @text 耐性
 * @desc 耐性に関する設定です　この項目は使用しません
 * @parent Trait
 * 
 * @param elementRate
 * @text 属性有効度
 * @desc 属性有効度を設定します　属性IDは重複して設定できません
 * @default []
 * @type struct<ElementRate>[]
 * @parent Resist
 * 
 * @param debuffRate
 * @text 弱体有効度
 * @desc 弱体有効度を設定します　能力値は重複して設定できません
 * @default []
 * @type struct<DebuffRate>[]
 * @parent Resist
 * 
 * @param stateRete
 * @text ステート有効度
 * @desc ステート有効度を設定します　ステートIDは重複して設定できません
 * @default []
 * @type struct<StateRate>[]
 * @parent Resist
 * 
 * @param Parameter
 * @text 能力値
 * @desc 能力値に関する設定です　この項目は使用しません
 * @parent Trait
 * 
 * @param nparam
 * @text 通常能力値
 * @desc 通常能力値を設定します　能力値は重複して設定できません
 * @default []
 * @type struct<NParam>[]
 * @parent Parameter
 * 
 * @param xparam
 * @text 追加能力値
 * @desc 追加能力値を設定します　能力値は重複して設定できません
 * @default []
 * @type struct<XParam>[]
 * @parent Parameter
 * 
 * @param sparam
 * @text 特殊能力値
 * @desc 特殊能力値を設定します　能力値は重複して設定できません
 * @default []
 * @type struct<SParam>[]
 * @parent Parameter
 * 
 * @param Attack
 * @text 攻撃
 * @desc 攻撃に関する設定です　この項目は使用しません
 * @parent Trait
 * 
 * @param attackState
 * @text 攻撃時ステート
 * @desc 攻撃時ステートを設定します　ステートIDは重複して設定できません
 * @default []
 * @type struct<AttackState>[]
 * @parent Attack
 * 
 * @param attackSpeedStack
 * @text 攻撃速度補正累積値
 * @desc 1スタックあたり累積する攻撃速度補正を設定します
 * @type string
 * @parent Attack
 * 
 * @param attackTimesStack
 * @text 追加回数累積値
 * @desc 1スタックあたり累積する追加回数を設定します
 * @type string
 * @parent Attack
 * 
 */
/*~struct~ElementRate:
 * @param id
 * @text 属性ID
 * @desc 累積する属性有効度の属性IDを設定します
 * @type number
 * @min 1
 * 
 * @param value
 * @text 属性有効度累積値(%)
 * @desc 1スタックで累積する属性有効度を設定します（単位は％）
 * @type string
 */
/*~struct~DebuffRate:
 * @param id
 * @text 弱体有効度
 * @desc 累積する弱体有効度を設定します
 * @type select
 * @option 最大HP
 * @value 0
 * @option 最大MP
 * @value 1
 * @option 攻撃力
 * @value 2
 * @option 防御力
 * @value 3
 * @option 魔法力
 * @value 4
 * @option 魔法防御
 * @value 5
 * @option 敏捷性
 * @value 6
 * @option 運
 * @value 7
 * 
 * @param value
 * @text 累積値(%)
 * @desc 1スタックで累積する弱体有効度を設定します（単位は％）
 * @type string
 */
/*~struct~StateRate:
 * @param id
 * @text ステートID
 * @desc 累積するステートを設定します
 * @type state
 * @min 1
 * 
 * @param value
 * @text 累積値(%)
 * @desc 1スタックあたり累積するステート有効度を設定します（単位は％）
 * @type string
 */
/*~struct~NParam:
 * @param id
 * @text 通常能力値
 * @desc 累積する通常能力値を設定します
 * @type select
 * @option 最大HP
 * @value 0
 * @option 最大MP
 * @value 1
 * @option 攻撃力
 * @value 2
 * @option 防御力
 * @value 3
 * @option 魔法力
 * @value 4
 * @option 魔法防御
 * @value 5
 * @option 敏捷性
 * @value 6
 * @option 運
 * @value 7
 * @default 0
 * 
 * @param addValue
 * @text 累積値（加算）
 * @desc 1スタックあたり加算する通常能力値を設定します
 * @type string
 * 
 * @param rateValue
 * @text 累積値（乗算）
 * @desc 1スタックあたり累積する通常能力値を設定します（単位は％）
 * @type string
 */
/*~struct~XParam:
 * @param id
 * @text 追加能力値
 * @desc 累積する追加能力値を設定します
 * @type select
 * @option 命中率
 * @value 0
 * @option 回避率
 * @value 1
 * @option 会心率
 * @value 2
 * @option 会心回避率
 * @value 3
 * @option 魔法回避率
 * @value 4
 * @option 魔法反射率
 * @value 5
 * @option 反撃率
 * @value 6
 * @option HP再生率
 * @value 7
 * @option MP再生率
 * @value 8
 * @option TP再生率
 * @value 9
 * @default 0
 * 
 * @param value
 * @text 累積値(%)
 * @desc 1スタックあたり累積する追加能力値を設定します（単位は％）
 * @type string
 */
/*~struct~SParam:
 * @param id
 * @text 特殊能力値
 * @desc 累積する特殊能力値を設定します
 * @type select
 * @option 狙われ率
 * @value 0
 * @option 防御効果率
 * @value 1
 * @option 回復効果率
 * @value 2
 * @option 薬の知識
 * @value 3
 * @option MP消費率
 * @value 4
 * @option TPチャージ率
 * @value 5
 * @option 物理ダメージ率
 * @value 6
 * @option 魔法ダメージ率
 * @value 7
 * @option 床ダメージ率
 * @value 8
 * @option 経験獲得率
 * @value 9
 * @default 0
 * 
 * @param value
 * @text 累積値(%)
 * @desc 1スタックあたり累積追加能力値を設定します（単位は％）
 * @type string
 */
/*~struct~AttackState:
 * @param id
 * @text ステートID
 * @desc 攻撃時に付与するステートIDを設定します
 * @type state
 * @min 1
 * 
 * @param value
 * @text 累積値(%)
 * @desc 1スタックあたり累積する通常攻撃時ステートIDを設定します（単位は％）
 * @type string
 */


(() => {
  "use strict";

  const PLUGIN_NAME = "KEN_StackState";
  var pluginParams = PluginManager.parameters(PLUGIN_NAME);
  var pluginParam = JSON.parse(JSON.stringify(pluginParams, function(key, value) {
    try {
        return JSON.parse(value);
    } catch (e) {
        try {
            return eval(value);
        } catch (e) {
            return value;
        }
    }
  }));

  //-----------------------------------------------------------------------------
  // Stack_State
  // 累積ステートのコンフィグを管理するクラス
  //-----------------------------------------------------------------------------
  class Stack_State {
    constructor() {
      this._config = {};
      this.initialize();
    }

    initialize() {
      this.pluginParamParser();
    }

    pluginParamParser() {
      pluginParam.stateConfig.forEach(config => {
        this._config[config.stateId] = config;
      });
    }

    config(stateId) {
      return this._config[stateId] || null;
    }

    isStackState(stateId) {
      return this.config(stateId) != null;
    }

    initialStack(stateId) {
      const config = this.config(stateId);
      return config ? config.initialStack : 0;
    }

    maxStack(stateId) {
      const config = this.config(stateId);
      return config ? config.maxStack : 0;
    }

    autoStateAdd(stateId) {
      const config = this.config(stateId);
      return config ? config.autoStateAdd : false;
    }

    autoStateRemove(stateId) {
      const config = this.config(stateId);
      return config ? config.autoStateRemove : false;
    }

    isSyncTurnCount(stateId) {
      const config = this.config(stateId);
      return config ? config.syncTurnCount : false;
    }

    isDisplayStack(stateId) {
      const config = this.config(stateId);
      return config ? config.showStackNum : false;
    }

    elementRate(stateId, elementId) {
      const config = this.config(stateId) || {};
      if(config.elementRate) {
        for(const elementConfig of config.elementRate) {
          if(elementConfig.id == elementId) {
            return elementConfig.value;
          }
        }
      }
      return 0;
    }

    debuffRate(stateId, debuffId) {
      const config = this.config(stateId) || {};
      if(config.debuffRate) {
        for(const debuffConfig of config.debuffRate) {
          if(debuffConfig.id == debuffId) {
            return debuffConfig.value;
          }
        }
      }
      return 0;
    }

    stateRate(stateId, stateRateId) {
      const config = this.config(stateId) || {};
      if(config.stateRete) {
        for(const stateConfig of config.stateRete) {
          if(stateConfig.id == stateRateId) {
            return stateConfig.value;
          }
        }
      }
      return 0;
    }

    paramRate(stateId, paramId) {
      const config = this.config(stateId) || {};
      if(config.nparam) {
        for(const paramConfig of config.nparam) {
          if(paramConfig.id == paramId) {
            return paramConfig.rateValue;
          }
        }
      }
      return 0;
    }

    paramAdd(stateId, paramId) {
      const config = this.config(stateId) || {};
      if(config.nparam) {
        for(const paramConfig of config.nparam) {
          if(paramConfig.id == paramId) {
            return paramConfig.addValue;
          }
        }
      }
      return 0;
    }

    xparam(stateId, xparamId) {
      const config = this.config(stateId) || {};
      if(config.xparam) {
        for(const paramConfig of config.xparam) {
          if(paramConfig.id == xparamId) {
            return paramConfig.value;
          }
        }
      }
      return 0;
    }

    sparam(stateId, sparamId) {
      const config = this.config(stateId) || {};
      if(config.sparam) {
        for(const paramConfig of config.sparam) {
          if(paramConfig.id == sparamId) {
            return paramConfig.value;
          }
        }
      }
      return 0;
    }

    attackStateList(stateId) {
      const config = this.config(stateId) || {};
      let result = [];
      if(config.attackState) {
        for(const attackStateConfig of config.attackState) {
          result.push(Number(attackStateConfig.id));
        }
      }
      return result;
    }

    attackState(stateId, attackStateId) {
      const config = this.config(stateId) || {};
      if(config.attackState) {
        for(const attackStateConfig of config.attackState) {
          if(attackStateConfig.id == attackStateId) {
            return attackStateConfig.value;
          }
        }
      }
      return 0;
    }

    attackSpeed(stateId) {
      const config = this.config(stateId) || {};
      return config.attackSpeedStack ? config.attackSpeedStack : 0;
    }

    attackTimes(stateId) {
      const config = this.config(stateId) || {};
      return config.attackTimesStack ? config.attackTimesStack : 0;
    }
  }
  
  const StackStateConfig = new Stack_State();

  PluginManager.registerCommand(PLUGIN_NAME, 'GainStateStackActor', args => {
    if (args.stackNum && StackStateConfig.isStackState(args.stateId)) {
      $gameActors.actor(args.actorId).gainStack(Number(args.stateId), Number(args.stackNum));
    }
  });

  PluginManager.registerCommand(PLUGIN_NAME, 'GainStateStackEnemy', args => {
    if (args.stackNum && StackStateConfig.isStackState(args.stateId) && $gameParty.inBattle()) {
      const index = Number(args.enemyIndex) - 1;
      if ($gameTroop.members()[index]) {
        $gameTroop.members()[index].gainStack(Number(args.stateId), Number(args.stackNum));
      }      
    }
  });

  //-----------------------------------------------------------------------------
  // Game_BattlerBase
  //-----------------------------------------------------------------------------
  const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
  Game_BattlerBase.prototype.initMembers = function() {
    this.clearStackStates();
    _Game_BattlerBase_initMembers.call(this);    
  };

  Game_BattlerBase.prototype.clearStackStates = function() {
    this._stackStates = {};
  };

  // スタック値を取得
  Game_BattlerBase.prototype.stateStack = function(stateId) {
    return this._stackStates[stateId] ? this._stackStates[stateId] : 0;
  };

  // スタック一覧を取得（アイコン描画用）
  Game_BattlerBase.prototype.stackList = function() {
    // 条件：累積ステートかつアイコンが設定されている
    const battler = this;
    return this.states().map(function(state) {
      if(StackStateConfig.isStackState(state.id)){
        if(StackStateConfig.isDisplayStack(state.id)) {
          return battler.stateStack(state.id);
        }
      }
      return NaN;
    });    
  };

  Game_BattlerBase.prototype.gainStack = function(stateId, value) {
    const previousStack = this._stackStates[stateId] || 0;
    this.autoAddStateWithStack(stateId, value);  // ステート自動付与処理
    if(this.gainStackAvailable(stateId)) {
      let sum = Math.min(this._stackStates[stateId] + value);
      if(StackStateConfig.maxStack(stateId) != 0) {
        sum = Math.min(StackStateConfig.maxStack(stateId), sum);
      }
      if(StackStateConfig.isSyncTurnCount(stateId)) {
        this._stateTurns[stateId] = Math.max(sum, 0);
      }
      this._stackStates[stateId] = Math.max(sum, 0);
    }
    this.autoRemoveStateWithStack(stateId);
  };

  // ステートが付与されていない状態でスタックが増加した時、ステート自動付与
  Game_BattlerBase.prototype.autoAddStateWithStack = function(stateId, value) {
    if(StackStateConfig.autoStateAdd(stateId) && !this.isStateAffected(stateId) && this.isStateBattleOnly(stateId) && value > 0) {      
      this.addState(stateId);
    }
  };

  Game_BattlerBase.prototype.isStateBattleOnly = function(stateId) {
    return $dataStates[stateId].removeAtBattleEnd ? $gameParty.inBattle() : true;
  };

  // スタック0のときステート自動解除
  Game_BattlerBase.prototype.autoRemoveStateWithStack = function(stateId) {
    if(StackStateConfig.autoStateRemove(stateId) && this.stateStack(stateId) <= 0){
      this.removeState(stateId);
    }
  };

  Game_BattlerBase.prototype.gainStackAvailable = function(stateId) {
    return this.isStateAffected(stateId);
  };

  const _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
  Game_BattlerBase.prototype.addNewState = function(stateId) {
    _Game_BattlerBase_addNewState.call(this, stateId);
    if (StackStateConfig.isStackState(stateId)) {
      this._stackStates[stateId] = StackStateConfig.initialStack(stateId);
    }
  };

  const _Game_BattlerBase_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
  Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    _Game_BattlerBase_resetStateCounts.call(this, stateId);
    if(StackStateConfig.isStackState(stateId) && StackStateConfig.isSyncTurnCount(stateId)) {
      this._stateTurns[stateId] = this.stateStack(stateId);
    }
  };

  const _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
  Game_BattlerBase.prototype.eraseState = function(stateId) {
    _Game_BattlerBase_eraseState.call(this, stateId);
    delete this._stackStates[stateId];
  };

  const _Game_BattlerBase_updateStateTurns = Game_BattlerBase.prototype.updateStateTurns;
  Game_BattlerBase.prototype.updateStateTurns = function() {
    _Game_BattlerBase_updateStateTurns.call(this);
    Object.entries(this._stackStates).forEach(([key]) => {
      if(StackStateConfig.isStackState(key) && StackStateConfig.isSyncTurnCount(key)){
        this.gainStack(Number(key), -1);
      }
    });
  };

  Game_BattlerBase.prototype.isStackStateAffected = function() {
    for(const stateId of this._states) {
      if(StackStateConfig.isStackState(stateId)) {
        return true;
      }
    }
    return false;
  };

  Game_BattlerBase.prototype.stackElementRate = function(elementId) {
    let result = 0;
    for (const stateId of this._states) {
      result += Math.floor(this.evaluateStackParam(StackStateConfig.elementRate(stateId, elementId)) * this.stateStack(stateId));
    }
    return result / 100;
  };

  Game_BattlerBase.prototype.stackDebuffRate = function(paramId) {
    let result = 0;
    for (const stateId of this._states) {
      result += Math.floor(this.evaluateStackParam(StackStateConfig.debuffRate(stateId, paramId)) * this.stateStack(stateId));
    }
    return result / 100;
  };

  Game_BattlerBase.prototype.stackStateRate = function(argStateId) {
    let result = 0;
    for (const stateId of this._states) {
      result += Math.floor(this.evaluateStackParam(StackStateConfig.stateRate(stateId, argStateId)) * this.stateStack(stateId));
    }
    return result / 100;
  };

  Game_BattlerBase.prototype.paramStackRate = function(paramId) {
    let result = 0;
    for (const stateId of this._states) {
      result += this.evaluateStackParam(StackStateConfig.paramRate(stateId, paramId)) * this.stateStack(stateId);
    }
    return 1 + result / 100;
  };

  Game_BattlerBase.prototype.paramStackAdd = function(paramId) {
    let result = 0;
    for (const stateId of this._states) {
      result += Math.floor(this.evaluateStackParam(StackStateConfig.paramAdd(stateId, paramId)) * this.stateStack(stateId));
    }
    return result;
  };

  Game_BattlerBase.prototype.xparamStack = function(xparamId) {
    let result = 0;
    for (const stateId of this._states) {
      result += Math.floor(this.evaluateStackParam(StackStateConfig.xparam(stateId, xparamId)) * this.stateStack(stateId));
    }
    return result / 100;
  };

  Game_BattlerBase.prototype.sparamStack = function(sparamId) {
    let result = 0;
    for (const stateId of this._states) {
      result += Math.floor(this.evaluateStackParam(StackStateConfig.sparam(stateId, sparamId)) * this.stateStack(stateId));
    }
    return result / 100;
  };

  Game_BattlerBase.prototype.attackStatesStackList = function() {
    let result = [];
    for (const stateId of this._states) {
      result = result.concat(StackStateConfig.attackStateList(stateId));
    }
    return result;
  };

  Game_BattlerBase.prototype.attackStateStack = function(attackStateId) {
    let result = 0;
    for (const stateId of this._states) {
      result += Math.floor(this.evaluateStackParam(StackStateConfig.attackState(stateId, attackStateId)) * this.stateStack(stateId));
    }
    return result;
  };

  Game_BattlerBase.prototype.attackSpeedStack = function() {
    let result = 0;
    for (const stateId of this._states) {
      result += Math.floor(this.evaluateStackParam(StackStateConfig.attackSpeed(stateId)) * this.stateStack(stateId));
    }
    return result;
  };

  Game_BattlerBase.prototype.attackTimesStack = function() {
    let result = 0;
    for (const stateId of this._states) {
      result += Math.floor(this.evaluateStackParam(StackStateConfig.attackTimes(stateId)) * this.stateStack(stateId));
    }
    return result;
  };

  // 数式を評価
  Game_BattlerBase.prototype.evaluateStackParam = function(formula) {
    if(!isNaN(parseFloat(formula)) && isFinite(formula)) {
      return Number(formula);
    }
    try {
      const a = this;
      const actor = this;
      const value = Math.floor(eval(formula));
      return isNaN(value) ? 0 : value;
    } catch (e) {
      return 0;
    }
  };

  // 属性有効度
  const _Game_BattlerBase_elementRate = Game_BattlerBase.prototype.elementRate;
  Game_BattlerBase.prototype.elementRate = function(elementId) {
    const baseRate = _Game_BattlerBase_elementRate.call(this, elementId);
    if(this.isStackStateAffected()) {      
      return baseRate + this.stackElementRate(elementId);
    }
    return baseRate; 
  };  

  // 弱体有効度
  const _Game_BattlerBase_debuffRate = Game_BattlerBase.prototype.debuffRate;
  Game_BattlerBase.prototype.debuffRate = function(paramId) {
    const baseRate = _Game_BattlerBase_debuffRate.call(this, paramId);
    if(this.isStackStateAffected()) {      
      return baseRate + this.stackDebuffRate(paramId);
    }
    return baseRate;
  };

  // ステート有効度
  const _Game_BattlerBase_stateRate = Game_BattlerBase.prototype.stateRate;
  Game_BattlerBase.prototype.stateRate = function(stateId) {
    const baseRate = _Game_BattlerBase_stateRate.call(this, stateId);
    if(this.isStackStateAffected()) {      
      return baseRate + this.stackStateRate(stateId);
    }
    return baseRate;
  };

  // 通常能力値
  const _Game_BattlerBase_param = Game_BattlerBase.prototype.param;
  Game_BattlerBase.prototype.param = function(paramId) {
    if( this.isStackStateAffected() ) {
      const value =
        this.paramBasePlus(paramId) *
        this.paramRate(paramId) *
        this.paramBuffRate(paramId) *
        this.paramStackRate(paramId) + 
        this.paramStackAdd(paramId);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    } else {
      return _Game_BattlerBase_param.call(this, paramId);
    }
  };

  // 追加能力値
  const _Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
  Game_BattlerBase.prototype.xparam = function(xparamId) {
    if (this.isStackStateAffected()) {
      const baseXParam = _Game_BattlerBase_xparam.call(this, xparamId);
      return baseXParam + this.xparamStack(xparamId);
    } else {
      return _Game_BattlerBase_xparam.call(this, xparamId);
    }
  };

  // 特殊能力値
  const _Game_BattlerBase_sparam = Game_BattlerBase.prototype.sparam;
  Game_BattlerBase.prototype.sparam = function(sparamId) {
    if (this.isStackStateAffected()) {
      const baseSParam = _Game_BattlerBase_sparam.call(this, sparamId);
      return baseSParam + this.sparamStack(sparamId);
    } else {
      return _Game_BattlerBase_sparam.call(this, sparamId);
    }
  };

  // 攻撃時ステート一覧
  const _Game_BattlerBase_attackStates = Game_BattlerBase.prototype.attackStates;
  Game_BattlerBase.prototype.attackStates = function() {
    const baseStates = _Game_BattlerBase_attackStates.call(this);
    if(this.isStackStateAffected()) {
      const mergedArray = baseStates.concat(this.attackStatesStackList());
      return [...new Set(mergedArray)];
    }
    return baseStates;
  };

  // 攻撃時ステート
  const _Game_BattlerBase_attackStateRate = Game_BattlerBase.prototype.attackStatesRate;
  Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
    const baseRate = _Game_BattlerBase_attackStateRate.call(this, stateId);
    if(this.isStackStateAffected()) {
      return baseRate + this.attackStateStack(stateId);
    }
    return baseRate;
  };

  // 攻撃速度補正
  const _Game_BattlerBase_attackSpeed = Game_BattlerBase.prototype.attackSpeed;
  Game_BattlerBase.prototype.attackSpeed = function() {
    const baseValue = _Game_BattlerBase_attackSpeed.call(this);
    if(this.isStackStateAffected()) {
      return baseValue + this.attackSpeedStack();
    }
    return baseValue;
  };

  // 追加回数
  const _Game_BattlerBase_attackTimesAdd = Game_BattlerBase.prototype.attackTimesAdd;
  Game_BattlerBase.prototype.attackTimesAdd = function() {
    const baseValue = _Game_BattlerBase_attackTimesAdd.call(this);
    if(this.isStackStateAffected()) {
      return baseValue + this.attackTimesStack();
    }
    return baseValue;
  };

  //-----------------------------------------------------------------------------
  // Game_Battler
  //-----------------------------------------------------------------------------
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // メモ欄から指定したタグに一致するスタック一覧を返す
  // return: {stateId, gainStack}
  Game_Battler.prototype.getStackStateTrait = function(trait) {
    const escapedTrait = escapeRegExp(trait); // 特殊文字をエスケープ
    const regex = new RegExp("^" + escapedTrait + "(\\d+)$");
    let traits = {};

    // 装備の処理
    if (this.isActor()) {
        for (const item of this.equips()) {
            if (!item) continue;
            Object.entries(item.meta).forEach(([key, value]) => {
                const match = key.match(regex);
                if (match) {
                    const stateId = parseInt(match[1], 10); // ステートIDを取得
                    // カンマで区切られた値を配列として格納
                    const values = value.split(",").map(v => parseInt(v.trim(), 10) || 0);
                    traits[stateId] = traits[stateId] || []; // 配列を初期化
                    traits[stateId].push(...values); // 配列に値を追加
                }
            });
        }
    }

    // ステートの処理
    for (const state of this.states()) {
        Object.entries($dataStates[state.id].meta).forEach(([key, value]) => {
            const match = key.match(regex);
            if (match) {
                const stateId = parseInt(match[1], 10); // ステートIDを取得
                // カンマで区切られた値を配列として格納
                const values = value.split(",").map(v => parseInt(v.trim(), 10) || 0);
                traits[stateId] = traits[stateId] || []; // 配列を初期化
                traits[stateId].push(...values); // 配列に値を追加
            }
        });
    }

    return traits;
  };

  const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
  Game_Battler.prototype.gainHp = function(value) {
    _Game_Battler_gainHp.call(this, value);
    const stackStateTraitsHpGain = this.getStackStateTrait("StackHpGain");
    const stackStateTraitsHpLoss = this.getStackStateTrait("StackHpLoss");

    // HP増加
    Object.entries(stackStateTraitsHpGain).forEach(([key, stack]) => {
      if(value > 0) {
        this.gainStack(Number(key), Number(stack));
      }
    });
    // HP減少
    Object.entries(stackStateTraitsHpLoss).forEach(([key, stack]) => {
      if(value < 0) {
        this.gainStack(Number(key), Number(stack));
      }
    });
  };

  const _Game_Battler_gainMp = Game_Battler.prototype.gainMp;
  Game_Battler.prototype.gainMp = function(value) {
    _Game_Battler_gainMp.call(this, value);
    const stackStateTraitsMpGain = this.getStackStateTrait("StackMpGain");
    const stackStateTraitsMpLoss = this.getStackStateTrait("StackMpLoss");

    // MP増加
    Object.entries(stackStateTraitsMpGain).forEach(([key, stack]) => {
      if(value > 0) {
        this.gainStack(Number(key), Number(stack));
      }
    });
    // MP減少
    Object.entries(stackStateTraitsMpLoss).forEach(([key, stack]) => {
      if(value < 0) {
        this.gainStack(Number(key), Number(stack));
      }
    });
  };

  const _Game_Battler_gainTp = Game_Battler.prototype.gainTp;
  Game_Battler.prototype.gainTp = function(value) {
    _Game_Battler_gainTp.call(this, value);
    const stackStateTraitsTpGain = this.getStackStateTrait("StackTpGain");
    const stackStateTraitsTpLoss = this.getStackStateTrait("StackTpLoss");

    // TP増加
    Object.entries(stackStateTraitsTpGain).forEach(([key, stack]) => {
      if(value > 0) {
        this.gainStack(Number(key), Number(stack));
      }
    });
    // TP減少
    Object.entries(stackStateTraitsTpLoss).forEach(([key, stack]) => {
      if(value < 0) {
        this.gainStack(Number(key), Number(stack));
      }
    });
  };

  const _Game_Battler_gainSilentTp = Game_Battler.prototype.gainSilentTp;
  Game_Battler.prototype.gainSilentTp = function(value) {
    _Game_Battler_gainSilentTp.call(this, value);
    const stackStateTraitsTpGain = this.getStackStateTrait("StackTpGain");
    const stackStateTraitsTpLoss = this.getStackStateTrait("StackTpLoss");

    // TP増加
    Object.entries(stackStateTraitsTpGain).forEach(([key, stack]) => {
      if(value > 0) {
        this.gainStack(Number(key), Number(stack));
      }
    });
    // TP減少
    Object.entries(stackStateTraitsTpLoss).forEach(([key, stack]) => {
      if(value < 0) {
        this.gainStack(Number(key), Number(stack));
      }
    });
  };

  //-----------------------------------------------------------------------------
  // Game_Action
  //-----------------------------------------------------------------------------
  function getItemElements(subject, data) {
    if (!data || !data.damage) return null; // 無効なデータの場合
    const elementId = data.damage.elementId;
    if(elementId == -1) {
      return subject.attackElements();
    }
    return [elementId];
  }

  const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
  Game_Action.prototype.applyItemUserEffect = function(target) {
    _Game_Action_applyItemUserEffect.call(this, target);
    this.applyStackCritical(target);
    this.applyStackState(target);
  };

  Game_Action.prototype.applyStackState = function(target) {
    const item = this.item();    
    const regex = /^GainStack(\d+)$/;

    // ターゲットへのスタック処理
    Object.entries(item.meta).forEach(([key, value]) => {
      const match = key.match(regex); // 正規表現でキーをチェック
      if (match) {
        const stateId = parseInt(match[1], 10); // 整数値を取得
        const gainValue = parseInt(value, 10) != 0 ? parseInt(value, 10) : 1; 
        target.gainStack(stateId, gainValue);
        target.result().stackStates[stateId] = gainValue;
      }
    });
  };

  // 自分自身のスタック処理
  Game_Action.prototype.applyStackStateOwn = function(/*target*/) {    
    const battler = this.subject();
    const traits = battler.getStackStateTrait("GainStackOwn");

    Object.entries(traits).forEach(([key, value]) => {
      const stateId = Number(key);
      battler.gainStack(stateId, value);
    }); 
  };

  // 属性IDの判定
  function matchElementId(elements, requiredElementId) {
    if (requiredElementId === null || requiredElementId === undefined) {
      return true; // 属性IDが指定されていない場合は常に一致
    }
    return elements.includes(requiredElementId);
  }

  // 与ダメージ・被HPダメージ時
  const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
  Game_Action.prototype.executeHpDamage = function(target, value) {
    _Game_Action_executeHpDamage.call(this, target, value);

    if (value > 0) {
      const item = this.item();
      const elements = getItemElements(this.subject(), item); // アイテムの属性IDを取得
      console.log(elements)

      // 被ダメージ時のスタック処理
      const stackStateTraitsReceive = target.getStackStateTrait("StackHpDamageReceive");
      Object.entries(stackStateTraitsReceive).forEach(([stateId, stackDataArray]) => {
        const stackValue = stackDataArray[0]; // スタック増加値
        const requiredElementId = stackDataArray.length > 1 ? stackDataArray[1] : null; // 属性ID (省略可能)

        if (this.isHpDamageOrDrain() && matchElementId(elements, requiredElementId)) {
          target.gainStack(Number(stateId), Number(stackValue));
        }
      });

      // 与ダメージ時のスタック処理
      const stackStateTraitsAttack = this.subject().getStackStateTrait("StackHpDamageAttack");
      Object.entries(stackStateTraitsAttack).forEach(([stateId, stackDataArray]) => {
        const stackValue = stackDataArray[0]; // スタック増加値
        const requiredElementId = stackDataArray.length > 1 ? stackDataArray[1] : null; // 属性ID (省略可能)

        if (this.isHpDamageOrDrain() && matchElementId(elements, requiredElementId)) {
          target.gainStack(Number(stateId), Number(stackValue));
        }
      });
    }
  };

  // 被MPダメージ時
  const _Game_Action_executeMpDamage = Game_Action.prototype.executeMpDamage;
  Game_Action.prototype.executeMpDamage = function(target, value) {
    _Game_Action_executeMpDamage.call(this, target, value);
    
    if(value > 0) {
      // 被ダメージ時のスタック処理
      const stackStateTraitsReceive = target.getStackStateTrait("StackMpDamageReceive");
      Object.entries(stackStateTraitsReceive).forEach(([stateId, stackDataArray]) => {
        const stackValue = stackDataArray[0]; // スタック増加値
        const requiredElementId = stackDataArray.length > 1 ? stackDataArray[1] : null; // 属性ID (省略可能)

        if (this.isMpDamageOrDrain() && matchElementId(elementId, requiredElementId)) {
          target.gainStack(Number(stateId), Number(stackValue));
        }
      });

      // 与ダメージ時のスタック処理
      const stackStateTraitsAttack = this.subject().getStackStateTrait("StackMpDamageAttack");
      Object.entries(stackStateTraitsAttack).forEach(([stateId, stackDataArray]) => {
        const stackValue = stackDataArray[0]; // スタック増加値
        const requiredElementId = stackDataArray.length > 1 ? stackDataArray[1] : null; // 属性ID (省略可能)

        if (this.isMpDamageOrDrain() && matchElementId(elementId, requiredElementId)) {
          target.gainStack(Number(stateId), Number(stackValue));
        }
      });
    }
  };

  // ステート付与時
  const _Game_Action_itemEffectAddState = Game_Action.prototype.itemEffectAddState;
  Game_Action.prototype.itemEffectAddState = function(target, effect) {
    const beforeAddedStates = [...target.result().addedStates]; // 付与前のステート
    _Game_Action_itemEffectAddState.call(this, target, effect); // 元の処理を実行
    const newlyAddedStates = target.result().addedStates.filter(
      stateId => !beforeAddedStates.includes(stateId)
    );
    if (isItemEffectStateMatched(this.subject(), newlyAddedStates, effect)) {
      this.itemEffectAddStackWithState(target, effect);
    }
  };

  //
  function isItemEffectStateMatched(subject, newlyAddedStates, effect) {
    if(effect.dataId == 0) {
      const targetArray = subject.attackStates();
      return newlyAddedStates.some(state => targetArray.includes(state));
    }
    return newlyAddedStates.includes(effect.dataId);
  }

  // ステートIDの判定
  function matchStateId(subject, requiredStateId, effect) {
    if (requiredStateId === null || requiredStateId === undefined) {
      return true;
    }
    if(effect.dataId == 0) {
      const targetArray = subject.attackStates();
      return targetArray.includes(requiredStateId);
    }
    return effect.dataId == requiredStateId;
  }

  Game_Action.prototype.itemEffectAddStackWithState = function(target, effect){
    const stackStateTraits = this.subject().getStackStateTrait("StackStateApply");
    Object.entries(stackStateTraits).forEach(([gainStateId, stackDataArray]) => {
      const stackValue = stackDataArray[0]; // スタック増加値
      const requiredStateId = stackDataArray.length > 1 ? stackDataArray[1] : null; // ステートID (省略可能)

      if (matchStateId(this.subject(), requiredStateId, effect)) {
        target.gainStack(Number(gainStateId), Number(stackValue));
      }
    });
  };

  // 会心時
  Game_Action.prototype.applyStackCritical = function(target) {
    const result = target.result();    
    if(result.critical) {
      const stackStateTraits = this.subject().getStackStateTrait("StackCritical");
      Object.entries(stackStateTraits).forEach(([key, value]) => {        
        this.subject().gainStack(Number(key), Number(value));
      });
    }
  };

  Game_Action.prototype.isHpDamageOrDrain = function() {
    return this.checkDamageType([1, 5]);
  };

  Game_Action.prototype.isMpDamageOrDrain = function() {
    return this.checkDamageType([2, 6]);
  };

  //-----------------------------------------------------------------------------
  // BattleManager
  //-----------------------------------------------------------------------------
  // 通常アクション
  const _BattleManager_invokeNormalAction = BattleManager.invokeNormalAction;
  BattleManager.invokeNormalAction = function(subject, target) {
    _BattleManager_invokeNormalAction.call(this, subject, target);
    this.processOwnEffect();
    this.processEvasion(subject, target);
  };

  BattleManager.processOwnEffect = function() {
    const action = this._action;
    action.applyStackStateOwn();
  };

  // 反撃時
  const _BattleManager_invokeCounterAttack = BattleManager.invokeCounterAttack;
  BattleManager.invokeCounterAttack = function(subject, target) {
    _BattleManager_invokeCounterAttack.call(this, subject, target);
    const stackStateTraits = target.getStackStateTrait("StackCounter");
    Object.entries(stackStateTraits).forEach(([key, value]) => {
      target.gainStack(Number(key), Number(value));
    });
    this.processEvasion(subject, target);
  };

  // 魔法反射時
  const _BattleManager_invokeMagicReflection = BattleManager.invokeMagicReflection;
  BattleManager.invokeMagicReflection = function(subject, target) {
    _BattleManager_invokeMagicReflection.call(this, subject, target);
    const stackStateTraits = target.getStackStateTrait("StackReflection");
    Object.entries(stackStateTraits).forEach(([key, value]) => {
      target.gainStack(Number(key), Number(value));
    });
    this.processEvasion(subject, target);
  };

  // 身代わり時
  const _KEN_BattleManager_applySubstitute = BattleManager.applySubstitute;
  BattleManager.applySubstitute = function(target) {
    const stackStateTraits = target.getStackStateTrait("StackSubstitute");
    Object.entries(stackStateTraits).forEach(([key, value]) => {
      target.gainStack(Number(key), Number(value));
    });
    return _KEN_BattleManager_applySubstitute.call(this, target);
  };


  // 回避時の共通処理
  BattleManager.processEvasion = function(subject, target) {
    const targetResult = target.result();
    const subjectResult = subject.result();

    if (targetResult.evaded) {
      const stackStateTraits = target.getStackStateTrait("StackEvaded");
      Object.entries(stackStateTraits).forEach(([key, value]) => {
        target.gainStack(Number(key), Number(value));
      });
    }

    if (subjectResult.evaded) {
      const stackStateTraits = subject.getStackStateTrait("StackEvaded");
      Object.entries(stackStateTraits).forEach(([key, value]) => {
        subject.gainStack(Number(key), Number(value));
      });
    }
  };

  //-----------------------------------------------------------------------------
  // Game_ActionResult
  //-----------------------------------------------------------------------------
  const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    _Game_ActionResult_clear.call(this);
    this.clearStackStateResult();
  };

  Game_ActionResult.prototype.clearStackStateResult = function() {
    this.stackStates = {};
  };

  //-----------------------------------------------------------------------------
  // Sprite_StateIcon
  //-----------------------------------------------------------------------------
  
  const _Sprite_StateIcon_initialize =  Sprite_StateIcon.prototype.initialize;
  Sprite_StateIcon.prototype.initialize = function() {
    _Sprite_StateIcon_initialize.call(this);
    this.createStackSprite();
    this._stackNum = 0;    
  };

  Sprite_StateIcon.prototype.createStackSprite = function() {
    const sprite = new Sprite();    
    sprite.x = this.x + pluginParam.stackAxisX;
    sprite.y = this.y + pluginParam.stackAxisY;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.bitmap = new Bitmap(ImageManager.iconWidth, ImageManager.iconHeight);

    this._stackSprite = sprite;
    this.addChild(sprite);
  };

  Sprite_StateIcon.prototype.stackFontSize = function() {
    return pluginParam.stackFontSize;
  };

  Sprite_StateIcon.prototype.stackTextColor = function() {
    return ColorManager.normalColor();
  };

  Sprite_StateIcon.prototype.setupStackFont = function() {
    this._stackSprite.bitmap.fontSize = this.stackFontSize();
    this._stackSprite.bitmap.textColor = this.stackTextColor();
    this._stackSprite.bitmap.outlineColor = ColorManager.outlineColor();
    this._stackSprite.bitmap.outlineWidth = 3;
  };  

  const _Sprite_StateIcon_updateIcon = Sprite_StateIcon.prototype.updateIcon;
  Sprite_StateIcon.prototype.updateIcon = function() {    
    if(this._battler.isStackStateAffected()) {
      const icons = [];
      let stacks = [];
      if (this.shouldDisplay()) {
        icons.push(...this._battler.allIcons());
        stacks = this._battler.stackList();
      }
      if (icons.length > 0) {
        this._animationIndex++;
        if (this._animationIndex >= icons.length) {
            this._animationIndex = 0;
        }
        this._iconIndex = icons[this._animationIndex];
        this._stackNum = stacks[this._animationIndex];
      } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
        this._stackNum = NaN;        
      }
    } else {
      this._stackNum = NaN;
      _Sprite_StateIcon_updateIcon.call(this);      
    }    
  };

  const _Sprite_StateIcon_updateFrame = Sprite_StateIcon.prototype.updateFrame;
  Sprite_StateIcon.prototype.updateFrame = function() {
    _Sprite_StateIcon_updateFrame.call(this);
    this._stackSprite.bitmap.clear();
    if (this._stackNum >= 0 && !isNaN(this._stackNum)) {
      this.setupStackFont();
      this._stackSprite.bitmap.drawText(this._stackNum, 0, 0, ImageManager.iconWidth, ImageManager.iconHeight);
    }
  };
  
})();
