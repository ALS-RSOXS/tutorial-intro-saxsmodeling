You have set up your environment, installed your packages, and written your first
notebook. Before moving to any science, save this work permanently with Git. This
habit — committing at every meaningful checkpoint — is one of the most valuable
practices you can build as a computational scientist.

## Connecting your project to GitHub

First, create a new repository on GitHub:

1. Navigate to github.com and login to your account
1. Click the **+** icon (top right) → **New repository**
2. Name it `saxs-tutorial`
3. Add a short description if you like
4. Choose **Public** or **Private**
5. Check **Add a README file**
6. Check **Add a .gitignore** and select **Python**
6. Click **Create repository**

!!! tip "Use the Python .gitignore template"
    The .gitignore file will automatically exclude specific files from any future commit. These are files that may be sensitive or routine files not necessary to save such as compiled files and virtual environment folders. You can always add more to .gitignore as needed.

Now link your local `saxs-tutorial` folder to the repository on GitHub. Open a
terminal inside VS Code by pressing `` Ctrl+` `` (or going to
**Terminal → New Terminal**), then run:

```console
$ git init
$ git remote add origin git@github.com:yourusername/saxs-tutorial.git
$ git branch -M main
```

Replace `yourusername` with your actual GitHub username. You can find the exact
command on your new repository's page on GitHub — look for the section titled
**…or push an existing repository from the command line**.

## Staging, committing, and pushing

**Step 1: Check what Git can see.**

```console
$ git status
```

Git lists new or modified files that have not yet been committed. Your notebook and
`pyproject.toml` should appear here.

**Step 2: Stage the files you want to include.**

```console
$ git add chapter_01_hello.ipynb pyproject.toml README.md
```

Staging is a deliberate step — it lets you choose exactly which changes go into this
commit. You do not have to include every modified file every time.

**Step 3: Commit with a clear message.**

```console
$ git commit -m "add hello world notebook and project configuration"
```

**Step 4: Push to GitHub.**

```console
$ git push -u origin main
```

The `-u origin main` flags only need to be included on the first push. After that,
`git push` alone is sufficient.

Navigate to your repository on GitHub and refresh the page — your files should be
visible there.

## Files that should not be tracked

Some files should never be committed to Git. The `.venv` folder can be several hundred
megabytes and can always be recreated from `pyproject.toml` using `uv sync`. The
`.ipynb_checkpoints` folder that Jupyter creates automatically is also unnecessary.

If you did not use GitHub's Python template when creating your repository, create a
file called `.gitignore` in your project root and add the following:

```
.venv/
__pycache__/
*.pyc
.DS_Store
.ipynb_checkpoints/
```

Then add and commit it:

```console
$ git add .gitignore
$ git commit -m "add gitignore for Python project"
$ git push
```

## How often should you commit?

There is no single correct answer. A useful rule of thumb: **commit whenever you reach
a state you would be unhappy to lose.** In practice this means after writing a new
function, after a plot looks the way you want it, or at the end of each working
session.

Smaller, more frequent commits with descriptive messages are almost always better than
large, infrequent commits labeled `stuff` or `final2`.

!!! example "Try It Yourself"
    1. Add a new markdown cell to your notebook that describes what the sine wave
       plot is showing, in your own words.
    2. Run the notebook top to bottom to confirm everything still works.
    3. Stage and commit the updated notebook with an appropriate message.
    4. Push the commit to GitHub and confirm it appears on the repository page.

??? success "Solution"
    ```console
    $ git add chapter_01_hello.ipynb
    $ git commit -m "add description of sine wave plot to notebook"
    $ git push
    ```

    The commit message should reflect what specifically changed. If you also modified
    other files, include them in the `git add` step before committing.

    To verify on GitHub: navigate to your repository, click on
    `chapter_01_hello.ipynb`, and confirm the new markdown cell is visible.

---

You now have a fully configured scientific computing environment and a version-tracked
project on GitHub. Everything you build from here will be saved and recoverable.

**What's next:** [Section 2 →](../section2-sphere/index.md) — building a mathematical
model of X-ray scattering from a sphere.
