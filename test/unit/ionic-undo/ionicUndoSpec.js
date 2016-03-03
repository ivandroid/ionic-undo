/* global expect */

"use strict";


describe("modules", function() {
    var module;
    var dependencies = [];

    var hasModule = function(module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function() {
        module = angular.module("ionicUndo");
        dependencies = module.requires;
    });
    
    it("should load directives module", function() {
        expect(hasModule("ionicUndo.directives")).toBeTruthy();
    });

    it("should load providers module", function() {
        expect(hasModule("ionicUndo.providers")).toBeTruthy();
    });
    
    it("should load services module", function() {
        expect(hasModule("ionicUndo.services")).toBeTruthy();
    });
});