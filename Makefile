VERSION=`node -pe "require('./package.json').version"`

run:
	yarn start

prod:
	rm -rf dist
	rm -rf www
	yarn build
	npm pack
