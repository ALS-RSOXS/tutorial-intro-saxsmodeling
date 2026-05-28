# Installing uv

When you install Python, you get the language itself — but not the scientific libraries
you need. Those must be installed separately, and managing them can become complicated
quickly. Different projects may need different versions of the same library, and
installing everything into a single shared environment is a reliable way to create
hard-to-diagnose conflicts.

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
    everything in one place. It is the recommended tool for new projects. Full
    documentation is at [docs.astral.sh/uv](https://docs.astral.sh/uv/).

## Installation

Open a terminal and run the command for your operating system.

!!! tip "Opening a terminal"
    **macOS:** Open the Terminal app from Applications → Utilities, or press
    `Cmd+Space` and type "Terminal".

    **Windows:** Search for "PowerShell" in the Start menu. Windows Subsystem for
    Linux (WSL2) is an excellent alternative that gives you a full Linux environment
    inside Windows — see
    [Microsoft's WSL documentation](https://learn.microsoft.com/en-us/windows/wsl/)
    for setup instructions.

    **Linux:** Any terminal emulator works.

=== "macOS / Linux"
    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

=== "Windows (PowerShell)"
    ```powershell
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    ```

After installation, **close and reopen your terminal**, then verify that uv is
available:

```bash
uv --version
```

You should see output like `uv 0.4.x` or later. If you see a `command not found`
error, consult the
[uv installation guide](https://docs.astral.sh/uv/getting-started/installation/).

---

**What's next:** [Virtual Environments](3-virtual-environments.md) — creating a
project and installing the scientific packages you will need.
