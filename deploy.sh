#/bin/bash
npm run build
git add .
git commit -m "Updating build"
git push origin :gh-pages
git subtree push --prefix build origin gh-pages
