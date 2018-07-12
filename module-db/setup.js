'use strict'

const inquirer = require('inquirer')
const chalk = require('chalk')
const minimist = require('minimist')

const db = require('./')
const { config } = require('module-utils')

const args = minimist(process.argv)
const prompt = inquirer.createPromptModule()

async function setup () {
  // automate the command with "--yes"
  if (!args.yes) {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will DESTROY your DATABASE, are you sure?'
      }
    ])

    if (!answer.setup) {
      return console.log('Nothing happened :)')
    }
  }

  await db(config.db).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
