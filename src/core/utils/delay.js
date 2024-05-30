"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
const delay = (t, v) => {
    return new Promise((resolve) => setTimeout(() => resolve(v), t));
};
exports.delay = delay;
