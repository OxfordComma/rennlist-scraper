import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
// import json from 'rollup-plugin-json';
import  { eslint } from 'rollup-plugin-eslint'

 
export default [{
	input: 'js/997.js',
	external: ['d3'],
	output: {
		name: 'scatterplot',
		file: 'public/997.js',
		format: 'iife',
		sourcemap: true,
		globals: { d3: 'd3'}
	},
	plugins: [
		commonjs(),
		globals(),
		resolve(),
		builtins(),
		eslint({
			"parserOptions": {
				"sourceType": "module",
			}
		})
		// json()
	]
// }, {
//   input: '997.js',
//   external: ['d3'],
//   output: {
//     name: 'scatterplot',
//     file: 'public/997.js',
//     format: 'iife',
//     sourcemap: true,
//     globals: { d3: 'd3'}
//   },
//   plugins: [
//     commonjs(),
//     globals(),
//     resolve(),
//     builtins(),
//     eslint()
//     // json()
//   ]
}, {
	input: 'js/stackedArea_main.js',
	external: ['d3', 'jquery'],
	output: {
		file: 'public/stackedAreaBundle.js',
		format: 'iife',
		sourcemap: true,
		globals: { d3: 'd3', jquery: 'jquery'}
	},
	plugins: [
		commonjs(),
		globals(),
		resolve(),
		builtins(),
		eslint({
			"parserOptions": {
				"sourceType": "module",
			}
		})
		// json()
	]
}]