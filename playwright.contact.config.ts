import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({...base,testMatch:["contact.spec.ts","work.spec.ts"],timeout:90000,reporter:[["list"],["json",{outputFile:"docs/evidence/phase-07/playwright-results.json"}]],use:{...base.use,viewport:{width:1440,height:960},launchOptions:{args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]}}});
