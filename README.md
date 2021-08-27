# is-affected

Build optimisation tool to run commands on feature branches only if they affect files matching a given glob.

![Cloud Build](https://storage.googleapis.com/includr-badges/builds/is-affected/branches/master.svg)

## CLI

```shell
Usage:  check [options] <glob>

Options:
  --repo <repo>        git directory (default: "./")
  --cmd <cmd>          the command to be run if diff matches glob
  --cwd <cwd>          working directory to be used to run command
  --main <mainBranch>  name of the main branch of your repo, used when no --since is provided to find the merge base commit
  --since <since>      commit to diff with
  -h, --help           display help for command
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
			cmd: "npm run build",
			cwd: process.cwd(),
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

A normal pattern (aka non negated) will add paths while negated patterns will remove paths from the list that identify whether or not your code is 'affected'.

```
[
	'src/**,
	!src/tests/**,
]
```

The above examlple will monitor all paths in the `src` folder except for those in the `tests` subfolder.