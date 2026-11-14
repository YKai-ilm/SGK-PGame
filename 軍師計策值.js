'use strict';
window.StrategyPoints={
 canAppoint(name){const i=window.HERO_COMBAT_DATA?.[name]?.abilities?.int;return Number.isInteger(i)&&i>=65&&i<=100;},
 // Use the same six-ability intelligence displayed on the officer sheet.
 capacity(name){const intelligence=window.HERO_COMBAT_DATA?.[name]?.abilities?.int;return Number.isFinite(intelligence)&&intelligence>=65&&intelligence<=100?Math.floor(intelligence):0;}
};
