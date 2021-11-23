npm set-script prepare "husky install"
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged"
