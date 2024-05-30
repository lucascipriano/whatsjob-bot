"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseService = void 0;
require("dotenv/config");
const supabase_js_1 = require("@supabase/supabase-js");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabaseService = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
exports.supabaseService = supabaseService;
