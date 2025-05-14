/*
----------------------------------------------------------------------------
 (C)2025 KEN
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/05/14 初版
----------------------------------------------------------------------------
*/
/*:
 * @target MZ
 * @plugindesc ステートのカテゴリを設定します
 * @author KEN
 * @url https://raw.githubusercontent.com/t-kendama/RPGMakerMZ/refs/heads/master/KEN_CategoryState.js
 * 
 * @help
 * -------------------------    概要    -------------------------
 * ステートにカテゴリを定義し、カテゴリ単位のステート解除が可能になります。
 * 
 * 機能：
 * ・スキル・アイテムでカテゴリごとのステート解除ができる
 * ・優先度を指定して解除順を制御できる
 * 
 * -------------------------    使い方    -------------------------
 * プラグインパラメータにステートのカテゴリ設定を行います。
 * アイテム・スキルのメモ欄に解除したいステートのカテゴリを
 * 記述することで、カテゴリ単位のステート解除ができるようになります。
 * 
 * 【データベース設定】
 * <RmCategoryState:カテゴリ名, ステート解除数(省略可)>
 * 記述欄：アイテム・スキル
 * 指定カテゴリに属するステートを解除します。
 * 
 * 優先順位が同じステートがある場合、ステートIDが若い方から順に解除されます。
 * 数値を省略すると、カテゴリに属するすべてのステートを解除します。
 *  
 * 
 *
 * @param Category
 * @type struct<CategoryConfig>[]
 * @text カテゴリ設定
 * @desc カテゴリ設定です。
 * @default []
 */

/*~struct~CategoryConfig:
 * @param name
 * @type string
 * @text カテゴリ名
 * @desc カテゴリ名に使用する名称です
 *
 * @param stateId
 * @type struct<StateConfig>[]
 * @text ステート設定
 * @desc カテゴリに属するステートを設定します
 */

/*~struct~StateConfig:
 * @param stateId
 * @type state
 * @text ステートID
 * @desc カテゴリに属するステートを設定します
 *
 * @param removePriority
 * @type number
 * @text ステート解除優先度
 * @desc RmCategoryStateタグで解除される時の優先度。数が大きいほど優先的に解除されます。
 * @default 0
 * @min 0
 */

(() => {
  "use strict";
  
  const PLUGIN_NAME = "KEN_CategoryState";
  const pluginParams = PluginManager.parameters(PLUGIN_NAME);
  const param = JSON.parse(JSON.stringify(pluginParams, function(key, value) {
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
  
  const CategoryStateManager = {
    _stateIdToCategory: new Map(),
  
    setup(categoryParam) {
      for (const category of categoryParam.Category) {
        const categoryName = category.name;
        for (const stateInfo of category.stateId) {
          const stateId = Number(stateInfo.stateId);
          const removePriority = Number(stateInfo.removePriority || 0);
          this._stateIdToCategory.set(stateId, { categoryName, removePriority });
        }
      }
    },
  
    categoryOf(stateId) {
      const data = this._stateIdToCategory.get(stateId);
      return data ? data.categoryName : null;
    },
  
    removePriorityOf(stateId) {
      const data = this._stateIdToCategory.get(stateId);
      return data ? data.removePriority : 0;
    },
  
    statesInCategory(categoryName) {
      const list = [];
      for (const [stateId, data] of this._stateIdToCategory.entries()) {
        if (data.categoryName === categoryName) {
          list.push(stateId);
        }
      }
      return list;
    }
  };
  
  Game_Battler.prototype.removeStatesByCategory = function(categoryName, count) {
    const states = this.states().filter(state => {
      return CategoryStateManager.categoryOf(state.id) === categoryName;
    });
  
    states.sort((a, b) => {
      const pa = CategoryStateManager.removePriorityOf(a.id);
      const pb = CategoryStateManager.removePriorityOf(b.id);
      if (pa !== pb) {
        return pb - pa;
      } else {
        return a.id - b.id;
      }
    });
  
    if (count && count > 0) {
      for (let i = 0; i < count && i < states.length; i++) {
        this.removeState(states[i].id);
      }
    } else {
      for (const state of states) {
        this.removeState(state.id);
      }
    }
  };
  
  Game_Battler.prototype.statesInCategory = function(categoryName) {
    return this.states().filter(state => {
      return CategoryStateManager.categoryOf(state.id) === categoryName;
    }).map(state => state.id);
  };
  
  CategoryStateManager.setup(param);
  
  const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
  Game_Action.prototype.applyItemUserEffect = function(target) {
    this.applyRemoveCategoryEffects(target);
    _Game_Action_applyItemUserEffect.call(this, target);
  };
  
  Game_Action.prototype.applyRemoveCategoryEffects = function(target) {
    const item = this.item();
    if (!item || !item.meta || !item.meta.RmCategoryState) {
      return;
    }
  
    const meta = item.meta.RmCategoryState;
    const args = meta.split(',').map(arg => arg.trim());
    const categoryName = args[0];
    const count = args[1] ? Number(args[1]) : null;
  
    target.removeStatesByCategory(categoryName, count);
  };
  
  })();
  