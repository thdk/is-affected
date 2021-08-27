# is-affected

Build optimisation tool to run commands on feature branches only if they affect files matching a given glob.

![Cloud Build](https://storage.googleapis.com/includr-badges/builds/is-affected/branches/master.svg)

## CLI

```shell
Usage: is-affected [options]

runs command only if the git diff since the fork point from master branch contains files matching glob

Options:
  -V, --version           output the version number
  --pattern [pattern...]  provide one or more patterns to check file paths from git diff against
  --repo <repo>           git directory (default: "./")
  --cmd <cmd>             the command to be run if diff matches glob
  --cwd <cwd>             working directory to be used to run command
  --main <mainBranch>     name of the main branch of your repo, used when no --since is provided to find the merge base commit (default: "origin/master")
  --since <since>         commit to diff with
  -h, --help              display help for command
```

**Example**

To run `npm run build` only if the git diff between your current branch head and the base commit on the master branch contains files matching glob `app/client/**`.

```shell
npx is-affected app/client/** --cmd "npm run build" --cwd "app/client"
```

## Javascript API

```javascript
const { isAffected, exec } = require("is-affected");

const build = async () => {
	const shouldBuild = await isAffected(
		"app/client/**",
	);

	if (shouldBuild) {
		await exec("npm run build", "app/client");
	}
};

build();
```

or with options object (using defaults here):
```javascript
const shouldBuild = await isAffected(
		"app/client/**", // see match patterns below
		{
			repo: "./",
			mainBranch: "origin/master",
			since: undefined,
		},
	);
```

## Match patterns

A match means that the git diff contains paths that match the pattern and your code is 'affected'.

### Negated pattern
You can use a negated pattern: `!src/scripts`

This will ignore changes in the `src/scripts` folder. If your diff contains only changes in `src/scripts` then your code will not be marked as 'affected'.

### Multiple patterns

A normal pattern (aka non negated) will add paths to the match list. Negated patterns will remove paths from the list. Your code is 'affected' when the list is not empty after the last pattern has been evaluated.

```javascript
const shouldBuild = await isAffected([
    	'src/**',
    	'!src/tests/**',
]);
```

or using cli:
```
npx is-affected src/** !src/tests/**
```

Note that if your shell is automatically expanding glob patterns you should escape the asterix:

```
npx is-affected src/\** !src/tests/\**
```

The above example will monitor all paths in the `src` folder except for those in the `tests` subfolder.