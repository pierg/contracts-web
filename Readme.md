# Contracts-web

Web Interface for the Contracts package.

## System Requirements

[Strix](https://strix.model.in.tum.de) must be installed on the system.

### Dependencies

Clone crome-logic, crome-contracts, crome-cgg and crome-synthesis from git in the same
folder where synthesis-web is located

```bash
git clone https://github.com/pierg/crome-logic.git
```

```bash
git clone https://github.com/pierg/crome-contracts.git
```

```bash
git clone https://github.com/pierg/crome-cgg.git
```

```bash
git clone https://github.com/pierg/crome-synthesis.git
```

Append it to PYTHONPATH

```bash
export PYTHONPATH=$PYTHONPATH:../crome-logic/:../crome-contracts/:../crome-cgg/:../crome-synthesis/
```

## Installation

We use
[conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html) to
manage the environment and dependencies.

We use [poetry](https://github.com/python-poetry/poetry) to manage 'development'
dependencies (e.g. linting, type checking).


You need to install `conda-merge` so that we can merge all the dependecies from the other repositories and create the `environment.yml`
```bash
pip install conda-merge
```

Once `conda-merge` is installed, you can create the `envioronment.yml` file, create the environment and activate it by runnin the following commands:
```bash
make conda-create
make conda-install
make conda-activate
```

Install the other dependencies with poetry (optional):

```bash
poetry install
```

## License

[MIT](https://github.com/piergiuseppe/crome-synthesis/blob/master/LICENSE)

## Features and Credits

- This project has been initially generated with
  [`wemake-python-package`](https://github.com/wemake-services/wemake-python-package).
