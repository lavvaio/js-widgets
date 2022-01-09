VERSION=`node -pe "require('./package.json').version"`

run:
	yarn start

prod:
	rm -rf dist
	rm -rf www
	yarn build
	npm pack

cdn: prod
	mkdir -p cdn/${VERSION}
	cp -rv www/build/* cdn/${VERSION}
