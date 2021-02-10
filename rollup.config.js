import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import {config} from 'dotenv';
import replace from '@rollup/plugin-replace';
import gzipPlugin from 'rollup-plugin-gzip'

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

//Todo separate the treemap and treecounter.js files
export default [{
  input: "src/TreeMap/tree-map.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/tree-map.js",
  },
  plugins: [
    gzipPlugin(),
    replace({
      // stringify the object
      __myapp: JSON.stringify({
        env: {
          isProd: production,
          ...config().parsed // attached the .env config
        }
      }),
    }),
    svelte({
      include: /App\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: true
      },
      emitCss: false,
    }),
    svelte({
      exclude: /App\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: false
      },
      emitCss: false,
    }),
    json(),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
},{
  input: "src/TreeProfile/tree-profile.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/tree-profile.js",
  },
  plugins: [
    gzipPlugin(),
    replace({
      // stringify the object
      __myapp: JSON.stringify({
        env: {
          isProd: production,
          ...config().parsed // attached the .env config
        }
      }),
    }),
    svelte({
      include: /App\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: true
      },
      emitCss: false,
    }),
    svelte({
      exclude: /App\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: false
      },
      emitCss: false,
    }),
    json(),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
},{
  input: "src/TreeTenantCounter/TreeTenantCounter.js",
  output: {
    sourcemap: false,
    format: "iife",
    name: "app",
    file: "public/build/tenantCounter.js",
  },
  plugins: [
    gzipPlugin(),
    replace({
      // stringify the object
      __myapp: JSON.stringify({
        env: {
          isProd: production,
          ...config().parsed // attached the .env config
        }
      }),
    }),
    svelte({
      include: /App\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: true
      },
      emitCss: false,
    }),
    svelte({
      exclude: /App\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: false
      },
      emitCss: false,
    }),
    json(),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
},{
  input: "src/TreeTenantLeaderboard/TreeTenantLeaderboard.js",
  output: {
    sourcemap: false,
    format: "iife",
    name: "app",
    file: "public/build/tenantLeaderboard.js",
  },
  plugins: [
    gzipPlugin(),
    replace({
      // stringify the object
      __myapp: JSON.stringify({
        env: {
          isProd: production,
          ...config().parsed // attached the .env config
        }
      }),
    }),
    svelte({
      include: /App\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: true
      },
      emitCss: false,
    }),
    svelte({
      exclude: /App\.svelte$/,
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        customElement: false
      },
      emitCss: false,
    }),
    json(),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}];
