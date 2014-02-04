
SOURCES = $(shell find . -type f -iname "*.js" | grep -v ./splat.js)
OUTPUT = splat.js

splat.js: $(SOURCES)
	browserify main.js -o $(OUTPUT) -s Splat

clean:
	rm -f $(OUTPUT)
