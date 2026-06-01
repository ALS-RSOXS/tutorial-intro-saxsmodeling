When you install Python, you get the language itself — but not the scientific libraries
you need. Those must be installed separately, and managing them can become complicated
quickly. Different projects may need different versions of the same library, and
installing everything into a single shared environment is a reliable way to create
hard-to-diagnose conflicts. This is especially true with many scientific codebases as they are often poorly maintained by temporary researchers such as PhD candidates or Postdoctoral scholars.

**uv** is a modern Python package and project manager that solves this cleanly. It
handles three things automatically:

1. Installing and managing Python itself
2. Creating isolated environments for each project so packages never conflict
3. Tracking the exact version of every package your project depends on

!!! note "Why not pip or conda?"
    `pip` is Python's built-in package installer. It works, but it does not manage
    Python itself, does not create isolated environments automatically, and can be
    slow. `conda` is a popular alternative in scientific computing, but it is
    heavyweight and can conflict with existing Python installations.

    `uv` is written in Rust and designed to be a single, fast tool that handles
    everything in one place. It is the recommended tool for the ALS RSOXS group when beginning new projects.Full
    documentation is at [docs.astral.sh/uv](https://docs.astral.sh/uv/).

## Installation

Instructions on installing **uv** can be found from the online documentation at [docs.astral.sh/uv](https://docs.astral.sh/uv/).


!!! tip "Opening a terminal"
    You will be asked to 'open a terminal' to complete the **uv** instalation. We will use the terminal throughout this tutorial as it is often the most useful method to install and manage Python packages. It may feel obtuse at first, but it is very powerful.

    **macOS:** Open the Terminal app from Applications → Utilities, or press
    `Cmd+Space` and type "Terminal".

    **Windows:** Search for "PowerShell" in the Start menu. 

    **Linux:** Any terminal emulator works.

After installation, **close and reopen your terminal**, then verify that uv is
available:

```console
$ uv --version
```

You should see output like `uv 0.4.x` or later. If you see a `command not found`
error, consult the
[uv installation guide](https://docs.astral.sh/uv/getting-started/installation/).

---

**What's next:** [Virtual Environments](3-virtual-environments.md) — creating a
project and installing the scientific packages you will need.
