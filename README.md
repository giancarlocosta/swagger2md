swagger2md
================

Utility to convert Swagger JSON/yaml to Markdown files.<br/>
_Supports swagger 2.0 format only_

See [examples](https://github.com/giancarlocosta/swagger2md/tree/master/examples) folder

### Installation

    npm install swagger2md

### Usage

```
npm install -g swagger2md
swagger2md [-h] [-v] -i  [-o]

Options:
  -h, --help      Show this help message and exit.
  -v, --version   Show program's version number and exit.
  -i , --input    Path to the swagger yaml file
  -o , --output   Path to the resulting md file

```

or

```
npm i --save-dev swagger2md
node_modules/swagger2md/bin/index.js -i /path/to/swagger-api-specification.json -o api.md;
```
