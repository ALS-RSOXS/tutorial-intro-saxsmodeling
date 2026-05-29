.PHONY: install docs docs-serve clean

# Install all dependencies
install:
	uv sync

# Build the static documentation site into site/
docs:
	uv run mkdocs build

# Serve the documentation locally with live reload
docs-serve:
	uv run mkdocs serve

# Remove the built site directory
clean:
	rm -rf site/
