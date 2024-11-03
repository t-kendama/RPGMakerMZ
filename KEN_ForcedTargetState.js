/*
----------------------------------------------------------------------------
 KEN_ForcedTargetState v1.0.1
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/11/03 ステート付与失敗時も強制ステート効果が発動していた不具合修正
 1.0.0 2024/11/02 初版
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc ターゲット強制ステート
 * @author KEN
 * @version 1.0.1
 * @url https://github.com/t-kendama/RPGMakerMZ/blob/master/KEN_ForcedTargetState.js
 * 
 * @help
 *
 * -------------------------    概要    -------------------------
 * ターゲットを強制するステートを実装します。
 * このプラグインを使用することで、敵の攻撃を引き付ける挑発のようなステートを
 * 作成できます。
 * 
 * このステートが付与されたバトラーは、攻撃する際そのステートを付与した
 * バトラーしか攻撃できなくなります。
 * 
 * -------------------------    細かい仕様    -------------------------
 * ・強制ターゲットが適用されるのはアイテム（スキル）の範囲が「敵」の
 * 場合のみに限ります。
 * 味方や敵味方全員を対象とするアイテム（スキル）には適用できません。
 * 
 * ・複数の強制ターゲットステートが付与された場合、後に付与された
 * 強制ターゲットステートに上書きされます。
 * 
 * ・イベントコマンドで強制ターゲットステートを付与しても
 * ターゲット先は変わりません。
 * アイテム（スキル）で強制ターゲットステートを付与した時のみ、
 * 効果が発動します。
 * 
 * ・身代わり状態の敵がいた場合、身代わり状態が優先されます
 * 
 * -------------------------    使い方    -------------------------
 * このプラグインの設定はプラグインパラメータから行います。
 * 強制ターゲットステートを適用するステートを設定ください。
 * 
 * 【プラグインパラメータ補足】
 * ・全体攻撃を含める
 * 攻撃先は強制ターゲットのみが対象となります。
 * したがって、ターゲットは敵一体になります。
 * 
 * ・敵選択を強制
 * 設定をOFFにした場合、敵選択ウィンドウ上では強制ターゲット以外も
 * 選択可能ですが、実際に攻撃する時は強制ターゲットが攻撃対象となります。
 * 
 * 
 * 【その他の設定】
 * <InvalidForcedTarget>
 * 記述欄：アイテム、スキル。
 * このタグが設定されたアイテム・スキルは強制ターゲットの効果を無視します。
 * 
 * 
 * @param List
 * @text 強制ターゲットステートリスト
 * @desc 強制ターゲットステートの設定リストです。同一ステートは複数定義しないでください。
 * @default []
 * @type struct<Config>[]
 * 
 */
/*~struct~Config:
 *
 * @param stateId
 * @text ステートID
 * @desc 強制ターゲットを適用するステートです
 * @default 0
 * @type state
 * 
 * @param textBeforeAttack
 * @text 行動前メッセージ
 * @desc アイテム・スキル使用前にメッセージを表示します（%1:使用者, %2:ターゲット先）
 * @type text
 * @default %1は%2に挑発されている！
 * 
 * @param forceAllTarget
 * @text 全体攻撃を含める
 * @desc 全体攻撃も強制ターゲットの対象に含めます
 * @type boolean
 * @default false
 * 
 * @param forceRandomTarget
 * @text ランダム攻撃を含める
 * @desc ランダム攻撃も強制ターゲットの対象に含めます
 * @type boolean
 * @default false
 * 
 * @param forcedSelectTarget
 * @text 敵選択を強制
 * @desc 敵を選択する時、強制ターゲットしか選択できなくなります
 * @type boolean
 * @default true
 *
 * @param overwriteOtherState
 * @text 上書き時ステート解除
 * @desc 強制ターゲットを上書きした時、他の強制ターゲットステートを解除します
 * @type boolean
 * @default true
 * 
 * @param removeStateOnTargetDead
 * @text ターゲット戦闘不能時解除
 * @desc ターン終了時、強制ターゲットが戦闘不能の場合、強制ターゲットステートを自動解除します
 * @type boolean
 * @default true
 *
 */
 

(() => {
  "use strict";

  const PLUGIN_NAME = "KEN_ForcedTargetState";
  var pluginParams = PluginManager.parameters(PLUGIN_NAME);
  var param = JSON.parse(JSON.stringify(pluginParams, function(key, value) {
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

  // ステートIDが登録済の強制ターゲットステートかチェック
  const isForceState = function(stateId) {
    for (const item of param.List) {
      if(item.stateId == stateId) {
        return true;
      }
    }
    return false;
  };

  // 強制ターゲットステートに適用されるアイテム（スキル）か判断
  const isForcedTargetItem = function(item, stateId) {
    const config = param.List.find(config => config.stateId == stateId);
    const isInvalidSkill = item ? item.meta.InvalidForcedTarget : false;
    if (config && !isInvalidSkill) {
      let scopeList = [1];  // 敵単体
      if(config.forceAllTarget) scopeList = scopeList.concat([2]);
      if(config.forceRandomTarget) scopeList = scopeList.concat([3, 4, 5, 6]);

      return scopeList.includes(item.scope);
    }
    return false;
  };

  //====================================================================
  // ●Window_BattleLog
  //====================================================================
  const _KEN_Window_BattleLog_displayAction =  Window_BattleLog.prototype.displayAction;
  Window_BattleLog.prototype.displayAction = function(subject, item) {
    this.displayForcedTargetMessage(subject, item)
    _KEN_Window_BattleLog_displayAction.call(this, subject, item);
  };

  Window_BattleLog.prototype.displayForcedTargetMessage = function(subject, item) {
    if (subject.isForcedStateAffected() && subject.isForcedTargetAlive() && isForcedTargetItem(item, subject.forcedStateId())) {
      const text = this.makeForcedTargetMessage(subject);
      if(text) this.push("addText", text);
    }
  };

  Window_BattleLog.prototype.makeForcedTargetMessage = function(subject) {
    const subjectName = subject.name();
    const targetName = subject.getForcedTargetBattler() ? subject.getForcedTargetBattler().name() : "";
    const message = subject.getForcedStateConfig().textBeforeAttack;

    const text = String(message).format(subjectName, targetName);
    return text;
  };

  //====================================================================
  // ●Game_Battler
  //====================================================================
  const Game_Battler_initMembers = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    Game_Battler_initMembers.call(this);
    this.clearForcedTargetData();
  };

  Game_Battler.prototype.clearForcedTargetState = function() {        
    this.removeState(this._forcedStateId);
    this.clearForcedTargetData();
  };

  Game_Battler.prototype.clearForcedTargetData = function() {
    this._forcedStateId = -1;
    this._forcedTargetIndex = -1;
    this._forcedTargetActorId = -1;
  };

  const _Game_BattleBase_eraseState =  Game_BattlerBase.prototype.eraseState;
  Game_Battler.prototype.eraseState = function(stateId) {
    _Game_BattleBase_eraseState.call(this, stateId);
    for (const item of param.List) {
      if(stateId == item.stateId) {
        this.clearForcedTargetData();
      }
    }
  };

  Game_Battler.prototype.forcedTargetIndex = function() {
    return this._forcedTargetIndex;
  };

  Game_Battler.prototype.forcedStateId = function() {
    return this._forcedStateId;
  };

  Game_Battler.prototype.setForcedState = function(stateId, index) {
    // 上書き時のステート解除処理
    const config = param.List.find(data => data.stateId === stateId);
    if( config.overwriteOtherState ) {
      for (const stateConf of param.List) {
        if(stateConf.stateId != stateId) {
          this.removeState(stateConf.stateId);
        }
      }
    }

    this._forcedStateId = stateId;
    this._forcedTargetIndex = index;
    if( this.isEnemy() ) {
      // エネミーの場合アクターIDも代入する
      this._forcedTargetActorId = $gameParty.members()[index] ? $gameParty.members()[index].actorId() : -1; 
    }    
  };

  Game_Battler.prototype.isForcedStateAffected = function() {
    const stateId = this.forcedStateId();
    return stateId ? this.isStateAffected(stateId) : false;
  };

  Game_Battler.prototype.getForcedTargetBattler = function() {
    if(this.isActor()) {
      return $gameTroop.members()[this._forcedTargetIndex];
    } else {
      return $gameActors.actor(this._forcedTargetActorId);
    }
  };

  Game_Battler.prototype.isForcedTargetAlive = function() {
    const target = this.getForcedTargetBattler();
    return target ? target.isAlive() : false;
  };

  Game_Battler.prototype.getForcedStateConfig = function() {
    if( this._forcedStateId > 0) {
      return param.List.find(data => data.stateId === this._forcedStateId);
    }
    return null;
  };  

  const _Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
  Game_Battler.prototype.onTurnEnd = function(){
    _Game_Battler_onTurnEnd.call(this);
    if(!this.isForcedTargetAlive() && this.isRemoveStateOnTargetDead()) {
      this.clearForcedTargetState();
    }
  };

  Game_Battler.prototype.isRemoveStateOnTargetDead = function() {
    if(this._forcedStateId > 0) {
      return this.getForcedStateConfig().removeStateOnTargetDead;
    }
    return false;
  };

  Game_Battler.prototype.isForcedSelectTarget = function() {
    return false;
  };

  //====================================================================
  // ●Game_Actor
  //====================================================================
  Game_Actor.prototype.isForcedSelectTarget = function() {
    const data = this.getForcedStateConfig();
    return data ? data.forcedSelectTarget : false;
  };

  //====================================================================
  // ●Game_Troop
  //====================================================================
  Game_Troop.prototype.adjustedIndexForAliveEnemies = function(originalIndex) {
    let aliveCount = 0;
    // 全エネミーリストを順に確認して、指定されたインデックスまでの生存エネミーの数をカウント
    for (let i = 0; i < this.members().length; i++) {        
        if(i == originalIndex) break;
        // 戦闘不能エネミーをスキップしてカウント
        const enemy = this.members()[i];
        if (!enemy.isDead()) {
          aliveCount++;
        }
    }
    return aliveCount;
  };

  //====================================================================
  // ●Game_Action
  //====================================================================

  // ステート付与時に強制ターゲットのIDを格納する
  const _Game_Action_itemEffectAddState = Game_Action.prototype.itemEffectAddState;
  Game_Action.prototype.itemEffectAddState = function(target, effect) {
    _Game_Action_itemEffectAddState.call(this, target, effect);
    const subject = this.subject();
    const success = target.result().success;
    if(this.isForOpponent() && isForceState(effect.dataId) && success) {
      if (subject.isActor()) {
        const partyIndex = $gameParty.members().indexOf(subject);
        target.setForcedState(effect.dataId, partyIndex);
      } else if(subject.isEnemy()){
        const troopIndex = $gameTroop.members().indexOf(subject);
        target.setForcedState(effect.dataId, troopIndex);
      }      
    }
  };

  const _Game_Action_makeTargets = Game_Action.prototype.makeTargets;
  Game_Action.prototype.makeTargets = function() {
    const item = this.item();    
    if( !item.meta.InvalidForcedTarget ) {
      const targetIndex = this.subject().forcedTargetIndex();
      const repeats = this.numRepeats();
      let randomHitNum = 1;
      if(this.item().scope >= 4 && this.item().scope <= 6){
        randomHitNum = this.item().scope - 2;
      }

      // エネミーからの攻撃
      if (this.subject().isEnemy() && targetIndex >= 0 && this.isForceTargetRange()) {
        const target = this.subject().getForcedTargetBattler();
        if (target && target.isAlive()) {
          return Array(repeats * randomHitNum).fill(target);
        }
      }
      // アクターからの攻撃
      if (this.subject().isActor() && targetIndex >= 0 && this.isForceTargetRange()) {
        const target = this.subject().getForcedTargetBattler();
        if (target && target.isAlive()) {
          return Array(repeats * randomHitNum).fill(target);
        }
      }
    }

    // 通常のターゲット選択を実行
    return _Game_Action_makeTargets.call(this);
  };

  Game_Action.prototype.isForceTargetRange = function() {
    const stateId = this.subject().forcedStateId();
    if ( stateId ) {
      return isForcedTargetItem(this.item(), stateId);
    }    
    return false;
  };

  //====================================================================
  // ●Window_BattleEnemy
  //====================================================================  
  const _Window_BattleEnemy_activate = Window_BattleEnemy.prototype.activate;
  Window_BattleEnemy.prototype.activate = function() {
    _Window_BattleEnemy_activate.call(this);

    // BattleManager.actor() が null でないことを確認
    const actor = BattleManager.actor();
    const forcedIndex = actor && actor.forcedTargetIndex();
    const adjustedIndex = $gameTroop.adjustedIndexForAliveEnemies(forcedIndex);
    
    // 強制ターゲットが設定されている場合、そのインデックスに自動でカーソルを合わせる
    if (actor && adjustedIndex >= 0 && actor.isForcedSelectTarget() && actor.isForcedSelectTarget()) {
        this.select(adjustedIndex);
    }
  };

  const _Window_BattleEnemy_processOk = Window_BattleEnemy.prototype.processOk;
  Window_BattleEnemy.prototype.processOk = function() {
    const actor = BattleManager.actor();
    const forcedIndex = actor && actor.forcedTargetIndex();
    const adjustedIndex = $gameTroop.adjustedIndexForAliveEnemies(forcedIndex);

    // 強制ターゲットが設定されている場合、そのインデックスのみ選択可能
    if (actor && adjustedIndex >= 0 && this.index() !== adjustedIndex && actor.isForcedSelectTarget()) {
      // 強制ターゲット以外を選択しようとした場合にブザー音を鳴らす
      SoundManager.playBuzzer();
      return;
    }

    // 通常の処理を実行
    _Window_BattleEnemy_processOk.call(this);
  };

  const _Window_BattleEnemy_drawItem = Window_BattleEnemy.prototype.drawItem;
  Window_BattleEnemy.prototype.drawItem = function(index) {
    const actor = BattleManager.actor();
    const forcedIndex = actor && actor.forcedTargetIndex();
    const adjustedIndex = $gameTroop.adjustedIndexForAliveEnemies(forcedIndex);
    
    // 強制ターゲット以外の文字をグレーアウト
    if ( actor && adjustedIndex >= 0 && index !== adjustedIndex && actor.isForcedSelectTarget() ) {
      this.resetTextColor();
      const name = this._enemies[index].name();
      const rect = this.itemLineRect(index);
      this.changeTextColor(ColorManager.textColor(8));      
      this.drawText(name, rect.x, rect.y, rect.width);
    } else {
      // 通常の描画処理
      _Window_BattleEnemy_drawItem.call(this, index);
    }
  };

})();
