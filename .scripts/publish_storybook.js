require('shelljs/global')
var path = require('path')

set('-e')

var gitPath = exec('git config --get remote.origin.url').stdout.trim();

echo(`> Git path: ${gitPath}`)

if(gitPath == ""){
    echo("This project is not configured with a remote git repo")
    exit(1)
}

echo('> Removing .out dir')
rm('-rf', '.out')
echo('> Creating .out dir')
mkdir('.out')

echo('> Build story .out')
exec('build-storybook -o .out')

cd('.out')
echo('> Initialize git repo in .out')
exec('git init')

echo('> Setting up git config in .out')
exec('git config user.name "GH Pages Bot"')
exec('git config user.email "hello@ghbot.com"')

echo('> Adding all files in .out')
exec('git add .')
echo('> Committing in .out')
exec('git commit -m "Deploy Storybook to GitHub Pages"')

echo('> Pushing to repo in .out')
echo(`> Executing: git push --force --quiet ${gitPath} master:gh-pages`)
exec(`git push --force --quiet ${gitPath} master:gh-pages`)

cd('..')
rm('-rf', '.out')

echo("")
var urlPath = exec(`node .scripts/get_gh_pages_url.js ${gitPath}`).stdout
echo(`=> Storybook deployed to: "${urlPath}"`)
