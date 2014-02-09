
SOURCES = $(shell find lib -type f -iname "*.js" | grep -v ./splat.js)
OUTPUT = splat.js

splat.js: $(SOURCES)
	browserify lib/main.js -o $(OUTPUT) -s Splat

clean:
	rm -f $(OUTPUT)
