/**
* @fileoverview Translates a HDQL linked-parse-forest to plain English.
* @copyright Copyright (C) 2019 Haximilian
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*  http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
require("format-unicorn");
"use strict";

/**
* Translates the current tree into English
*/
function translateTree(tree) {
  switch(tree.type) {
    case "if":
      let out = translateTree(tree.then) + ", but only " + translateTree(tree.conditional);
      if(tree.else != undefined)
        out += ". Otherwie, " + translateTree(tree.else);
      return out;

    case "as":
      return translateTree(tree.val) + "as a " + tree.conversion;

    case "method":
      // Translate the method to english:
      let tmp = [];
      tree.params.forEach((param) => {
        tmp.push(translateTree(param));
      });
      return String.prototype.formatUnicorn.call(tree.english, tmp);

    default:
      // Handle all constants & vars:
      if(tree.english != undefined)
        return tree.english;
      return tree.val;
  }
}

/**
* Parses the forest into trees & has translateTree itterate over them.
* @param {Object} forest A handle to the linked forest.
* @param {String} sp The name of the service provider.
* @return {String} The english version of the query forest.
*/
function translateForest(forest, sp) {
  let out = sp + " would like to know:\n";
  forest.forest.forEach((tree) => {
    if(typeof tree != "object")
      return;
    out += " - " + translateTree(tree) + ".\n";
  });
  return out;
}

// Export the translateForest method:
module.exports = translateForest;
