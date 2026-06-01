## What is a virtual environment?

A **virtual environment** is an isolated copy of Python and its installed packages that belong to a specific project. Everything installed should be exactly what is required for the current project and nothing that may interfere.

When you work inside a virtual environment, installing or upgrading a package
affects only that project — not anything else on your computer. This makes your
work reproducible: a collaborator can recreate your exact environment from a single
configuration file and run your code without modification.

`uv` creates and manages virtual environments automatically. You rarely interact with
them directly — `uv` keeps track of everything for you.

## Creating your project

Navigate to wherever you store your work and create a new project:

!!! note "Navigating directories in the terminal"
    '$ cd' is a helpful terminal command  
    "Change Directory". Relative paths can be given by '../path/to/directory' or begin from the home directory with a '~'.

```console
$ cd ~/Documents/projects        # or wherever you prefer to keep projects
$ uv init saxs-tutorial
$ cd saxs-tutorial
```

`uv` creates the following structure:

```
saxs-tutorial/
    pyproject.toml    # project configuration and dependencies
    README.md         # project description
    hello.py          # a minimal starter script
```

!!! note "What is pyproject.toml?"
    `pyproject.toml` is the central configuration file for your project. It records
    the project name, the Python version required, and the list of packages your
    project depends on. You will rarely need to edit it by hand — `uv` updates it
    automatically as you add packages. This file is what allows anyone to recreate
    your environment exactly by running `uv sync`.

## Installing scientific packages

Install the libraries you will need throughout this tutorial:

```console
$ uv add numpy scipy matplotlib jupyterlab
```

`uv` creates a virtual environment in a hidden `.venv` folder inside your project,
installs the requested packages into it, and updates `pyproject.toml` automatically.
The first run may take a minute or two while packages download. This command will also install all required packages for 'numpy', 'scipy', 'matplotlib', and 'jupyterlab'. A total of ~60 packages will be installed.uv run python 

Verify the installation:

```console
$ uv run python -c "import numpy, scipy, matplotlib; print('All packages OK')"
```

If you see `All packages OK`, your environment is ready.


**What's next:** [Git and GitHub](4-git-github.md) — the version control system
that will track every change you make to your code.
