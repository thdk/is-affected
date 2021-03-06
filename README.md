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
		"app/client/**",
		{
			repo: "./",
			cmd: "npm run build",
			cwd: process.cwd(),
			mainBranch: "origin/master",
			since: undefined,
		},
	);
```
