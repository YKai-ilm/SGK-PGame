'use strict';
window.StrategyPoints={
 // Use the same six-ability intelligence displayed on the officer sheet.
 capacity(name){const intelligence=window.HERO_COMBAT_DATA?.[name]?.abilities?.int;return Number.isFinite(intelligence)&&intelligence>=0&&intelligence<=100?Math.floor(intelligence):0;}
};
