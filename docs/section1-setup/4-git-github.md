# Git and GitHub

## Why scientists should use version control

Imagine writing a simulation, getting results you are happy with, then making changes
to improve the code — only to discover that the new version no longer reproduces your
original results, and you cannot remember exactly what you changed. This is an
extremely common and genuinely frustrating experience.

**Version control** is the solution. **Git** is a tool that records every change you
make to your project files, along with a short description of what changed and why.
At any point you can look back through the complete history of your work, compare any
two versions side by side, or restore an earlier state exactly.

**GitHub** is a website that stores a copy of your Git history in the cloud, making it
accessible from any computer and easy to share with collaborators. It is the most
widely used code-hosting platform in the scientific community.

!!! note "Key Concept: The Core Git Workflow"
    The everyday Git workflow involves three steps that you will repeat throughout
    this tutorial and beyond:

    1. **Stage** the changes you want to save: `git add`
    2. **Commit** with a short message describing what changed: `git commit`
    3. **Push** your commit to GitHub: `git push`

    Think of a commit as a labelled snapshot of your project at a specific moment.
    A good commit message is short but informative. `add sphere form factor function`
    is far more useful than `update` or `changes` when you are reading history six
    months later.

## Installing Git

=== "macOS"
    Git is often pre-installed. Check by running `git --version` in a terminal.
    If it is absent, install the Xcode Command Line Tools:

    ```bash
    xcode-select --install
    ```

    Alternatively, download Git from
    [git-scm.com/downloads](https://git-scm.com/downloads).

=== "Windows"
    Download the installer from
    [git-scm.com/downloads/win](https://git-scm.com/downloads/win) and accept the
    default options. The installer includes **Git Bash**, a terminal that works well
    for the commands in this tutorial if you are not using WSL2.

=== "Linux (Debian / Ubuntu)"
    ```bash
    sudo apt install git
    ```

=== "Linux (Fedora)"
    ```bash
    sudo dnf install git
    ```

Confirm the installation:

```bash
git --version
```

## Configuring Git

Before using Git for the first time, tell it your name and email address. These are
attached to every commit and appear in your project history:

```bash
git config --global user.name  "Your Name"
git config --global user.email "your.email@example.com"
```

Use the same email address you will register with GitHub.

## Creating a GitHub account

Go to [github.com](https://github.com) and create a free account if you do not already
have one. Choose a professional username — it will be visible to collaborators and can
appear in a CV or portfolio.

---

**What's next:** [SSH Keys](5-ssh-keys.md) — connecting your computer to GitHub
securely so that you can push code without entering a password every time.
