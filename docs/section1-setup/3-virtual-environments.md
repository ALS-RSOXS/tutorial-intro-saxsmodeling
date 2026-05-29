# Virtual Environments

## What is a virtual environment?

!!! note "Key Concept: Virtual Environments"
    A **virtual environment** is an isolated copy of Python and its installed packages
    that belongs to one specific project. Think of it as a clean laboratory bench:
    everything on that bench is exactly what that experiment needs, and nothing from a
    different experiment can interfere with it.

    When you work inside a virtual environment, installing or upgrading a package
    affects only that project — not anything else on your computer. This makes your
    work reproducible: a collaborator can recreate your exact environment from a single
    configuration file and run your code without modification.

`uv` creates and manages virtual environments automatically. You rarely interact with
them directly — `uv` keeps track of everything for you.

## Creating your project

Navigate to wherever you store your work and create a new project:

```console
$ cd ~/Documents        # or wherever you prefer to keep projects
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
The first run may take a minute or two while packages download.

Verify the installation:

```console
$ uv run python -c "import numpy, scipy, matplotlib; print('All packages OK')"
```

If you see `All packages OK`, your environment is ready.

!!! example "Try It Yourself"
    Open `pyproject.toml` in a text editor (we will install VS Code in a later step,
    but Notepad or any plain-text editor will work for now).

    1. Find the section that lists your installed packages. What version of NumPy
       was installed?
    2. What command would you run to check whether a newer version is available?

??? success "Solution"
    The `[project]` section of `pyproject.toml` contains a `dependencies` key:

    ```toml
    [project]
    dependencies = [
        "numpy>=2.0.0",
        "scipy>=1.13.0",
        "matplotlib>=3.9.0",
        "jupyterlab>=4.2.0",
    ]
    ```

    The version numbers on your machine may differ. To check whether a newer version
    of a package is available:

    ```console
    $ uv add numpy           # uv reports if a newer version exists
    ```

    The [uv documentation](https://docs.astral.sh/uv/) explains how to upgrade
    packages to specific versions.

!!! tip "Git checkpoint"
    ```console
    $ git add pyproject.toml
    $ git commit -m "initialise saxs-tutorial project and install scientific packages"
    ```

---

**What's next:** [Git and GitHub](4-git-github.md) — the version control system
that will track every change you make to your code.
