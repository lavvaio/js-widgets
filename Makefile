run:
	yarn start

prod:
	yarn build
	npx microbundle -i src/index.ts -o dist/bundle.js --no-pkg-main -f umd
	npm pack
