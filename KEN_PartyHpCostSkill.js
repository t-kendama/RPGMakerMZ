/*
----------------------------------------------------------------------------
 KEN_PartyHpCostSkill.js v1.0.0
----------------------------------------------------------------------------
 (C)2024 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/12/01 初版
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc パーティメンバーHPを消費するスキル
 * @author KEN
 * @version 1.0.0
 * @url 
 * 
 * @help
 *
 * -------------------------    概要    -------------------------
 * パーティメンバーのHPを消費するスキルを実装します。
 * 消費HPは実数・割合で指定可能です。
 * 
 * 【細かい仕様】
 * ・消費HPよりもHPが少ない場合でもスキルは使用可能です
 * ・スキル効果でHP消費しても戦闘不能にはならず、HPは1残ります
 * 
 * -------------------------    使い方    -------------------------
 * データベースのメモ欄に設定します。
 * 
 * <PartyCostHp:[消費HP]>
 * 記述欄：スキル
 * スキル使用時、パーティのHPを消費します。
 * 例．
 * <PartyCostHp:30>
 * スキル使用時、パーティのHPが30消費します。
 *  
 * <PartyCostHpRate:[消費HP割合（単位%）]>
 * 記述欄：スキル
 * スキル使用時、パーティのHPを消費します。
 * 最大HPの割合を参照してHPを消費します。
 * ※ 消費HPはスキル使用者ではなく、アクター各々の最大HPを参照します
 * 
 * 例．
 * <PartyCostHpRate:10>
 * スキル使用時、パーティ全員のHPを最大HPの10％を消費します。
 * 
 */

(() => {
  "use strict";

  const PLUGIN_NAME = "KEN_PartyHpCostSkill";
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

  //====================================================================
  // ●Game_Action
  //====================================================================
  const _Game_Battler_paySkillCost = Game_Battler.prototype.paySkillCost;
  Game_BattlerBase.prototype.paySkillCost = function(skill) {
    _Game_Battler_paySkillCost.call(this, skill);
    this.processPartyHpSkill(skill);
  };

  Game_BattlerBase.prototype.processPartyHpSkill = function(skill) {
    for(const actor of $gameParty.members()) {
      if(!actor.isDead()) {
        this.result().partyHpCostMemberNum += 1;
        this.result().partyHpCostSum += actor.paySkillPartyHpCost(skill);        
      }
    }
  };

  Game_BattlerBase.prototype.paySkillPartyHpCost = function(skill) {    
    const previousHp = this._hp;
    const hpResult = Math.max(this._hp - this.skillPartyHpCost(skill), 1);
    this._hp = hpResult;
    return previousHp - hpResult;   // 消費したHPを返す
  };

  Game_BattlerBase.prototype.skillPartyHpCost = function(skill) {
    const costHpTag = skill.meta.PartyCostHp; // 固定値
    const costHpRateTag = skill.meta.PartyCostHpRate; // 割合
    const hpCost = costHpTag ? parseInt(costHpTag, 10) : 0;
    const hpRateCost = costHpRateTag ? Math.floor(this.mhp * Number(costHpRateTag) / 100) : 0;
    return hpCost + hpRateCost;
  };

  // HP消費スキルの消費HPコスト合計
  Game_BattlerBase.prototype.skillPartyHpCostSum = function(skillId) {
    const skill = (skillId > 0) ? $dataSkills[skillId] : null;
    if(!skill) return 0;
    let result = 0;
    for(const actor of $gameParty.aliveMembers()) {
      result += actor.skillPartyHpCost(skill);
    }
    return result;
  };

  //====================================================================
  // ●Game_ActionResult
  //====================================================================
  const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    _Game_ActionResult_clear.call(this);
    this.partyHpCostMemberNum = 0;  // HPコストの合計人数
    this.partyHpCostSum = 0;        // パーティHPコストで消費したHP合計
  };

  
})();