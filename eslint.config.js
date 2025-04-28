import { FlatCompat } from "@eslint/eslintrc";
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
		ignores: ['.next']
	},
  ...compat.extends("next/core-web-vitals"),
  {
    files: ['**/*.ts', '**/*.tsx'],
		extends: [
			...tseslint.configs.recommended,
			// ...tseslint.configs.recommendedTypeChecked,
			// ...tseslint.configs.stylisticTypeChecked
		],
      rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
	'@typescript-eslint/no-explicit-any': 'off', // Turn off completely
	"@typescript-eslint/no-unused-expressions": [
		"error",
		{
		  "allowShortCircuit": true,
		  "allowTernary": true,
		  "allowTaggedTemplates": true,
		  "enforceForJSX": false
		}
	  ]
  },
  },
  {
		linterOptions: {
			reportUnusedDisableDirectives: true
		},
		languageOptions: {
			parserOptions: {
				projectService: true
			}
		}
	}
)