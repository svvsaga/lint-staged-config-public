npm set-script prepare "npx husky install"
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged"
